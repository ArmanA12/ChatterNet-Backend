const express =  require('express')
const { userRegister, login, verifyOTP, resendOTP, userProfile, forgotPassword } = require('../controllers/userController');

const router = express.Router();

router.post('/register', userRegister);
router.post('/login', login);
router.post('/verifyOTP', verifyOTP);
router.post('/resendOTP', resendOTP);
router.post('/resendOTP', resendOTP);
router.get('/userProfile', userProfile);
router.post('/forgotPassword', forgotPassword);








module.exports = router;