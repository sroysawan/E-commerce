const express = require('express');
const router = express.Router();


const { create,list,update,remove, listByCategory } = require('../controllers/category')
const { authCheck,adminCheck } = require('../middlewares/authCheck');

// @ENDPOINT http://localhost:5000/api/category


/**
 * @swagger
 * tags:
 *   name: Category
 *   description: API สำหรับการสร้างหมวดหมู่สินค้า การแสดงหมวดหมู่สินค้า และการลบหมวดหมู่สินค้า
 */

/**
 * @swagger
 * /category:
 *   post:
 *     summary: "สร้างหมวดหมู่สินค้า"
 *     description: "API สำหรับสร้างหมวดหมู่สินค้าใหม่"
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: ชื่อของหมวดหมู่
 *     responses:
 *       200:
 *         description: สร้างหมวดหมู่สินค้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.post('/category',authCheck,adminCheck,create)

/**
 * @swagger
 * /category:
 *   get:
 *     summary: "ดึงรายการหมวดหมู่สินค้า"
 *     description: "API สำหรับดึงรายการหมวดหมู่สินค้าทั้งหมด"
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: รายการหมวดหมู่สินค้าทั้งหมด
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.get('/category',list)

router.get("/category/:name", listByCategory);


router.put('/category/:id',authCheck,adminCheck,update)

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: "ลบหมวดหมู่สินค้า"
 *     description: "API สำหรับลบหมวดหมู่สินค้าตาม ID"
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID ของหมวดหมู่ที่จะลบ
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: การลบหมวดหมู่สินค้าสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: ไม่พบหมวดหมู่ที่ต้องการลบ
 *       500:
 *         description: เกิดข้อผิดพลาดจากเซิร์ฟเวอร์
 */
router.delete('/category/:id',authCheck,adminCheck,remove)



module.exports = router