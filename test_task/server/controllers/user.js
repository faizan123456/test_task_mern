const jwt = require('jsonwebtoken');
const { isEmail } = require('../utils/helpers');
const database = require('../services/database');
const User = require('../models/user.model');
const { ERROR_MESSAGE, HTTP_STATUS_CODE } = require('../configs/constants');
const bcrypt = require('bcryptjs');
const { resetPasswordMail } = require('../services/email');

const register = async (request, response) => {
  try {
    const {
      username,
      email,
      phone,
      password,
    } = request.body;

    // GENERATE HASH
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = {
      username,
      email,
      phone,
      password: passwordHash,
      isAdmin: true,
    };

    const newUser = await database.user.addUser(user);

    // JWT
    const jws = jwt.sign(
      { id: newUser._id, email: user.email, newUser },
      process.env.JWT_SECRET,
    );

    const data = {
      success: true,
      message: 'User Registered Successfully!',
      token: jws,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    };

    return response.status(HTTP_STATUS_CODE.CREATED).json(data);
  } catch (error) {
    console.error('Registration Failed: ', error);
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error,
    });
  }
};

const login = async (request, response) => {
  try {
    const { email, password } = request.body;
    let user = await database.user.getUserByEmail(email);
    if (user) {
      const authenticated = await bcrypt.compare(password, user.password);
      if (!authenticated)
        return response
          .status(HTTP_STATUS_CODE.BAD_REQUEST)
          .json({ success: false, message: ERROR_MESSAGE.INCORRECT_PASSWORD });
      const token = jwt.sign(
        { id: user._id, email: user.email, user },
        process.env.JWT_SECRET,
      );
      const data = {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
      };
      await database.user.addActivity({ lastLoginTime: new Date(), user })
      return response
        .status(HTTP_STATUS_CODE.CREATED)
        .json({ success: true, message: 'Successfully logged in', data });

    } else {
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.ACCOUNT_DOES_NOT_EXIST);
    }
  } catch (err) {
    console.error('Login Failed: ', err);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.LOGIN_FAIL + ', ' + err);
  }
};

const auth = async (request, response) => {
  try {
    const { id } = request.user;

    // @todo - move to middleware
    const user = await database.user.getUserById(id, {
      email: 1,
      _id: 0,
      blockchain: 1,
    });

    const jws = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
    );

    let data = {
        token: jws,
        user: {
          username: user.username,
          email: user.email,
          phone: user.phone,
        },
    };

    if (user) return response.status(HTTP_STATUS_CODE.OK).json(data);

    return response
      .status(HTTP_STATUS_CODE.BAD_REQUEST)
      .json(ERROR_MESSAGE.USER_NOT_EXIST);
  } catch (error) {
    console.error('Authentication Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.AUTH_FAIL);
  }
};
const fetchAllUsers = async (request, response) => {
  try {
    const users = await database.user.getAllUsers()
    return response.status(HTTP_STATUS_CODE.OK).json({
      message: 'Fetch users successfully!',
      users
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
};

const loggedinActivity = async (request, response) => {
  try {
    const activities = await database.user.getActivities()
    return response.status(HTTP_STATUS_CODE.OK).json({
      message: 'Fetch activities successfully!',
      activities
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
};
const updateUser = async (request, response) => {
  try {
    // const token = request.header('x-auth-token');
    // const userId = jwt.verify(token, process.env.JWT_SECRET).id;
    const {
      userId,
      username,
      email,
      phone
    } = request.body;

    // Check email or username provided
    if (!email || !username || !phone || !userId) {
      return response.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING,
      });
    }
    // Check if user does exist in the database
    const user = await database.user.getUserById(userId);
    console.log('user---->', user)
    if (!user) {
      return response.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.USER_NOT_EXIST,
      });
    }

    // TODO: We need a way to verify if user is authorised to make this hcange
    // Previously we were asking user to give the password, that is no more the case
    const updatedUserData = {
      username: username || user.username,
      email: email || user.email,
      phone: phone || user.phone
    };
    await database.user.updateUser(userId, updatedUserData);
    const updatedUser = await database.user.getUserById(userId);

    const data = {
      success: true,
      message: 'User updated successfully!',
      user: updatedUser,
    };
    return response.status(HTTP_STATUS_CODE.CREATED).json(data);
  } catch (error) {
    console.error('Update User failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json({ success: false, message: ERROR_MESSAGE.UPDATE_USER_FAILED });
  }
};

const forgotPassword = async (req, res) => {
  try{
    const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user){
        const error_messgae = {
          success: false,
          message: "User with given email doesn't exist"
        };
        return res.status(400).send(error_messgae);

      }
      try {
      resetPasswordMail(email, user._id);
      console.log('Test email sent successfully');
      return res.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: `Email sent successfully, Kindly check your email!`,
        data : {
          userId : user._id
        }
      });

    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
        success: false,
        message: 'Email not sent, ',
      });
      // if (error.response) {
      //   console.error(error.response.body)
      // }
    }
  }catch( error ){
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error,
    });


  }

}

