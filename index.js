const express = require("express");
const dotenv = require('dotenv');

//Load env vars 
dotenv.config({path: './config/config.env'});

const app = express();
const Port = process.env.Port || 4000
app.listen(Port, ()=>
{
    console.log(`server running in ${process.env.NODE_ENV}`); 
})