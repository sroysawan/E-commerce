const { query } = require('express')
const prisma = require('../config/prisma')


exports.create = async(req,res)=> {
    try {
        const { title,description,price,quantity,categoryId,images } = req.body
        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item)=> ({
                        asset_id: item.asset_id,
                        public_id : item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.send(product)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.list = async(req,res)=> {
    try {
        const {count} = req.params
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: { createdAt : "desc" },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.read = async(req,res)=> {
    try {
        const {id} = req.params
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id)
            },
            include:{
                category:true,
                images:true
            }
        })
        res.send(products)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.update = async(req,res)=> {
    try {
        const {id} = req.params
        const { title,description,price,quantity,categoryId,images } = req.body


        //clear images
        await prisma.image.deleteMany({
            where: {
                productId: Number(id)
            }
        })

        const product = await prisma.product.update({
            where: {
                id: Number(id)
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item)=> ({
                        asset_id: item.asset_id,
                        public_id : item.public_id,
                        url: item.url,
                        secure_url: item.secure_url
                    }))
                }
            }
        })
        res.send(product)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.remove = async(req,res)=> {
    try {
        const { id } = req.params

        await prisma.product.delete({
            where: {
                id: Number(id)
            }
        })
        res.send('Delete Success')
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.listby = async(req,res)=> {
    try {
        const { sort, order, limit } = req.body
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: {
                [sort]: order
            },
            include: {
                category:true
            }
        })
        res.send(products)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}





const handleQuery = async(req,res,query) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        res.send(products)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

const handlePrice = async(req,res,priceRange)=> {
    try {
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0],
                    lte: priceRange[1]
                }
            },
            include: {
                category: true,
                images:true
            }
        })
        res.send(products)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

const handleCategory = async(req,res,categoryId)=> {
    try {
        const products = await prisma.product.findMany({
            where:{
                categoryId: {
                    in: categoryId.map((id)=>Number(id))
                }
            },
            include: {
                category: true,
                images:true
            }
        })
        res.send(products)
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.searchFilters = async(req,res)=> {
    try {
        const { query, category, price} = req.body

        if(query){
            console.log('have query-->',query)
            await handleQuery(req,res,query)
        }
        if(category){
            console.log('have category-->',category)
            await handleCategory(req,res,category)
        }
        if(price){
            console.log('have price-->',price)
            await handlePrice(req,res,price)
        }

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

