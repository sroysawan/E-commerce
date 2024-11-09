const express = require('express');
const router = express.Router();

//import controller
const { create,list,read,update,remove,listby,searchFilters,createImages,removeImage } = require('../controllers/product')
const { authCheck,adminCheck} = require('../middlewares/authCheck')

//@ENDPOINT http://localhost:5000/api/product


/**
 * @swagger
 * tags:
 *   name: Product
 *   description: API สำหรับการสร้าง การแสดง การอัพเดทและการลบสินค้า และการค้นหา และการอัพรูปและลบรูป
 */

/**
 * @swagger
 * /product:
 *   post:
 *     summary: "สร้างสินค้าใหม่"
 *     description: "API สำหรับสร้างสินค้าพร้อมกับข้อมูลเช่นชื่อ, ราคา, จำนวน, หมวดหมู่, และภาพ"
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     asset_id:
 *                       type: string
 *                     public_id:
 *                       type: string
 *                     url:
 *                       type: string
 *                     secure_url:
 *                       type: string
 *     responses:
 *       200:
 *         description: สร้างสินค้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.post('/product',create)

/**
 * @swagger
 * /products/{count}:
 *   get:
 *     summary: "ดึงสินค้าตามจำนวนที่ระบุ"
 *     description: "API สำหรับดึงสินค้าจำนวนที่กำหนด เช่น 10 สินค้าแรก"
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: count
 *         required: true
 *         description: จำนวนสินค้าที่ต้องการดึง
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: รายการสินค้าตามจำนวนที่กำหนด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   quantity:
 *                     type: integer
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.get('/products/:count',list)

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: "ดึงข้อมูลสินค้า"
 *     description: "API สำหรับดึงข้อมูลสินค้าโดยใช้ ID"
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID ของสินค้าที่ต้องการดึงข้อมูล
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ข้อมูลของสินค้าที่ถูกดึง
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: integer
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.get('/product/:id',read)

/**
 * @swagger
 * /product/{id}:
 *   put:
 *     summary: "อัพเดทข้อมูลสินค้า"
 *     description: "API สำหรับอัพเดทข้อมูลสินค้าตาม ID"
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID ของสินค้าที่จะอัพเดท
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     asset_id:
 *                       type: string
 *                     public_id:
 *                       type: string
 *                     url:
 *                       type: string
 *                     secure_url:
 *                       type: string
 *     responses:
 *       200:
 *         description: อัพเดทข้อมูลสินค้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 quantity:
 *                   type: integer
 *                 categoryId:
 *                   type: integer
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.put('/product/:id',update)

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: "ลบสินค้า"
 *     description: "API สำหรับลบสินค้าโดยใช้ ID"
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID ของสินค้าที่จะลบ
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: ลบสินค้าสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.delete('/product/:id',remove)

/**
 * @swagger
 * /productby:
 *   post:
 *     summary: "ดึงสินค้าตามเงื่อนไขการเรียงลำดับ"
 *     description: "API สำหรับดึงสินค้าตามเงื่อนไขที่ระบุ (เช่น การเรียงตามราคา หรือวันที่)"
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sort:
 *                 type: string
 *               order:
 *                 type: string
 *                 enum: [asc, desc]
 *               limit:
 *                 type: integer
 *     responses:
 *       200:
 *         description: รายการสินค้าที่กรองตามเงื่อนไข
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.post('/productby',listby)

/**
 * @swagger
 * /search/filters:
 *   post:
 *     summary: "ค้นหาสินค้าด้วยตัวกรอง"
 *     description: "API สำหรับค้นหาสินค้าตามชื่อ, ราคา, หรือหมวดหมู่"
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *               category:
 *                 type: array
 *                 items:
 *                   type: integer
 *               price:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: รายการสินค้าที่ตรงกับตัวกรอง
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.post('/search/filters',searchFilters)

/**
 * @swagger
 * /images:
 *   post:
 *     summary: "อัพโหลดภาพสินค้า"
 *     description: "API สำหรับอัพโหลดภาพสินค้าไปยัง Cloudinary"
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: อัพโหลดภาพสำเร็จ
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.post('/images',authCheck,adminCheck,createImages)

/**
 * @swagger
 * /removeimages:
 *   post:
 *     summary: "ลบภาพสินค้าจาก Cloudinary"
 *     description: "API สำหรับลบภาพสินค้าจาก Cloudinary"
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               public_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: ลบภาพสำเร็จ
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.post('/removeimages',authCheck,adminCheck,removeImage)



module.exports = router