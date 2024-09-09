function generateOTP(length = 6) {
    if (length !== 6) {
        throw new Error("OTP length must be 6.");
    }
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

module.exports = { generateOTP }