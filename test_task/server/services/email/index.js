const nodemailer = require('nodemailer');
let baseURL = '';
if (process.env.ENV === 'DEVELOPMENT') {
  baseURL = process.env.FRONTEND_BASE_URL_DEV;
} else {
  baseURL = process.env.FRONTEND_BASE_URL_LIVE;
}

const clientId = '281537956482-uiu291oikutvjdgegq3rfo60bhcjs06p.apps.googleusercontent.com'
const accessToken = 'ya29.a0AeTM1ic30IMDAdun2M84A1bPlMt7b_1uZ0RPEAy1mfloUKvABGIsdZtk-ecZvSaR1FwMTzhNXO0PnTgiX-dIcSxEXEy9299fCXLaHv59S-qR1MAdxlfKHeFt21P5gUhTyu8OJ0a-zopuEHMS0fmQIdy6y2VSaCgYKASMSARASFQHWtWOmI4ej6MNuMWzTEl14XqhEhg0163'
const clientSecret = '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'
const refreshToken = '1//04TVsn6MiaK-QCgYIARAAGAQSNwF-L9Ir5dVf-pzDB328cJP1ztnQ7GBblA00Ab-318fXNlhwztAVreV6_CFRADdJbf02zD-uTBo'
const emailFrom = '"Faizan Abid" <menialservices@gmail.com>';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'menialservices@gmail.com',
    pass: 'pak12345',
    type: 'OAuth2',
    clientId,
    accessToken,
    clientSecret,
    refreshToken
  },
});

const resetPasswordMail = (to, userId) => {
  
  const mailOptions = {
    to: to, // Change to your recipient
    from: emailFrom, // Change to your verified sender
    subject: 'Reset Password',
    html: '<strong>Click on the link to reset the password: </strong>' + '<br />' + `<a href='${baseURL}/reset-password?userId=${userId}' target='_blank'>Reset Password Here</a>`,
  }

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log(info);
  });
};

module.exports = {
  resetPasswordMail,
};
