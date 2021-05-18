const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation/user');
const bcrypt  = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    //VALIDATE THE DATA BEFORE CREATING USER
    const {error} = registerValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //Check if the user is already in the db
    const emailExists = await User.findOne({Email:req.body.Email});
    if(emailExists){
        return res.status(400).send('Email already exists')
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.Password, salt);

    const user = new User({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({UserId: savedUser._id});
    }
    catch(err){
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    //VALIDATE THE DATA BEFORE CREATING USER
    const {error} = loginValidation(req.body);
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    //Check if the user is in the db
    const user = await User.findOne({Email:req.body.Email});
    if(!user){
        return res.status(400).send('Invalid email or password')
    }

    //Check the password
    const validPass = await bcrypt.compare(req.body.Password, user.Password);
    if(!validPass){
        return res.status(400).send('Invalid email or password');
    }

    //Create and assign a token
    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECRET);
    
    console.log(token);
    //res.header('auth-token', token).send(token);

    res.send({Token: token })
});



module.exports = router;