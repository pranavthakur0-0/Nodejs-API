const express = require('express');
const dotenv = require('dotenv');
const morgon = require('morgan');
const connectdb = require('./config/db');
const errorhandler = require('./middleware/error');
const auth = require('./routes/auth')
const cookieParser = require('cookie-parser');

//Load env vars
dotenv.config({path : './config/config.env'});

//conect to tb;
connectdb();
//Route Files
const bootcamps = require('./routes/bootcamp');

const app = express();

//body Parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//dev logging  middleware
if(process.env.NODE_ENV === 'development')
{
    app.use(morgon('dev'));
}



 //mount routers 
const logger = require('./middleware/logger');
app.use(logger);
app.use('/api/vi/bootcamps', bootcamps);
app.use('/api/vi/auth', auth);
app.use(errorhandler);



const PORT = process.env.PORT || 4000;
const  server = app.listen(PORT, ()=>
{
    console.log(`This is in ${process.env.NODE_ENV} mode`);
})

//handle  handleled rejections
process.on('unhandledrejection', (err, promise)=>
{
    console.log("Error", err);
    //close server
    server.close(()=>
    {
        process.exit(1);
    })
})
