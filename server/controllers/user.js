const prisma = require("../config/prisma");

//old
// exports.listUsers = async(req,res)=> {
//     try {
//         const users = await prisma.user.findMany({
//             select:{
//                 id:true,
//                 email:true,
//                 name:true,
//                 role:true,
//                 enabled:true,
//                 address:true,
//                 createdAt:true,
//                 updatedAt:true
//             }
//         })
//         res.json(users)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: 'Server Error'
//         })
//     }
// }

// exports.listUsers = async (req, res) => {
//   const { page, limit, sort, query } = req.query;
//   // const { query } = req.body

//   // ตรวจสอบ limit, ถ้าไม่มีหรือเป็น 0 จะดึงข้อมูลทั้งหมด
//   const take = limit && parseInt(limit) > 0 ? parseInt(limit) : undefined;
//   const skip = take && page ? (parseInt(page) - 1) * take : undefined;
//   const orderBy = sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }; // การจัดเรียง

//   try {
//     // ดึงข้อมูลจากฐานข้อมูล
//     const users = await prisma.user.findMany({
//       skip: skip,
//       take: take,
//       orderBy: orderBy,

//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         enabled: true,
//         address: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     // นับจำนวนผู้ใช้ทั้งหมด
//     const totalUsers = await prisma.user.count();

//     const handleQuery = await prisma.user.findMany({
//       where: {
//         OR: [
//           {
//             email: {
//               contains: query,
//             },
//           },
//           {
//             category: {
//               name: {
//                 contains: query,
//               },
//             },
//           },
//         ],
//       }
//     })

//     if (query) {
//       console.log("have query-->", query);
//       await handleQuery(req, res, query);
//     }

//     // ส่งข้อมูลกลับ
//     res.json({
//       users,
//       total: totalUsers,
//       page: parseInt(page) || null,
//       limit: parseInt(limit) || null,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// };

