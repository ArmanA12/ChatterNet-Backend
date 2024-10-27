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
// module.exports = app;




// Import dependencies
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require('express-session');
const morgan = require("morgan");
const http = require("http");  // Required to create the server for both Express and Socket.IO
const { Server } = require("socket.io"); // Import Socket.IO
const connectDB = require("./config/db");

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// REST OBJECT
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
}));

// Routes
app.use("/api/v1/auth", require("./routes/userRoute"));
app.use("/api/v1/post", require("./routes/postRoute"));
app.use("/api/v1/followunfollow", require("./routes/followunfollwoRoute"));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the chat application!"
    });
});

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);  // Create server with Express app
const io = new Server(server, {
    cors: {
        origin: "*", // Adjust this to restrict access
        methods: ["GET", "POST"]
    }
});

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a specific chat room
    socket.on("joinRoom", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
        const { chatId, senderId, receiverId, message } = data;

        try {
            // Save the message to MongoDB
            const Message = require('./models/chatModel');  // Import the Message model here
            const newMessage = new Message({ chatId, senderId, receiverId, message });
            await newMessage.save();

            // Emit the message to users in the chat room
            io.to(chatId).emit("message", newMessage);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
