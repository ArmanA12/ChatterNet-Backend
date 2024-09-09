const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  type:{
    type: String,
  },
  shareCount:{
    type: Number,
    default: 0, // Initialize shareCount to 0
  },

  postedBy:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  savedPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],

},{ timestamps: true } );

module.exports = mongoose.model("Post", postSchema);
