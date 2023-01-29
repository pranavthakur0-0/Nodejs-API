// @desc  LOgs request to console
const logger = (req, res, next)=>
 {
    req.hello = "middleware";
     console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
     next();
 }

 module.exports = logger;