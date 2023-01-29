const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt  = require('jsonwebtoken')

const userschema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add a name'],
    },
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        unique : true,
        required : [true, "Please add email"],

      },
      role : {
        type : String,
        enum : ['user', 'publisher'],
        default : 'user'
      },
      password : {
        type : String,
        required : [true, 'Please add a password'],
        minlength : 6,
        select : false
      },
      resetpasswordtoken : String,
      resentpasswordexpire : Date,
      createdAt : {
        type :  Date,
        default : Date.now
      }
})

//Encrypt password using bcrypt
userschema.pre('save', async function(next){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})


//sign JWT and return
userschema.methods.getSignedJwtToken = function()
{
  return jwt.sign({id : this._id}, process.env.JWT_SECRET, {
    expiresIn : process.env.JWT_EXPIRE
  });

}


//match user entered password to hash password in database
userschema.methods.matchPassword = async function(enteredpass)
{
  return await bcrypt.compare(enteredpass, this.password);
}

module.exports = mongoose.model('User', userschema);
