const { body, param, validationResult } = require('express-validator');
const { ObjectId } = require('mongoose').Types;
const database = require('../services/database');

const validator = (req, res, next) => {
  console.log(req.originalUrl);
  
  if(req.originalUrl == "/user/login" && req.body.type == "guest"){
    return next();
  }

  const errors = validationResult(req).array();
  const nestedErrors = errors[errors.length - 1];
  if (nestedErrors && nestedErrors.nestedErrors) {
    errors.pop();
    nestedErrors.nestedErrors.forEach((error) => {
      errors.push(error);
    });
  }
  if (errors.length > 0) {
    let message = errors[0].msg;
    if (errors[0].nestedErrors) message = errors[0].nestedErrors[0].msg;
    const error = {
      success: false,
      message: message
    };
    return res.status(400).json(error);
  }
  return next();
};

const registerValidations = [
  body('username', 'Please enter your username').notEmpty(),
  body('email', 'Please enter your email').notEmpty(),
  body('password', 'Please enter your password').notEmpty(),
  body('phone', 'Please enter your phone').notEmpty(),
  
  // body('username')
  //   .isString()
  //   .isLength({ min: 4 }).withMessage("Username can't be less than 4 characters.")
  //   .custom(async (username) => {
  //     const user = await database.user.getUserByUsername(username);
  //     if (user) throw new Error('This Username is already in use');
  //     return false;
  //   }),
  //   body('phone')
  //   .isLength({ min: 7 }).withMessage("Phone can't be less than 7 characters.")
  //   ,
    body('password')
    .isLength({ min: 6 }).withMessage("Password must be atleast 6 characters."),
  body('email').isEmail().withMessage("Please provide a valid email address"),
  body('email')
    .isLength({ max: 255 })
    .custom(async (email) => {
      const user = await database.user.getUserByEmail(email);
      if (user) throw new Error('This Email is already in use');
      return false;
    }),
];

const validateEmail = [
  body('email', 'Please enter your email').notEmpty(),
  body('email', 'Please provide a valid email address')
    .isEmail(),
  body('email')
    .isString()
    .custom(async (email) => {
      console.log('COME IN EMAIL');
      const user = await database.user.getUserByEmail(email);
      if (!user) throw new Error("User with given email doesn't exist");
      return false;
    }),
];

const validatePassword = [
  // body('password', 'Please enter your password').notEmpty(),
  // body('confrimPassword', 'Please enter your password').notEmpty(),
  body('password')
  .isLength({ min: 6 }).withMessage("Password can't be less than 6 characters.")
]

const loginValidations = [
  body('email', 'Please enter your email').notEmpty(),
  body('password', 'Please enter your password').notEmpty(),
  body('email', 'Please provide a valid email address')
  // .optional()
  .isEmail(),
  body('email')
    // .optional()
    .isString()
    .custom(async (email) => {
      console.log('COME IN EMAIL');
      const user = await database.user.getUserByEmail(email);
      if (!user) throw new Error("Email dosn't exist!");
      return false;
    }),
  body('username')
    .optional()
    // .isString()
    .custom(async (username, { req }) => {
      if (req.body)
        console.log('COME IN USERNAME');
      const user = await database.user.getUserByUsername(username);
      if (!user) throw new Error("Username dosn't exist!");
      return false;
    }),
  body('password').isLength({ min: 6 }).withMessage("Password must be atleast 6 characters.")
]

module.exports = {
  validator,
  registerValidations,
  loginValidations,
  validatePassword,
  validateEmail
};
