const prisma = require("../config/prisma");

exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    // console.log(orderId,orderStatus)
    const orderUpdate = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: orderStatus,
      },
    });
    res.json(orderUpdate);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

//old
// exports.getOrderAdmin = async(req,res)=> {
//     try {
//         const orders = await prisma.order.findMany({
//             include:{
//                 products:{
//                     include:{
//                         product:true
//                     }
//                 },
//                 orderedBy:{
//                     select:{
//                         id:true,
//                         email:true,
//                         address:true
//                     }
//                 }
//             }
//         })
//         res.json(orders)

//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: 'Server Error'
//         })
//     }
// }

exports.getOrderAdmin = async (req, res) => {
  const {
    page,
    limit,
    sortBy = "createdAt",
    sortOrder = "asc",
    query = "",
  } = req.query;
  const take = limit && parseInt(limit) > 0 ? parseInt(limit) : undefined;
  const skip = take && page ? (parseInt(page) - 1) * take : undefined;

  // แปลง sortBy และ sortOrder เป็น Array
  const sortByFields = sortBy.split(","); // เช่น "createdAt,enabled"
  const sortOrders = sortOrder.split(","); // เช่น "asc,desc"

  // สร้าง orderBy Array
  const orderBy =
    sortOrder !== "default"
      ? sortByFields.map((field, index) => ({
          [field]: sortOrders[index] || "asc",
        }))
      : undefined; // ถ้าเป็น default ไม่ต้อง Sort

  try {
    // เงื่อนไขการค้นหา
    const where = query
    ? {
        OR: [
          {
            orderedBy: {
              OR: [
                { email: { contains: query,} },
                { address: { contains: query,} },
              ],
            },
          },
          {
            products: {
              some: {
                product: {
                  title: { contains: query,}, // ค้นหา title ของ Product
                },
              },
            },
          },
        ],
      }
    : {};
  

    const orders = await prisma.order.findMany({
      skip: skip,
      take: take,
      orderBy: orderBy, // ใช้ orderBy Array
      where: where, // ใช้เงื่อนไขการค้นหา
      include: {
        products: {
          include: {
            product: true,
          },
        },
        orderedBy: {
          select: {
            id: true,
            email: true,
            address: true,
          },
        },
      },
    });
    const totalOrder = await prisma.order.count();
    res.json({
      orders,
      total: totalOrder,
      page: parseInt(page) || null,
      limit: parseInt(limit) || null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

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
