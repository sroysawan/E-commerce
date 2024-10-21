const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/authCheck')
//import controller
const { changeOrderStatus,getOrderAdmin } = require('../controllers/admin')


router.put('/user/order-status',authCheck,changeOrderStatus)
router.post('/admin/orders',authCheck,getOrderAdmin)



module.exports = router