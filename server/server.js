//step 1 import
const express = require('express')
const app = express()
const morgan = require('morgan')
const { readdirSync } = require('fs') //อ่าน dir เข้าไปอ่านในโฟลเดอร์ route แล้วimport อัตโนมัติ
const cors = require('cors')


const { swaggerUi,swaggerSpec } = require('./config/swaggerConfig')

//middleware
app.use(morgan('dev'))
app.use(express.json({limit: '20mb'}))
app.use(cors())




//swagger doc api
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//step 3 router
readdirSync('./routes').map((c)=> 
    app.use('/api',require('./routes/'+c))
)

//step 2 start server
app.listen(5000,() => {
    console.log('server is running on port 5000')
})
