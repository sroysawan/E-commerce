const express = require('express');
const router = express.Router();
const { authCheck,adminCheck } = require('../middlewares/authCheck')
const { 
    listUsers,
    changeStatus,
    changeRole,
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    saveOrder,
    getOrder 
} = require('../controllers/user')


/**
 * @swagger
 * tags:
 *   name: User
 *   description: API สำหรับการจัดการข้อมูลผู้ใช้ เช่น การดูรายการผู้ใช้, การเปลี่ยนสถานะ, การเพิ่มสินค้าลงในตะกร้า, การสร้างคำสั่งซื้อ เป็นต้น
 */


// Endpoint สำหรับการดูข้อมูลผู้ใช้ทั้งหมด
/**
 * @swagger
 * /users:
 *   get:
 *     summary: "Get list of users"
 *     tags: [User]
 *     description: "ดึงรายการข้อมูลผู้ใช้ทั้งหมด"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: รายการผู้ใช้
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   name:
 *                     type: string
 *                   role:
 *                     type: string
 *                   enabled:
 *                     type: boolean
 *                   address:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: "Internal Server Error"
 */
router.get('/users',authCheck,adminCheck,listUsers)


// Endpoint สำหรับการเปลี่ยนสถานะของผู้ใช้
/**
 * @swagger
 * /change-status:
 *   post:
 *     summary: "Change user status"
 *     tags: [User]
 *     description: "เปลี่ยนสถานะของผู้ใช้ (เปิด/ปิด)"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               enabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: "Update Status Success"
 *       400:
 *         description: "Invalid input"
 *       500:
 *         description: "Internal Server Error"
 */
router.post('/change-status',authCheck,adminCheck,changeStatus)

// Endpoint สำหรับการเปลี่ยนบทบาทของผู้ใช้
/**
 * @swagger
 * /change-role:
 *   post:
 *     summary: "Change user role"
 *     tags: [User]
 *     description: "เปลี่ยนบทบาทของผู้ใช้"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Update Role Success"
 *       400:
 *         description: "Invalid input"
 *       500:
 *         description: "Internal Server Error"
 */
router.post('/change-role',authCheck,adminCheck,changeRole)

// Endpoint สำหรับการเพิ่มสินค้าลงในตะกร้าของผู้ใช้
/**
 * @swagger
 * /user/cart:
 *   post:
 *     summary: "Add products to user cart"
 *     tags: [User]
 *     description: "เพิ่มสินค้าลงในตะกร้าของผู้ใช้"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     count:
 *                       type: integer
 *                     price:
 *                       type: number
 *                       format: float
 *     responses:
 *       200:
 *         description: "Add Cart Ok"
 *       400:
 *         description: "Out of stock or invalid items"
 *       500:
 *         description: "Internal Server Error"
 */
router.post('/user/cart',authCheck,userCart)

// Endpoint สำหรับการดึงข้อมูลตะกร้าของผู้ใช้
/**
 * @swagger
 * /user/cart:
 *   get:
 *     summary: "Get user cart"
 *     tags: [User]
 *     description: "ดึงข้อมูลตะกร้าของผู้ใช้"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: รายการสินค้าที่อยู่ในตะกร้า
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                       count:
 *                         type: integer
 *                       price:
 *                         type: number
 *                         format: float
 *                 cartTotal:
 *                   type: number
 *                   format: float
 *       500:
 *         description: "Internal Server Error"
 */
router.get('/user/cart',authCheck,getUserCart)

// Endpoint สำหรับการลบสินค้าทั้งหมดออกจากตะกร้า
/**
 * @swagger
 * /user/cart:
 *   delete:
 *     summary: "Empty user cart"
 *     tags: [User]
 *     description: "ลบสินค้าทั้งหมดออกจากตะกร้าของผู้ใช้"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: "Cart Empty Success"
 *       400:
 *         description: "No Cart"
 *       500:
 *         description: "Internal Server Error"
 */
router.delete('/user/cart',authCheck,emptyCart)

// Endpoint สำหรับการบันทึกที่อยู่ของผู้ใช้
/**
 * @swagger
 * /user/address:
 *   post:
 *     summary: "Save user address"
 *     tags: [User]
 *     description: "บันทึกที่อยู่ของผู้ใช้"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Update Address Success"
 *       500:
 *         description: "Internal Server Error"
 */
router.post('/user/address',authCheck,saveAddress)

// Endpoint สำหรับการบันทึกคำสั่งซื้อ
/**
 * @swagger
 * /user/order:
 *   post:
 *     summary: "Save user order"
 *     tags: [User]
 *     description: "บันทึกคำสั่งซื้อของผู้ใช้"
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntent:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   currency:
 *                     type: string
 *     responses:
 *       200:
 *         description: "Order Saved"
 *       400:
 *         description: "Cart is Empty"
 *       500:
 *         description: "Internal Server Error"
 */
router.post('/user/order',authCheck,saveOrder)

// Endpoint สำหรับการดึงข้อมูลคำสั่งซื้อของผู้ใช้
/**
 * @swagger
 * /user/order:
 *   get:
 *     summary: "Get user orders"
 *     tags: [User]
 *     description: "ดึงข้อมูลคำสั่งซื้อของผู้ใช้"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: รายการคำสั่งซื้อ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       amount:
 *                         type: number
 *                         format: float
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: "No Orders"
 *       500:
 *         description: "Internal Server Error"
 */
router.get('/user/order',authCheck,getOrder)


module.exports = router