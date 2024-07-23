const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const { attachCookiesToResponse, createTokenUser } = require('../utils');
const crypto = require("crypto")
const sendEmail = require("../utils/sendEmail");
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const sendResetPasswordEmail = require('../utils/sendResetPassword');
const createHash = require('../utils/createHash');

const register = async (req, res) => {
  // get account details
  const { email, name, password } = req.body;

  //check if email exists
  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError('Email already exists');
  }

  // generate token
  const verificationToken = crypto.randomBytes(40).toString("hex")
  // create user
  const user = await User.create({name, email, password, verificationToken})

  //should be in an env file
  // const origin = 'http://localhost:3000';  
  
  // send verification email
  await sendVerificationEmail(
    {
      name: user.name, 
      email: user.email, 
      verificationToken: user.verificationToken,
      origin: process.env.BASE_URL
    }
  )
  //send verification token (for test on postman)
  res.status(StatusCodes.CREATED)
  .json({msg: "success! Please check your email to verify account", verificationToken})
};


const verifyEmail = async (req, res) => {
  //get email and token
  const { verificationToken, email } = req.body

  // check if user exits
  const user = await User.findOne({email})
  if(!user) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }
  // check if token mathches
  if (verificationToken != user.verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification failed');
  }
  // update user
  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ""

  await user.save()
  res.status(StatusCodes.OK).json({msg: "Email verified"})
}


const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError('Invalid Credentials');
  }

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError('Please verify email address');
  }
  const tokenUser = createTokenUser(user);

  // create refresh token
  let refreshToken = ""
  
  // check for existing token
  const existingToken = await Token.findOne({user: user._id})

  if (existingToken) {
    const { isValid } = existingToken
    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Invalid Credentails")
    }

    refreshToken = existingToken.refreshToken
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });

    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString('hex')
  const userAgent = req.headers["user-agent"]
  const ip = req.ip
  const userToken = {refreshToken, userAgent, ip, user: user._id}

  await Token.create(userToken)

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};


const logout = async (req, res) => {
  
  await Token.findOneAndDelete({user: req.user.userId})

  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie('refreshToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    throw new CustomError.BadRequestError("Email not found")
  }

  const user = await User.findOne({email})
  
  if (user) { 
    const passwordToken = crypto.randomBytes(70).toString("hex")
    const tenMinutes = 1000 * 60 * 10
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

    user.passwordToken = createHash(passwordToken) 
    user.passwordTokenExpirationDate = passwordTokenExpirationDate
    await user.save()

    //send email
    await sendResetPasswordEmail({name: user.name, email: user.email, token: passwordToken, origin: process.env.BASE_URL })
  }
  res.status(StatusCodes.OK).json({msg: "Please check your email for reset password link"})
}


const resetPassword = async (req, res) => {
  const { token, email, password } = req.body

  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values")
  }

 const user = await User.findOne({email})

 if (user) { 
  const currentDate = new Date()

  if ( currentDate > user.passwordTokenExpirationDate) { 
    throw new CustomError.UnauthorizedError("Password reset token has expired")
  }else if( createHash(token) != user.passwordToken){
    throw new CustomError.UnauthorizedError("Invalid password reset token")
  }else{
    user.password = password
    user.passwordToken = null
    user.passwordTokenExpirationDate = null
    await user.save()
  }
 }
  res.status(StatusCodes.OK).json({msg: "Password resest successful"})
}


module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword
};
