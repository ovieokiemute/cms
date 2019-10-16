const express = require('express');
const User = require('../models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');

const router = new express.Router();


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'home';

    next();
})



router.post('/register', async (req, res) => {
    const user = new User(req.body);
    

    try {
        const checkEmail = await User.findOne({email: req.body.email})

        if(checkEmail){
            req.flash('errorMsg', 'Email already Exist. Please log in');
            return res.redirect('/login')
        }
       
        await user.save();
        req.flash('notice', 'Your registration was successful. You can now login')
        res.redirect('/login')
        
    } catch (err) {
       res.render('home/register', {err: Object.keys(err.errors).map(key => err.errors[key])})
      
    }
    
});

passport.use(new LocalStrategy({usernameField:'email'},async (email, password, done)=>{

    try {
        const user = await User.findOne({email})
        if(!user){
            return done(null, false, {message: 'Invalid Email or Password. Try again'})

        }
        

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return done(null, false, {message: 'Invalid Email or Password. Try again'})
        }
        return done(null, user)
        
    } catch (error) {
        //return done(error)
        console.log(error);
    }
   
}));

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user);
    });
});




router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login')
})







module.exports = {
    router
}