const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const validateEmail = require('../helpers/validateEmail')
const createToken = require('../helpers/createToken')
const sendMail = require('../helpers/sendMail');
const { google } = require('googleapis');
const { create } = require('../models/userModel');
const {OAuth2} = google.auth;
require("dotenv").config();

const userController = {
    register: async (req, res) => {
        try{
            // get info
            const {name, email, password} = req.body

            // check fields
            if(!name || !email || !password) return res.status(400).json({message: 'Please fill in all fields'})

            // check email format
            if(!validateEmail(email)) return res.status(400).json({message: 'Please enter a valid email'})

            // check user exists
            const user = await User.findOne({email})
            if(user) return res.status(400).json({message: 'This email is already registered'})

            // check input password
            if(password.length < 6) return res.status(400).json({message: 'Password must be atleast 6 characters'})

            // hash password
            const salt = await bcrypt.genSalt()
            const hashPassword = await bcrypt.hash(password, salt)

            // create token
            const newUser = {name, email, password: hashPassword}
            const activation_token = createToken.activation(newUser)

            // send email
            const url = `http://localhost:3000/api/auth/activate/${activation_token}`
            sendMail.sendEmailRegister(email, url, "Verify Your Email")

            // register successful
            res.status(200).json({message: "Welcome, PLease check your email"})
        }catch(err){
            res.status(500).json({message: err.message})
        }
    },
    activate: async(req,res) => {
        try{
            // get token
            const {activation_token} = req.body

            // verify token
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN)
            const {name, email, password} = user

            //check user
            const check = await User.findOne({email})
            if(check) return res.status(400).json({message: "This email is already registered"})

            // add user to db
            const newUser = new User({name, email, password})
            await newUser.save()

            //activate success
            res.status(200).json({message: 'Your account has been activated, you can now sign in'})
        } catch(err){
            res.status(500).json({msg: err.message})
        }
    },
    signin: async(req,res) => {
        try{
            //get credentials
            const {email, password} = req.body

            //check email
            const user = await User.findOne({email})
            if(!user) return res.status(400).json({message: 'This email is not registered'})

            //check password
            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({message: 'This password is incorrect'})

            //refresh token
            const rf_token = createToken.refresh({id: user._id })
            res.cookie("_apprftoken", rf_token, {
                httpOnly: true,
                path: '/api/auth/access',
                maxAge: 24 * 60 * 60 * 1000 //24hr
            })

            //signin success
            res.status(200).json({message: 'Signin Success'})
        }catch(err){
            res.status(500).json({message: err.message })
        }
    },
    access: async(req, res) => {
        try{
            //rf token
            const rf_token = req.cookies._apprftoken
            if(!rf_token) return res.status(400).json({message: 'Please Sign in'})

            // validate token
            jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user) => {
                if(err) return res.status(400).json({message: 'Please sign in again'})
                // create access token
                const access_token = createToken.access({id: user.id})
                // access success
                return res.status(200).json({access_token});
            })
            
            
        } catch(err){
            return res.status(500).json({message: err.message})
        }
    },
    forgot: async(req, res) => {
        try{
            //get email
            const {email} = req.body

            //check email exists
            const user = await User.findOne({email})
            if(!user) return res.status(400).json({message: 'This email is not registered'})

            //create access token
            const access_token = createToken.access({id: user.id})

            //send email
            const url = `http://localhost:3000/auth/reset-password/${access_token}`
            const name = user.name
            sendMail.sendEmailReset(email, url, "Reset your password", name)

            // success
            res.status(200).json({message: 'Resend the password, please check your email'})
        } catch(err){
            res.status(500).json({message: err.message})
        }
    },
    reset: async (req, res) => {
        try{
            //get password
            const {password} = req.body

            //hash passowrd
            const salt = await bcrypt.genSalt()
            const hashPassword = await bcrypt.hash(password, salt)

            //update password
            await User.findOneAndUpdate({_id: req.user.id}, {password: hashPassword})

            //reset success
            res.status(200).json({message: 'Password was reset successfully'})
        } catch(err){
            res.status(500).json({message: err.message})
        }
    },
    info: async (req, res) => {
        try{
            //get user info
            const user = await User.findById(req.user.id).select("-password")

            //return user
            res.status(200).json( user )
        } catch(err){
            res.status(500).json({message: err.message})
        }
    },
    update: async (req, res) => {
        try{
            //get info
            const {name, avatar} = req.body

            //update
            await User.findOneAndUpdate({_id: req.user.id},{name,avatar})

            //success
            res.status(200).json({message: 'Updated'})
        } catch(err){
            res.status(500).json({message: err.message})
        }
    },
    signout: async (req, res) => {
        try{
            //clear cookie
            res.clearCookie("_apprftoken", {path: "/api/auth/access"})
        
            //success
            return res.status(200).json({ message: "Signout successful"})
        } catch(err){
            res.status(500).json({ message: err.message })
        }
    },
    google: async (req, res) => {
        try{
            //get google token ID
            const tokenID = req.body

            //verify ID
            const client = new OAuth2(process.env.G_CLIENT_ID)
            const verify = await client.verifyIdToken({
                idToken: tokenID,
                audience: process.env.G_CLIENT_ID
            })

            //get data
            const { email_verified, email, name, picture} = verify.payload

            //failed verification
            if(!email_verified) return res.status(400).json({message: 'Email verification failed'})

            //pass verification
            const user = await User.findOne({email})

            // if user exist, signin
            if(user){
                //create refresh token
                const rf_token = createToken.refresh({id: user._id})
                //store cookie
                res.cookie("_apprftoken", rf_token,{
                    httpOnly: true,
                    path: '/api/auth/access',
                    maxAge: 24 * 60 * 60 * 1000 //24hr
                })
                //success
                res.status(200).json({message: 'Signin with Google Success'})
            } else {
                const password = email + process.env.G_CLIENT_ID
                const salt = await bcrypt.genSalt();
                const hashPassword = await bcrypt.hash(password, salt)
                const newUser = new User({
                    name, email, password: hashPassword, avatar: picture
                })
                await newUser.save()
                //sign in new user and create refresh token
                 const rf_token = createToken.refresh({id: user._id})
                 //store cookie
                 res.cookie("_apprftoken", rf_token,{
                     httpOnly: true,
                     path: '/api/auth/access',
                     maxAge: 24 * 60 * 60 * 1000 //24hr
                 })
                 //success
                 res.status(200).json({message: 'Signin with Google Success'})
            }
        } catch(err){
            res.status(500).json({ message: err.message })
        }
    }
}

module.exports = userController;