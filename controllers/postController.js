const cloudinary = require('cloudinary').v2;
const postModel = require("../models/postModel");
const userModel = require("../models/userModal");
const Like = require('../models/likesModal');
const Savedpost = require('../models/savedpostModal');
const userModal = require('../models/userModal');


// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dl2eivpdr',
  api_key: '762171859519419',
  api_secret: 'yXot9d_JIj02pwSiXntrJe6xJrY',
});






const createPost = async (req, res) => {
  try {
    console.log(req.body, "request");

    const { title, description, userID } = req.body;
    const image = req.file;

    // Validate input
    if (!userID) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    if (!image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Function to upload image to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(image.buffer);
      });
    };

    const result = await uploadToCloudinary();
    console.log(result, "cloudinary response");

    const post = new postModel({
      title,
      description,
      postedBy: userID,
      imageUrl: result.secure_url,
    });

    await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post,
    });
  } catch (error) {
    console.error(error, "console while creating post");
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};


const uploadVideoPost = async (req, res) => {
  try {
    const { title, description, userID } = req.body;
    console.log(title, description, userID, "video");

    // Validate input
    if (!userID) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const video = req.file;

    if (!video) {
      return res.status(400).json({ message: 'No video uploaded' });
    }

    // Function to upload video to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'video' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(video.buffer);
      });
    };

    // Upload the video and get the result
    const result = await uploadToCloudinary();

    // Create a new post
    const post = new postModel({
      title,
      description,
      postedBy: userID,
      imageUrl: result.secure_url,
      type: 'video',
    });

    await post.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      post,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};






