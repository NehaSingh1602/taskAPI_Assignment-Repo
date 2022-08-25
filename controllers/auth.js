const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// OTP START
const { encrypt, compare } = require('../services/crypto');
const { generateOTP } = require('../services/OTP');
const { sendMail } = require('../services/MAIL');
// OTP END

const User = require('../models/user');

// exports.signup = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed.');
//     error.statusCode = 422;
//     error.data = errors.array();
//     throw error;
//   }
//   const email = req.body.email;
//   const name = req.body.name;
//   const password = req.body.password;
//   bcrypt
//     .hash(password, 12)
//     .then(hashedPw => {
//       const user = new User({
//         email: email,
//         password: hashedPw,
//         name: name
//       });
//       return user.save();
//     })
//     .then(result => {
//       res.status(201).json({ message: 'User created!', userId: result._id });
//     })
//     .catch(err => {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     });
// };

// /////////////////////////////////////////////////////////////////////////////

// LOGIN : Verify : email, password, OTP: active:true

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      if(!loadedUser.active)
      {
        const error = new Error('OTP not validated!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        'somesupersecretsecret',
        { expiresIn: '5hr' },
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


// //////////////////////////////////////////////////////////////
// SignUP using OTP

module.exports.signUpUser = async (req, res) => {
  const { email, password } = req.body;
  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    return res.send('Already existing');
  }
  // create new user
  const newUser = await createUser(email, password);
  if (!newUser[0]) {
    return res.status(400).send({
      message: 'Unable to create new user',
    });
  }
  res.send(newUser);
};

// Verify email with OTP
module.exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  const user = await validateUserSignUp(email, otp);

  res.send(user);
};


//METHODS
const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return false;
  }
  return user;
};

const createUser = async (email, password) => {
  const hashedPassword = await encrypt(password);
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    email,
    password: hashedPassword,
    otp: otpGenerated,
  });
  console.log(newUser);
  if (!newUser) {
    return [false, 'Unable to sign you up'];
  }
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newUser];
  } catch (error) {
    return [false, 'Unable to sign up, Please try again later', error];
  }
};

const validateUserSignUp = async (email, otp) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return [false, 'User not found'];
  }
  if (user && user.otp !== otp) {
    return [false, 'Invalid OTP'];
  }
  const updatedUser = await User.findByIdAndUpdate(user._id, {
    $set: { active: true },
  });
  return [true, "OTP Validated Successfully"];
};



  // const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  // //console.log(authHeader.login);
  // //console.log(accounts[req.headers.login].id);

  // jwt.sign(authHeader,"somesupersecretsecret" ,  { expiresIn: '1hr' } , (logout, err) => 
  // {
  //   console.log(logout);
  // if (logout) {
  // res.send({msg : 'You have been Logged Out' });
  // } else {
  // res.send({msg:'Error'});
  // }
  // });
  //const authHeader = req.headers["authorization"];

  
  module.exports.logoutUser = async (req, res) => {
   try {
    console.log("emtered");
    console.log(req.user);
    req.user.tokens = [];
    
    await req.user.save();
    res.send({msg : 'You have been Logged Out' });
  } catch (error) {
    res.status(500).send(error);
}
};
  


