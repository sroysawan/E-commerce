const express = require('express');
const router = express.Router();

//import controller
const { register,login,currentUser } = require('../controllers/auth')
const { authCheck,adminCheck } = require('../middlewares/authCheck')


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API สำหรับการยืนยันตัวตน
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: ลงทะเบียนผู้ใช้ใหม่
 *     tags: [Auth]
 *     description: สร้างผู้ใช้ใหม่ในฐานข้อมูล
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: mysecretpassword
 *     responses:
 *       200:
 *         description: ลงทะเบียนสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: ข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.post('/register', register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: เข้าสู่ระบบ
 *     tags: [Auth]
 *     description: ผู้ใช้เข้าสู่ระบบโดยใช้ email และ password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: mysecretpassword
 *     responses:
 *       200:
 *         description: เข้าสู่ระบบสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       500:
 *         description: ข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.post('/login', login);

/**
 * @swagger
 * /current-user:
 *   post:
 *     summary: รับข้อมูลผู้ใช้ปัจจุบัน
 *     tags: [Auth]
 *     description: เรียกดูข้อมูลผู้ใช้ที่ล็อกอินอยู่โดยใช้ token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ข้อมูลผู้ใช้ปัจจุบัน
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: ข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.post('/current-user', authCheck, currentUser);

/**
 * @swagger
 * /current-admin:
 *   post:
 *     summary: รับข้อมูลผู้ใช้ที่เป็นผู้ดูแลระบบ
 *     tags: [Auth]
 *     description: เรียกดูข้อมูลผู้ใช้ที่ล็อกอินอยู่ซึ่งมีบทบาทเป็น Admin โดยใช้ token
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ข้อมูลผู้ใช้ที่เป็นผู้ดูแลระบบ
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: ข้อผิดพลาดของเซิร์ฟเวอร์
 */
router.post('/current-admin', authCheck, adminCheck, currentUser);

module.exports = router