const express = require('express');
const router = express.Router();

const { create,list,remove} = require('../controllers/product')


module.exports = router