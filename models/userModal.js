// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "please add name"],
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: [true, "please add email"],
//       unique: true,
//       trim: true,
//     },
//     password: {
//       type: String,
//       required: [true, "please add password"],
//       min: 6,
//       max: 64,
//     },
//     otp: {
//         type: String,
//         min: 6,
//         max: 6,
//       },
      
    
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "please add email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "please add password"],
      min: 6,
      max: 64,
    },
    otp: {
      type: String,
      min: 6,
      max: 6,
    },
    profileImageURL:{
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