const uploadProfileImage = async (req, res) => {
  try {
    console.log(req.body, "req body");
    console.log(req.file, "req file");

    const userID = req.body.userID;
    const image = req.file; // Access the uploaded file

    // Validate input
    if (!userID) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    if (!image) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // Function to upload image to Cloudinary
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        stream.end(image.buffer);
      });
    };

    // Upload the image and get the result
    const result = await uploadToCloudinary();

    // Update user profile with the new image URL
    const user = await userModel.findByIdAndUpdate(
      userID,
      { profileImageURL: result.secure_url },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      user,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllPost = async (req, res) => {
  try {
      const userId = req.query.userId; 
      const posts = await postModel
          .find({ type: { $exists: false } })
          .populate("postedBy", "_id name email profileImageURL")
          .sort({ createdAt: -1 });

      const formattedPosts = await Promise.all(posts.map(async (post) => {
          const likes = await Like.find({ post: post._id }).populate('user', '_id name');
          const savedPost = await Savedpost.find({ post: post._id }).populate('user', '_id name');
          const isFollowing = await userModal.exists({ _id: post.postedBy._id, followers: userId });
          return {
              _id: post._id,
              title: post.title,
              description: post.description,
              shareCount:post.shareCount,
              imageUrl: post.imageUrl,
              postedBy: post.postedBy,
              createdAt: post.createdAt,
              likesCount: likes.length,
              savedCount: savedPost.length,
              likedByCurrentUser: likes.some(like => like.user._id.toString() === userId.toString()), 
              savedByCurrentUser: savedPost.some(savedPost => savedPost.user._id.toString() === userId.toString()),
              isFollowing: !!isFollowing, 
          };
      }));

      res.status(200).send({
          success: true,
          message: "All Posts Data",
          posts: formattedPosts,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error In GETALLPOSTS API",
          error,
      });
  }
};



const getAllVideoPosts = async (req, res) => {
  try {
      const userId = req.query.userId; 
      const videoPosts = await postModel
          .find({ type: "video" }) 
          .populate("postedBy", "_id name email profileImageURL")
          .sort({ createdAt: -1 });

      const formattedPosts = await Promise.all(videoPosts.map(async (post) => {
          const likes = await Like.find({ post: post._id }).populate('user', '_id name');
          const savedPost = await Savedpost.find({ post: post._id }).populate('user', '_id name');
          const isFollowing = await userModal.exists({ _id: post.postedBy._id, followers: userId });
          return {
              _id: post._id,
              title: post.title,
              description: post.description,
              shareCount:shareCount,
              videoUrl: post.imageUrl, 
              postedBy: post.postedBy,
              createdAt: post.createdAt,
              likesCount: likes.length,
              savedCount: savedPost.length,
              likedByCurrentUser: likes.some(like => like.user._id.toString() === userId.toString()), 
              savedByCurrentUser: savedPost.some(savedPost => savedPost.user._id.toString() === userId.toString()),
              isFollowing: !!isFollowing, 
          };
      }));

      res.status(200).send({
          success: true,
          message: "All Video Posts Data",
          posts: formattedPosts,
      });
  } catch (error) {
      console.log(error);
      res.status(500).send({
          success: false,
          message: "Error In GETALLVIDEOPOSTS API",
          error,
      });
  }
};





const getPostsByUser = async (req, res) => {
  try {
    const userId = req.query.userId; 
    console.log(userId,"userid")
    const posts = await postModel.find({ postedBy: userId });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};




const deleteUserPost = async (req, res) => {
  try {
    const postID = req.query.postId; 
    if (!postID) {
      return res.status(400).json({ message: "Post ID is required." });
    }
    const deletedPost = await postModel.findOneAndDelete({ _id: postID });
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(200).json({ message: "Post deleted successfully.", post: deletedPost });
  } catch (error) {
    console.error("Error deleting the post:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

  
  const likePost = async (req, res) => {
    try {
      const { postId , userId} = req.body;
      console.log(postId , userId,"handle like start")
      
      if(!postId || !userId ){
        return res.status(400).json({ message: 'post id or user id not added' });

      }
  
      const alreadyLiked = await Like.findOne({ post: postId, user: userId });
      if (alreadyLiked) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }
  
      const like = new Like({ post: postId, user: userId });
      await like.save();
  
      res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  const unlikePost = async (req, res) => {
    try {
        const { postId , userId} = req.body;  
      const like = await Like.findOneAndDelete({ post: postId, user: userId });
      if (!like) {
        return res.status(400).json({ message: 'You have not liked this post' });
      }
  
      res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  const savedPosts = async (req, res) => {
    try {
      const { postId , userId} = req.body;
      
      if(!postId || !userId ){
        return res.status(400).json({ message: 'post id or user id not added' });

      }
  
      const alreadySaved = await Savedpost.findOne({ post: postId, user: userId });
      if (alreadySaved) {
        return res.status(400).json({ message: 'You have already liked this post' });
      }
  
      const saved = new Savedpost({ post: postId, user: userId });
      await saved.save();
  
      res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };



  

const unsavedPosts = async (req, res) => {
    try {
        const { postId , userId} = req.body;  
      const unSavedpost = await Savedpost.findOneAndDelete({ post: postId, user: userId });
      if (!unSavedpost) {
        return res.status(400).json({ message: 'You have not liked this post' });
      }
  
      res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

  const getAllUserSavedPost = async (req, res) => {
    try {
      console.log(req.body,"req body")
      const userId  = req.query.userId;  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const savedPosts = await Savedpost.find({ user: userId }).populate('post');
      if (!savedPosts || savedPosts.length === 0) {
        return res.status(404).json({ message: 'No saved posts found for this user' });
      }
      res.status(200).json(savedPosts);
    } catch (error) {
      console.error("Error retrieving saved posts:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  


  const getAllUserLkedPost = async (req, res) => {
    try {
      console.log(req.body,"req body")
      const userId  = req.query.userId;  
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      const savedPosts = await Like.find({ user: userId }).populate('post');
      if (!savedPosts || savedPosts.length === 0) {
        return res.status(404).json({ message: 'No saved posts found for this user' });
      }
      res.status(200).json(savedPosts);
    } catch (error) {
      console.error("Error retrieving saved posts:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  const shareCount = async (req, res) => {
    try {
      console.log(req.body, "req body from sharecount");
      const { postId } = req.body.params;  // Extract postId from req.body.params
      console.log(postId, "postId");
  
      const post = await postModel.findById(postId);  // Use postId directly in findById
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      post.shareCount += 1;  // Increment share count
      await post.save();
  
      return res.status(200).json({ message: 'Post shared successfully', shareCount: post.shareCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  
  
  


module.exports = {
   createPost,
   getAllPost,
    likePost, 
    unlikePost, 
    savedPosts, 
    unsavedPosts, 
    uploadProfileImage, 
    getPostsByUser,
    deleteUserPost,
    getAllUserSavedPost,
    getAllUserLkedPost,
    uploadVideoPost,
    getAllVideoPosts,
    shareCount

  
 }