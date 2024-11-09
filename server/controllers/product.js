const prisma = require("../config/prisma");
const cloudinary  = require('cloudinary').v2;


//Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});


exports.create = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "asc" },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity, categoryId, images } =
      req.body;

    //clear images
    await prisma.image.deleteMany({
      where: {
        productId: Number(id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    //delete image on cloud
    //step 1: ค้นหาสินค้า include images
    const product = await prisma.product.findFirst({
      where:{
        id: Number(id),
      },
      include:{
        images: true
      }
    })
    // console.log(product)
    if(!product){
      return res.status(400).json({
        message: 'Product Not Found'
      })
    }
    //step 2 Promise ลบรูปภาพใน cloud ลบแบบรอฉันด้วย
    const deletedImage = product.images.map((image)=>
      new Promise((resolve,reject)=>{
        //ลบจาก cloud
        cloudinary.uploader.destroy(image.public_id,(error,result)=>{
          if(error) reject(error)
            else resolve(result)
        })
      })
    )
    await Promise.all(deletedImage)

    //step 3 ลบสินค้า
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    res.send("Delete Success");
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.listby = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: {
        [sort]: order,
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0],
          lte: priceRange[1],
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const { query, category, price } = req.body;

    if (query) {
      console.log("have query-->", query);
      await handleQuery(req, res, query);
    }
    if (category) {
      console.log("have category-->", category);
      await handleCategory(req, res, category);
    }
    if (price) {
      console.log("have price-->", price);
      await handlePrice(req, res, price);
    }
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};




exports.createImages = async (req, res) => {
  try {
    // console.log(req.body)
    const result = await cloudinary.uploader.upload(req.body.image,{
        //ตั้งชื่อไฟล์
        public_id: `Product-${Date.now()}`,
        resource_type: 'auto',
        folder:'Ecom2024'
    })
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const {public_id} = req.body
    // console.log(public_id)
    cloudinary.uploader.destroy(public_id,(result)=>{
      res.send('Remove Image Success');
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
