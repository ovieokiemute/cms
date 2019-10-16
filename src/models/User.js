const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Enter your First Name'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Enter your Last Name'],
        trim: true
    },

    email: {
        required: [true, 'Email is required'],
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid')
            }
        }
    },

    password: {
        required: [true, 'choose a password'],
        type: String,
        minlength: 3,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain the text "password"')
            }
        }
    }
});

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);


    }

    next()
});







// userSchema.pre('login', passport.use({}, function(){}))

// userSchema.statics.findCredentials = async (email, password) => {
//     const user = await User.findOne({email});

//     if(!user){
//         throw new Error('Unable to login')
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if(!isMatch){
//         throw new Error('Unable to login');
//     }

//     return user;
// }





const User = mongoose.model('user', userSchema);

module.exports = User;