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

// old
// exports.list = async(req,res)=> {
//     try {
//         const category = await prisma.category.findMany({
//             include: {
//                 products:true
//             }
//         })
//         res.send(category)
//     } catch (error) {
//         res.status(500).json({
//             message: "Server Error"
//         })
//     }
// }

exports.list = async (req, res) => {
  const { page, limit } = req.query;

  // ตรวจสอบ limit, ถ้าไม่มีหรือเป็น 0 จะดึงข้อมูลทั้งหมด
  const take = limit && parseInt(limit) > 0 ? parseInt(limit) : undefined;
  const skip = take && page ? (parseInt(page) - 1) * take : undefined;

  try {
    // ดึงข้อมูลจากฐานข้อมูล
    const category = await prisma.category.findMany({
      skip: skip,
      take: take,
      include: {
        products: true,
      },
    });

    // นับจำนวนหมวดหมู่ทั้งหมด
    const totalCategory = await prisma.category.count();

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
