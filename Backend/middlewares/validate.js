

// generic function
function validate(schema) {
    return function(req,res,next){
        const body = req.body;
        const {error,value} = schema.validate(body);
        if(error) {
            return res.status(400).json({
                success:false,
                message: error.details[0].message
            })
        }
        req.body = value;
        next();
    }
}





module.exports = validate;


