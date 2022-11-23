const { model, Schema } = require('mongoose');

const validateEmailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validateEmail = (email) => {
  return validateEmailRe.test(email);
};

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [
        validateEmailRe,
        'Please fill a valid email address',
      ],
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    nonce: {
      allowNull: false,
      type: Schema.Types.Number,
      defaultValue: () => Math.floor(Math.random() * 1000000), // Initialize with a random nonce
    },
    isAdmin: {
      type: Boolean,
    },
    lastLogin: {
      user: { type: String },
      time: { type: Date }
    },
  },
  { timestamps: true },
);

const User = model('User', userSchema);
module.exports = User;