exports.listUsers = async (req, res) => {
  const { page, limit, sort, query = "" } = req.query;

  // กำหนดค่าเริ่มต้น
  const take = limit && parseInt(limit) > 0 ? parseInt(limit) : undefined;
  const skip = take && page ? (parseInt(page) - 1) * take : undefined;
  const orderBy = sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }; // การจัดเรียง

  try {
    // เงื่อนไขการค้นหา
    const where = query
  ? {
      OR: [
        { email: { contains: query,  } },
        { name: { contains: query,  } },
        { role: { contains: query,  } },
      ],
    }
  : {}; // เปลี่ยน undefined เป็น {} เพื่อป้องกันข้อผิดพลาด


    // ดึงข้อมูลจากฐานข้อมูล
    const users = await prisma.user.findMany({
      skip: skip,
      take: take,
      orderBy: orderBy,
      where: where, // ใช้เงื่อนไขการค้นหา
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        enabled: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // นับจำนวนผู้ใช้ทั้งหมด (รวม query)
    const totalUsers = await prisma.user.count({
      where: where,
    });

    // ส่งข้อมูลกลับ
    res.json({
      users,
      total: totalUsers,
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


exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    // console.log(id,enabled)
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        enabled: enabled,
      },
    });
    res.send("Update Status Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    // console.log(id,role)
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        role: role,
      },
    });
    res.send("Update Role Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.userCart = async (req, res) => {
  try {
    //รับตะกร้าจากหน้าบ้าน
    const { cart } = req.body;
    console.log(cart);
    console.log(req.user.id);

    //หา user จาก token id = req.user.id
    const user = await prisma.user.findFirst({
      where: {
        id: Number(req.user.id),
      },
    });
    // console.log(user)
    const outOfStockItems = [];
    //check quantity
    //loop cart เก็บไว้ใน item
    for (const item of cart) {
      // console.log(item)
      //ค้นหาสินค้าในตาราง product
      const product = await prisma.product.findUnique({
        //ที่มี item.id ตรงกับ id ของ cart
        where: {
          id: item.id,
        },
        select: {
          quantity: true,
          title: true,
        },
      });
      // console.log('item',item)

      if (!product || item.count > product.quantity) {
        outOfStockItems.push(product?.title || "product");
      }
    }

    // ถ้ามีสินค้าที่หมด ส่งรายการออกไปให้ผู้ใช้
    if (outOfStockItems.length > 0) {
      return res.status(400).json({
        ok: false,
        message: `สินค้าต่อไปนี้หมด: ${outOfStockItems.join(", ")}`,
      });
    }

    //Deleted Old Cart Item
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });

    //Deleted Old Cart
    await prisma.cart.deleteMany({
      where: {
        orderedById: user.id,
      },
    });

    //เตรียมสินค้า
    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    //หาผลรวม
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    //New Cart
    const newCart = await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });

    console.log("newCart: ", newCart);
    res.send("Add Cart Ok");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.getUserCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });
    // console.log(cart)
    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.emptyCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
    });
    if (!cart) {
      return res.status(400).json({
        message: "No Cart",
      });
    }
    await prisma.productOnCart.deleteMany({
      where: {
        cartId: cart.cartId,
      },
    });
    const result = await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });
    // console.log(result)
    res.json({
      message: "Cart Empty Success",
      deletedCount: result.count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.saveAddress = async (req, res) => {
  try {
    const { address } = req.body;
    console.log(address);

    const addressUser = await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        address: address,
      },
    });
    res.json({
      ok: true,
      message: "Update Address Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
exports.saveOrder = async (req, res) => {
  try {
    //step 0 Check stripe
    // console.log(req.body)
    // return res.send('hello stripe')

    const { id, amount, status, currency } = req.body.paymentIntent;
    //step 1 get user cart
    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: {
        products: true,
      },
    });

    //Check empty cart
    if (!userCart || userCart.products.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Cart is Empty",
      });
    }

    const amountTHB = Number(amount) / 100;
    //Creat a new order
    const order = await prisma.order.create({
      data: {
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        orderedBy: {
          connect: {
            id: req.user.id,
          },
        },
        cartTotal: userCart.cartTotal,
        stripePaymentId: id,
        amount: amountTHB,
        status: status,
        currency: currency,
      },
    });

    //update product
    const update = userCart.products.map((item) => ({
      where: {
        id: item.productId,
      },
      data: {
        quantity: {
          decrement: item.count,
        },
        sold: {
          increment: item.count,
        },
      },
    }));
    console.log(update);
    await Promise.all(update.map((updated) => prisma.product.update(updated)));

    //
    await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });
    res.json({
      ok: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
//old
// exports.getOrder = async(req,res)=> {
//     try {
//         const orders = await prisma.order.findMany({
//             where:{
//                 orderedById: Number(req.user.id)
//             },
//             orderBy: {
//                 createdAt: 'desc'
//             },
//             include:{
//                 products: {
//                     include:{
//                         product:true
//                     }
//                 }
//             },

//         })
//         if(orders.length === 0){
//             return res.status(400).json({
//                 ok:false,
//                 message: 'No Orders'
//             })
//         }
//         res.json({
//             ok:true,
//             orders
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             message: 'Server Error'
//         })
//     }
// }

exports.getOrder = async (req, res) => {
  const { page, limit } = req.query;

  // ตรวจสอบ limit, ถ้าไม่มีหรือเป็น 0 จะดึงข้อมูลทั้งหมด
  const take = limit && parseInt(limit) > 0 ? parseInt(limit) : undefined;
  const skip = take && page ? (parseInt(page) - 1) * take : undefined;

  try {
    // ดึงข้อมูลคำสั่งซื้อ
    const orders = await prisma.order.findMany({
      where: {
        orderedById: Number(req.user.id),
      },
      skip: skip,
      take: take,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    // นับจำนวนคำสั่งซื้อทั้งหมด
    const totalOrdersHistory = await prisma.order.count({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    // ตรวจสอบว่าไม่มีคำสั่งซื้อ
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No Orders Found",
      });
    }

    // ส่งข้อมูลกลับ
    res.json({
      orders,
      total: totalOrdersHistory,
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
