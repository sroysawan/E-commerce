const prisma = require('../config/prisma')

exports.changeOrderStatus = async(req,res)=> {
    try {
        const {orderId,orderStatus} = req.body
        // console.log(orderId,orderStatus)
        const orderUpdate = await prisma.order.update({
            where: {
                id: orderId   
            },
            data:{
                orderStatus: orderStatus
            }
        })
        res.json(orderUpdate)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

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

exports.getOrderAdmin = async(req,res)=> {

    const { page, limit } = req.query;
    const take = limit && parseInt(limit) > 0 ? parseInt(limit) : undefined;
    const skip = take && page ? (parseInt(page) - 1) * take : undefined;
  
    try {
        const orders = await prisma.order.findMany({
            skip: skip,
            take: take,
            include:{
                products:{
                    include:{
                        product:true
                    }
                },
                orderedBy:{
                    select:{
                        id:true,
                        email:true,
                        address:true
                    }
                }
            }
        })
        const totalOrder = await prisma.order.count();
        res.json({
            orders,
            total: totalOrder,
            page: parseInt(page) || null,
            limit: parseInt(limit) || null,
          });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

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