const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/authCheck')
//import controller
const { changeOrderStatus,getOrderAdmin } = require('../controllers/admin')


/**
 * @swagger
 * tags:
 *   name: Order By Admin
 *   description: API สำหรับการเรียกข้อมูล Order การสั่งซื้อทั้งหมด และการปรับเปลี่ยนสถานะ Order
 */


/**
 * @swagger
 * /admin/order-status:
 *   put:
 *     summary: "เปลี่ยนสถานะของคำสั่งซื้อ"
 *     description: "API สำหรับการเปลี่ยนสถานะของคำสั่งซื้อ เช่น 'Pending', 'Shipped', 'Delivered'"
 *     tags: [Order By Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: integer
 *               orderStatus:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Cancelled]
 *     responses:
 *       200:
 *         description: การอัปเดตสถานะคำสั่งซื้อสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 orderStatus:
 *                   type: string
 *       400:
 *         description: คำขอไม่ถูกต้อง หรือไม่พบคำสั่งซื้อ
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.put('/admin/order-status',authCheck,changeOrderStatus)

/**
 * @swagger
 * /admin/orders:
 *   get:
 *     summary: "ดึงข้อมูลรายการสั่งซื้อทั้งหมด"
 *     description: "API สำหรับดึงข้อมูล Order ทั้งหมดรวมถึงรายละเอียดสินค้าที่สั่งซื้อ"
 *     tags: [Order By Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: รายการสั่งซื้อทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   orderStatus:
 *                     type: string
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: integer
 *                         count:
 *                           type: integer
 *                         price:
 *                           type: number
 *                           format: float
 *                   orderedBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       email:
 *                         type: string
 *                       address:
 *                         type: string
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.get('/admin/orders',authCheck,getOrderAdmin)



module.exports = router