const resetPassword = async (req, res) =>{
  try{
    const { password, confirmPassword, userId } = req.body;
    if (!password, !confirmPassword, !userId) {
      return response.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING,
      });
    }
    const user = await User.findOne({ _id :  userId });
    console.log(user);
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }

    if (password == confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const updatedUser  =  await User.updateOne(
            { _id: userId },
            { $set: { password: passwordHash } },
            { new: true }
          );

          if(updatedUser ){
            return res.status(HTTP_STATUS_CODE.OK).json({
              success: true,
              message: `Password updated successfully!`,
              data : {
                userId : user._id
              }
            });
          }
    }else{
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
        success: false,
        message: "Password doesn't match",
      });
    }
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error,
    });

  }
}

const updatePassword = async (req, res) => {
  try {
    const { password, confirmPassword, userId } = req.body;
    if (!password, !confirmPassword, !userId) {
      return response.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING,
      });
    }
    const user = await User.findOne({ _id: userId });
    console.log(user);
    if (!user) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: "User not found",
      });
    }

    if (password == confirmPassword) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);
      const updatedUser = await User.updateOne(
        { _id: userId },
        { $set: { password: passwordHash } },
        { new: true }
      );

      if (updatedUser) {
        return res.status(HTTP_STATUS_CODE.OK).json({
          success: true,
          message: `Password updated successfully!`,
          userId: user._id
        });
      }
    } else {
      return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
        success: false,
        message: "Password doesn't match",
      });
    }
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).json({
      success: false,
      message: error,
    });

  }
}

const getUserById = async (request, response) => {
  try {
    const { userId } = request.body;
    const user = await database.user.getUserById(userId);
    return response.status(HTTP_STATUS_CODE.OK).json({
      message: 'Fetch user successfully!',
      user
    });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.NOT_FOUND)
      .json(ERROR_MESSAGE.DATA_NOT_FOUND);
  }
}

const deleteUserById = async (request, response) => {
  try {
    const { userId } = request.body;
    if (!userId) {
      return response.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        success: false,
        message: ERROR_MESSAGE.REQUIRED_PARAMETERS_MISSING,
      });
    }
    const user = await database.user.getUserById(userId);
    if (!user)
      return response
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(ERROR_MESSAGE.USER_NOT_EXIST);

    const deleted = await database.user.deleteUserById(userId);
    if (deleted)
      return response.status(HTTP_STATUS_CODE.OK).json({
        success: true,
        message: 'User deleted successfully!',
        user
      });
  } catch (error) {
    console.error('API Failed: ', error);
    return response
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER)
      .json(ERROR_MESSAGE.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  register,
  login,
  auth,
  updateUser,
  forgotPassword,
  resetPassword,
  fetchAllUsers,
  deleteUserById,
  getUserById,
  updatePassword,
  loggedinActivity
};
