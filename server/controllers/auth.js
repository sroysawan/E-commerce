const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async(req,res) => {
    try {    
        const { name,email,password } = req.body
        //step 1 validate body
        if(!email){
            return res.status(400).json({
                message : "Email is required!!!"
            })
        }
        if(!password){
            return res.status(400).json({
                message: "Password is required!!"
            })
        }
        if(!name){
            return res.status(400).json({
                message: "Name is required!!"
            })
        }

        //step 2 check email in db already?
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if(user){
            return res.status(400).json({
                message : "Email already exists"
            })
        }

        //step 3 HashPassword
        const hashPassword = await bcrypt.hash(password,10)

        //step 4 Register
        await prisma.user.create({
            data:{
                email: email,
                password: hashPassword,
                name: name
            }
        })

        res.send('Register Success')
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.login = async(req,res) => {
    try {
        const { email, password } = req.body

        //step 1 Check email 
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if(!user || !user.enabled){
            return res.status(400).json({
                message: "User Not Found or not Enabled"
            })
        }
        //step 2 Check password
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({
                message: "Password Invalid"
            })
        }
        //step 3 Create Payload
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }

        //step 4 Generate Token
        jwt.sign(payload,process.env.SECRET,{expiresIn: '7d'},(error,token) => {
            if(error){
                return res.status(500).json({
                    message: "Server Error"
                })
            }
            res.json({ payload, token })
        })

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.currentUser = async(req,res)=> {
    try {
        const user = await prisma.user.findFirst({
            where:{
                email: req.user.email
            },
            select:{
                id:true,
                email:true,
                name: true,
                role: true
            }
        })
        res.json({user})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Server Error"
        })
    }
}

