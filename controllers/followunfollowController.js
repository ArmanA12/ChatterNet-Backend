const userModel = require("../models/userModal");

const followUser = async (req, res) => {
  try {
    console.log("userfol", req.body);
    const { userToFollowId, currentUserId } = req.body;

     console.log("userfollow data",userToFollowId,currentUserId)

    if (userToFollowId === currentUserId.toString()) {
      return res.status(400).json({ error: "You cannot follow yourself." });
    }

    const userToFollow = await userModel.findById(userToFollowId);
    const currentUser = await userModel.findById(currentUserId);

    if (!userToFollow) {
      return res.status(404).json({ error: "User not found." });
    }

    // Add current user to the followers list of the user to follow
    if (!userToFollow.followers.includes(currentUserId)) {
      userToFollow.followers.push(currentUserId);
      await userToFollow.save();
    }

    // Add the user to follow to the following list of the current user
    if (!currentUser.following.includes(userToFollowId)) {
      currentUser.following.push(userToFollowId);
      await currentUser.save();
    }

    res.status(200).json({ message: "User followed successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while following the user." });
  }
};




const unfollowUser = async (req, res) => {
  try {
    console.log(req.body, "req body")
    const { userToFollowId,  currentUserId } = req.body;

    if (userToFollowId === currentUserId.toString()) {
      return res.status(400).json({ error: "You cannot unfollow yourself." });
    }

    const userToUnfollow = await userModel.findById(userToFollowId);
    const currentUser = await userModel.findById(currentUserId);

    if (!userToUnfollow) {
      return res.status(404).json({ error: "User not found." });
    }
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId.toString()
    );
    await userToUnfollow.save();

    // Remove the user to unfollow from the following list of the current user
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToFollowId.toString()
    );
    await currentUser.save();

    res.status(200).json({ message: "User unfollowed successfully." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while unfollowing the user." });
  }
};


module.exports = { followUser, unfollowUser }