const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;

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
  const { page, limit, sortBy = "createdAt", sortOrder = "asc", query = "" } = req.query;

  const take = limit && parseInt(limit) > 0 ? parseInt(limit) : undefined;
  const skip = take && page ? (parseInt(page) - 1) * take : undefined;

    // แปลง sortBy และ sortOrder เป็น Array
    const sortByFields = sortBy.split(","); // เช่น "createdAt,enabled"
    const sortOrders = sortOrder.split(","); // เช่น "asc,desc"
  
  // สร้าง orderBy Array
  const orderBy =
  sortOrder !== "firstToggle"
    ? sortByFields.map((field, index) => ({
        [field]: sortOrders[index] || "asc",
      }))
    : undefined; // ถ้าเป็น default ไม่ต้อง Sort

  try {
     // เงื่อนไขการค้นหา
     const where = query
  ? {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        {
          category: {
            name: { contains: query }, // ใช้ name จาก category โดยตรง
          },
        },
      ],
    }
  : {};
 // เปลี่ยน undefined เป็น {} เพื่อป้องกันข้อผิดพลาด

    // ดึงข้อมูลสินค้า
    const products = await prisma.product.findMany({
      skip: skip,
      take: take,
      orderBy: orderBy, // ใช้ orderBy Array
      where: where, // ใช้เงื่อนไขการค้นหา
      include: {
        category: true,
        images: true,
      },
    });

    // นับจำนวนสินค้าทั้งหมด
    const totalProducts = await prisma.product.count();

    // ส่งข้อมูลกลับ
    res.json({
      products,
      total: totalProducts, // จำนวนสินค้าทั้งหมด
      page: parseInt(page) || null,
      limit: parseInt(limit) || null,
    });
  } catch (error) {
    console.error(error);
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
      where: {
        id: Number(id),
      },
      include: {
        images: true,
      },
    });
    // console.log(product)
    if (!product) {
      return res.status(400).json({
        message: "Product Not Found",
      });
    }
    //step 2 Promise ลบรูปภาพใน cloud ลบแบบรอฉันด้วย
    const deletedImage = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          //ลบจาก cloud
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        })
    );
    await Promise.all(deletedImage);

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

//search text
const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            category: {
              name: {
                contains: query,
              },
            },
          },
        ],
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
//search price
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
//search category
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

    const filterConditions = {
      AND: [],
    };

    // กรองด้วย query
    if (query) {
      filterConditions.AND.push({
        OR: [
          { title: { contains: query } },
          { category: { name: { contains: query } } },
        ],
      });
    }

    // กรองด้วย category
    if (category) {
      filterConditions.AND.push({
        categoryId: { in: category.map((id) => Number(id)) },
      });
    }

    // กรองด้วย price range
    if (price) {
      filterConditions.AND.push({
        price: {
          gte: price[0],
          lte: price[1],
        },
      });
    }

    const products = await prisma.product.findMany({
      where: filterConditions,
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

// exports.searchFilters = async (req, res) => {
//   try {
//     const { query, category, price } = req.body;

//     if (query) {
//       console.log("have query-->", query);
//       await handleQuery(req, res, query);
//     }
//     if (category) {
//       console.log("have category-->", category);
//       await handleCategory(req, res, category);
//     }
//     if (price) {
//       console.log("have price-->", price);
//       await handlePrice(req, res, price);
//     }
//   } catch (error) {
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

// filter product category
exports.listByCategory = async (req, res) => {
  try {
    const { name } = req.params; // รับ category name จาก URL (ที่เป็น lowercase)
    console.log("name", name);
    const category = await prisma.category.findFirst({
      where: {
        name: name.toLowerCase(), // แปลงให้เป็นตัวพิมพ์เล็กเพื่อให้ตรงกับฐานข้อมูล
      },
    });
    console.log("first category", category);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await prisma.product.findMany({
      where: {
        categoryId: category.id, // ใช้ category id ที่ได้รับจากการค้นหา category
      },
      include: {
        category: true,
        images: true,
      },
    });
    console.log("products", products);
    res.send(products);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.createImages = async (req, res) => {
  try {
    // console.log(req.body)
    const result = await cloudinary.uploader.upload(req.body.image, {
      //ตั้งชื่อไฟล์
      public_id: `Product-${Date.now()}`,
      resource_type: "auto",
      folder: "Ecom2024",
    });
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
    const { public_id } = req.body;
    // console.log(public_id)
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove Image Success");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
