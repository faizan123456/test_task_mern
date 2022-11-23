// ERROR MESSAGES
const ERROR_MESSAGE = {
  DATA_NOT_FOUND: 'Data not found',
  REGISTRATION_FAIL: 'Registration Failed',
  AUTH_FAIL: 'Authentication Failed',
  LOGIN_FAIL: 'Login Failed',
  INCORRECT_PASSWORD:"Password is incorrect!",
  ADMIN_ALREADY_EXIST: 'Admin already exists',
  USER_EMAIL_ALREADY_EXIST: 'User already exists with this email',
  ACCOUNT_DOES_NOT_EXIST: `Account does not exist in our database please sign up`,
  USER_NAME_ALREADY_EXIST: 'User already exists with this username',
  ADMIN_NOT_EXIST: "Admin doesn't exist",
  INVALID_SECRET: 'The secret is invalid',
  EMAIL_PASSWORD_INCORRECT: 'Email or Password is Incorrect',
  REQUIRED_PARAMETERS_MISSING: 'Required parameters are missing',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  REQUIRE_TOKEN: 'No token available, authorization denied!',
  INVALID_TOKEN: 'Invalid Token, authorization denied',
  INVALID_ID: 'Invalid id provided',
  INVALID_REQUEST: 'Request not supported',
  USER_NOT_EXIST: 'User does not exist',
  INVALID_WORLD: 'Invalid world present',
  EMAIL_SET_FAIL: 'Email could not be added to newsletter',
  SEND_EMAIL_VERIFICATION_FAILED: 'Sending verification email failed',
  INVALID_EMAIL: `Please provide a valid email address`,
};

// HTTP STATUS CODES
const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOW: 405,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
};

if (process.env.ENV === 'DEVELOPMENT') {
  FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL_DEV;
} else {
  FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL_LIVE;
}


module.exports = {
  ERROR_MESSAGE,
  HTTP_STATUS_CODE,
  FRONTEND_BASE_URL,
};
