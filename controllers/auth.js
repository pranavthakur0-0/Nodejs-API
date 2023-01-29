const User = require('../model/user');
const errorResponse = require('../ultis/errorresponse')
const asynchandler  = require('../middleware/async')


//@desc      Register User
//@route     POST /api/v1/auth/register
//@access    Public


exports.register = asynchandler( async (req, res, next)=>
{
    const {name,email,password,role} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sendTokenResponse(user, 200, res);

})



//@desc      Login User
//@route     POST /api/v1/auth/login
//@access    Public


exports.login = asynchandler( async (req, res, next)=>
{
    const {email,password} = req.body;
    //validae email and password
    if(!email || !password)
    {
        return next(new errorResponse("please provide an email and passowrd", 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user)
    {
        return next(new errorResponse("User is not registered", 401));
    }

    const ismatch = await user.matchPassword(password);

    if(!ismatch)
    {
        return next(new errorResponse("User is not registered", 401));
    }
    sendTokenResponse(user, 200, res);

})


const sendTokenResponse = (user, statuscode, res)=>
{
    const token = user.getSignedJwtToken();

    const options = {
        expires  : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 *60 *60 *1000),
        httpOnly: true,
    }
    if(process.env.NODE_ENV === "production")
    {
        options.secure = true;
    }
    res
      .status(statuscode)
      .cookie('token', token, options)
      .json({
        sucess : true,
        token
      })
}