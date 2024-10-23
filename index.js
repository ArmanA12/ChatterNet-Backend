// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const session = require('express-session');

// const morgan = require("morgan");
//  const connectDB = require("./config/db");
// const { json } = require("body-parser");

// //DOTENV
// dotenv.config();

// // MONGODB CONNECTION
// connectDB();

// //REST OBJECT
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));
// app.use(session({
//     secret: process.env.JWT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false } 
//   }));
  
// //ROUTES
// app.use("/api/v1/auth", require("./routes/userRoute"));
//  app.use("/api/v1/post", require("./routes/postRoute"));
//  app.use("/api/v1/followunfollow", require("./routes/followunfollwoRoute"));


// app.get('',(req,res)=>{
//     res.status(200).json({
//         success:true,
//         message:"welcome back manin"
//     })
// })

// //PORT


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require('express-session');
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const connectDB = require("./config/db");

// DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

// Rate Limiter
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 500,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after an hour",
    }
});

// REST OBJECT
const app = express();

app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// ROUTES
app.use("/api/v1/auth", require("./routes/userRoute"));
app.use("/api/v1/post", require("./routes/postRoute"));
app.use("/api/v1/followunfollow", require("./routes/followunfollwoRoute"));

app.get('', (req, res) => {
    res.status(200).json({
        success: true,
        message: "welcome back manin"
    });
});

// Export the app as a serverless function (for deployment on platforms like Vercel)
module.exports = app;
// const PORT = process.env.PORT || 8080;

// //listen
// app.listen(PORT, () => {
//   console.log(`Server Runnning ${PORT}`.bgGreen.white);
// });
