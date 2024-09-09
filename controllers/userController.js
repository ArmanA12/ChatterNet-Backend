const userModel = require("../models/userModal");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const { generateOTP } = require("../helpers/generateOPT");
const JWT = require("jsonwebtoken");
const { sendMail } = require("../helpers/emailSender");
const cloudinary = require('cloudinary').v2;




cloudinary.config({
  cloud_name: '',
  api_key: '',
  api_secret: '',
});




const userRegister = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validation
      if (!name || !email || !password || password.length < 6) {
        return res.status(400).send({
          success: false,
          message: !name
            ? "Name is required"
            : !email
            ? "Email is required"
            : !password
            ? "Password is required"
            : "Password must be at least 6 characters long",
        });
      }
  
      // Existing user check
      const exisitingUser = await userModel.findOne({ email });
      if (exisitingUser) {
        return res.status(500).send({
          success: false,
          message: "User Already Registered With This Email",
        });
      }
  
      // Hash password
      const hashedPassword = await hashPassword(password);
      // Save user
      const user = await new userModel({
        name,
        email,
        password:hashedPassword,
      }).save();
  
      return res.status(201).send({
        success: true,
        message: "Registration Successful, please login",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error in Register API",
        error,
      });
    }
  };




const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: "Please provide email and password.",
        });
      }
  
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }
  
      const match = await comparePassword(password, user.password);
  
      if (!match) {
        return res.status(401).send({
          success: false,
          message: "Invalid username or password.",
        });
      }
  
      const otp = generateOTP();
      user.otp = otp;
      await user.save();
      user.password = undefined;
      req.session.email = user.email;
      sendMail(user.email, otp);
      res.status(200).send({
        success: true,
        message: "Login successful. OTP has been sent to your email.",
        user,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login API.",
        error,
      });
    }
  };

  

  const resendOTP = async (req, res) => {
    try {
      const { email } = req.session;
      if (!email) {
        return res.status(400).send({
          success: false,
          message: "Session expired. Please login again.",
        });
      }
  
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }
  
      const otp = generateOTP();
      user.otp = otp;
      await user.save();
      sendMail(user.email, otp);
      res.status(200).send({
        success: true,
        message: "OTP has been resent to your email.",
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in resend OTP API.",
        error,
      });
    }
  };
  



  const verifyOTP = async (req, res) => {
    console.log(req.body, "req body")
    try {
        const { otp } = req.body;
        if (!otp) {
          return res.status(400).send({
            success: false,
            message: "Please fill the OTP",
          });
        }
        
        const userOTP = await userModel.findOne({ otp });
        const token = JWT.sign({ _id: userOTP._id }, process.env.JWT_SECRET, {
            expiresIn: "1m",
          });
        console.log(userOTP, "userOTP")
        userOTP.password=undefined;
        userOTP.otp=undefined;
        if (!userOTP) {
          return res.status(404).send({
            success: false,
            message: "Invalid OTP",
          });
        }
        
        res.status(200).send({
          success: true,
          token,
          userOTP,
          message: "Verification successful.",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          message: "Error in login API",
          error,
        });
      }
  }

  
  const userProfile = async (req, res) => {
    try {
      const {  userID }  = req.query;
      const _id = userID
      const user = await userModel.findById(_id);
      user.password=undefined;
      user.otp=undefined;
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      return res.status(200).send({
        success: true,
        message: "User profile fetched successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        success: false,
        message: "Error in login API while getting user profile",
        error,
      });
    }
  };
  



  const forgotPassword = async (req, res) => {
    try {
      const { email, newPassword, confirmPassword } = req.body;
      console.log(email, newPassword, confirmPassword, "console Data")
  
      if (!email || !newPassword || !confirmPassword) {
        return res.status(400).send({
          success: false,
          message: "All fields are required",
        });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).send({
          success: false,
          message: "Passwords do not match",
        });
      }
  
      if (newPassword.length < 6) {
        return res.status(400).send({
          success: false,
          message: "Password must be at least 6 characters long",
        });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User with this email does not exist",
        });
      }
  
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
  
      // Update user's password
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).send({
        success: true,
        message: "Password has been reset successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Error in forgot password controller",
        error,
      });
    }
  };
  





module.exports = {userRegister, login, verifyOTP, resendOTP, userProfile, forgotPassword}