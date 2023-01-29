const errorResponse  = require("../ultis/errorresponse");
const errorhandler = (err, req, res, next)=>
{
    let error = {...err};
    //Log to console for developer
    if(err.name == "CastError")
    {
        error = new errorResponse(`Cast error response ${err.value}`, 400)
    }
    else if(error.code === 11000)
    {
        const message = Object.keys(error.keyValue);
        error = new errorResponse(`Duplicate field value entered ${message}`, 400)
    }
    else if(err.name == "ValidationError")
    {
        console.log("Working");
        const message = Object.values(err.errors).map(val=>val.message);
        error = new errorResponse(message, 400)
    }
    res.status(error.statuscode || 500).json({
        sucess : false,
        data : error.message || err.message || 'Server message'
    })
}

module.exports  = errorhandler;