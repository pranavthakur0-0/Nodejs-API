const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../ultis/errorresponse');
const User = require('../model/user');



// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse( `Not authorized to access this route`, 404));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});




//@desc     Get user
//@route    POST /api/vi/auth/me
//@acess    private
exports.getme = asyncHandler(async (req, res, next)=>
{
    const user = await  User.findById(req.user.id);
    res.status(200).json({
        sucess: true,
        data : user
    })
})