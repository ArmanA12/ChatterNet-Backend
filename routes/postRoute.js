const express =  require('express')
const { createPost,
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
shareCount,
} = require('../controllers/postController');
const upload = require('../middleware/multer.middleware');



const router = express.Router();

router.post('/createPost', upload.single('image'), createPost);
router.get('/getAllPosts', getAllPost);
router.get('/getAllVideoPosts', getAllVideoPosts);

router.post('/like', likePost);
router.post('/unlike', unlikePost);
router.post('/savedPost', savedPosts);
router.post('/unsavedPost', unsavedPosts);
router.post('/shareCount', shareCount);

router.post('/uploadProfileImage', upload.single('image'), uploadProfileImage);
router.post('/uploadVideoPost', upload.single('video'), uploadVideoPost);

router.get('/getPostsByUser', getPostsByUser);
router.get('/deleteUserPost', deleteUserPost);
router.get('/getAllUserSavedPost', getAllUserSavedPost);
router.get('/getAllUserLkedPost', getAllUserLkedPost);















module.exports = router;