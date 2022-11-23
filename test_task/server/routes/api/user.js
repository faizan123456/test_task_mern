const router = require('express').Router();
const controller = require('../../controllers/user');
const { userAuth } = require('../../middlewares/auth');

const {
  registerValidations,
  loginValidations,
  validatePassword,
  validateEmail,
  validator,
} = require('../../middlewares/validations');


router.post('/register', registerValidations, validator, controller.register);

router.post('/login', loginValidations, validator, controller.login);

router.post('/singleUser', controller.getUserById);

router.get('/', controller.fetchAllUsers);
router.get('/activities', controller.loggedinActivity);

router.put('/updateUser', [userAuth], controller.updateUser);

router.post('/forgot-password', validateEmail, validator, controller.forgotPassword);

router.post('/update-password', [userAuth], validatePassword, validator, controller.updatePassword);
router.post('/reset-password', validatePassword, validator, controller.resetPassword);

router.post('/delete', [userAuth], controller.deleteUserById)

// API to Authenticate
router.post('/auth', [userAuth], controller.auth);

module.exports = router;
