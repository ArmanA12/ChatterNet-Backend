const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require('express-session');

const morgan = require("morgan");
 const connectDB = require("./config/db");
const { json } = require("body-parser");

//DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

//REST OBJECT
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));
  
//ROUTES
app.use("/api/v1/auth", require("./routes/userRoute"));
 app.use("/api/v1/post", require("./routes/postRoute"));
 app.use("/api/v1/followunfollow", require("./routes/followunfollwoRoute"));


app.get('',(req,res)=>{
    res.status(200).json({
        success:true,
        message:"welcome back manin"
    })
})

//PORT
