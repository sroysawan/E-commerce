const prisma = require("../config/prisma");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await prisma.category.create({
      data: {
        name: name.toLowerCase(),
      },
    });
    // console.log(category)
    res.send(category);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};


exports.list = async (req, res) => {
  const {
    page,
    limit,
    sortBy = "createdAt",
    sortOrder = "asc",
    query = "",
  } = req.query;

  // ตรวจสอบ limit, ถ้าไม่มีหรือเป็น 0 จะดึงข้อมูลทั้งหมด
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
    const lowerQuery = query?.toLowerCase();
    const where = query
      ? {
          OR: [{ name: { contains: lowerQuery ,
            mode: "insensitive" 
          }
           }],
        }
      : {}; // เปลี่ยน undefined เป็น {} เพื่อป้องกันข้อผิดพลาด
    // ดึงข้อมูลจากฐานข้อมูล
    const category = await prisma.category.findMany({
      skip: skip,
      take: take,
      orderBy: orderBy, // ใช้ orderBy Array
      where: where, // ใช้เงื่อนไขการค้นหา
      include: {
        products: true,
      },
    });

    // นับจำนวนหมวดหมู่ทั้งหมด
    const totalCategory = await prisma.category.count({
      where: where,
    });

    // ส่งข้อมูลกลับ
    res.json({
      category,
      total: totalCategory,
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

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
      },
    });
    res.send(category);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(category);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// filter product by category
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
