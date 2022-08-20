require('dotenv').config();
module.exports = {
  allowedOrigins: ['http://localhost:3000/'],
  SERVER_PORT: process.env.PORT || 3000,
  SERVER_DB_URI: process.env.DB_URI,
  JWT_SECRET: 'thisIsASimpleTest',
  OTP_LENGTH: 10,
  OTP_CONFIG: {
    upperCaseAlphabets: false,
    specialChars: false,
  },
  MAIL_SETTINGS: {
    service: 'gmail',
    auth: {
      user: "a13aa694742907",
      pass: "ba8a1db85a553e"
    },
  },
};
