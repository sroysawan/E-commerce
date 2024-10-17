exports.create = async(req,res)=> {
    try {
        res.send('hello created categoly')
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

exports.list = async(req,res)=> {
    try {
        res.send('hello list categoly')
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}
exports.remove = async(req,res)=> {
    try {
        const { id } = req.params
        // console.log(id)
        res.send('hello remove categoly')
    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}

