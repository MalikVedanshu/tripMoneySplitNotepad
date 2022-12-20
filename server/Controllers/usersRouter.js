import express from 'express';
import bcrypt from "bcrypt";
import UserModel from '../Models/User.js';
import config from 'config';
import randomOtp from '../Utils/otp.js';
import sendSMS from '../Utils/sms.js';
import authmiddleware from '../middlewares/auth.js';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { userRegisterValidation, errorMiddleware, userLoginValidation,verfiyNewPass, verifyotpvalidations, forgotPass } from '../middlewares/validation.js';

const router = express.Router();

/*
    API Endpoint : /user/register
    Method : POST
    Access type : Public
    Validations : userRegisterValidation
    Description : Sends a otp and save encrypted new valid data of user in the database
*/

router.post("/register", userRegisterValidation(), errorMiddleware, async (req, res) => {
    try {

        let checkPhone = await UserModel.findOne({ phone: req.body.phone })
        if (checkPhone) {
            return res.status(409).json({ error: "This phone is already registered with us." })
        }
        let checkUsername = await UserModel.findOne({ username: req.body.username })
        if (checkUsername) {
            return res.status(409).json({ error: "This username is taken, choose another" })
        }
        let userdata = new UserModel(req.body);
        userdata.password = await bcrypt.hash(req.body.password, 12);
        let myotp = randomOtp(6) //await bcrypt.hash(req.body.otp, 12)
        // userdata.tokens.otp = randomOtp(6);
        userdata.tokens.otp = await bcrypt.hash(myotp, 12)
        userdata.tokens.validity = new Date().getTime() + (1000 * 60 * 5);
        await userdata.save();

        if (userdata.phone !== "") {
            await sendSMS({
                smsContent: `Hello, your OTP is ${myotp}. It is valid for 5 minutes.`,
                phoneNumber: userdata.phone
            })
            return res.status(200).send({ msg: "SMS sent successfully," });
        }
    }
    catch (error) {
        res.status(500).send({ error: error.response });
    }
})

/*
    API Endpoint : /user/verify
    Method : POST
    Access type : Public
    Validations :
        userLogin verifyotpvalidation,
    Description : takes otp as a request to verify phone number and changes data from unverified to verified in the database
*/


router.post("/verify", verifyotpvalidations(), errorMiddleware, async (req, res) => {
    try {
        let { phone, otp } = req.body;
        if (phone === "") return res.status(409).json({ error: "Enter a valid phone number" });
        let phoneUser = await UserModel.findOne({ phone: phone })

        if (!phoneUser) {
            return res.status(409).json({ error: "invalid phone or otp" });
        }

        if (phoneUser.verified === true) {
            return res.status(409).json({ error: "this user is already registered" });
        }
        if (new Date().getTime() > phoneUser.tokens.validity) {
            return res.status(409).json({ error: "Token is expired" })
        }
        let otpVerify = await bcrypt.compare(otp, phoneUser.tokens.otp);
        if (!otpVerify) return res.status(200).json({ error: "invalid otp" })
        // if (otp != phoneUser.tokens.otp) {
        //     return res.status(200).json({ error: "invalid otp" })
        // }
        phoneUser.verified = true;
        await phoneUser.save();
        return res.status(200).json({msg: "This phone number is now registered with trip-app"})

        // res.status(200).send("This phone number is now registered with scheduler app")
    }
    catch (err) {
        res.status(500).send("Unable to register this phone number. Internal server error")
    }
})

/*
    API Endpoint : /user/resendotp
    Method : POST
    Access type : Public
    Validations :
        forgotPass,
    Description : 
        used in forget password and change password
        incase 5 mins of the user is over, he can click resend to get otp again
*/

router.post("/resendotp", forgotPass(), errorMiddleware, async (req, res) => {
    try {
        let { phone } = req.body;
        if (phone === "") return res.status(409).json({ error: "Register your phone first" });

        let phoneUser = await UserModel.findOne({ phone: phone })

        if (!phoneUser) {
            return res.status(409).json({ error: "Register first" });
        }

        if (phoneUser.verified) {
            return res.status(409).json({ error: "this user is already registered" });
        }
        let myotp = randomOtp(6)
        phoneUser.tokens.otp = await bcrypt.hash(myotp, 12);
        phoneUser.tokens.validity = new Date().getTime() + (1000 * 60 * 5);
        await userdata.save();

        sendSMS({
            smsContent: `Hello, your OTP is ${myotp}. It is valid for 5 minutes.`,
            phoneNumber: phoneUser.phone
        })
        return res.status(200).send({ pleaseVerify: "SMS sent successfully" });
    }
    catch (err) {
        res.status(500).send("Unable to register this phone number. Internal server error")
    }
})

/*
    API Endpoint : /user/login
    Method : POST
    Access type : Public
    Validations : userLoginValidation,
    Description : Return encrypted JWT token which eventually get saved in localhost 
    to recieve further protected requests as headers, which will be held by authmiddleware
*/



router.post("/login", userLoginValidation(), errorMiddleware, async (req, res) => {
    try {
        const { username, password } = req.body;
        const userData = await UserModel.findOne({ username: username });
        if (!userData) return res.status(401).json({ error: "Invalid credentials, username not found" });

        let validPassword = await bcrypt.compare(password, userData.password);

        if (!validPassword) return res.status(401).json({ error: "Invalid credentials, invalid password" });


        if (!userData.verified) {
            let myOtp = randomOtp(6);

            userData.tokens.otp = await bcrypt.hash(myOtp, 12)
            userData.tokens.validity = new Date().getTime() + (1000 * 60 * 5);
            await userData.save();


            await sendSMS({
                smsContent: `Hello, your OTP is ${myOtp}. It is valid for 5 minutes.`,
                phoneNumber: userData.phone
            })
            return res.status(200).send({ msg: "Please verify your phone first, Your OTP is sent on your device." });
        }


        let token = jwt.sign({ _id: userData._id, username: username }, config.get("jwt_secret_key"), { expiresIn: '10d' });
        let encryptToken = CryptoJS.AES.encrypt(JSON.stringify(token), config.get("encryption_key")).toString();
        return res.status(200).json({ token: encryptToken });
    }
    catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
})

router.post('/forgotpassword', forgotPass(), errorMiddleware, async (req, res) => {
    try {
        let { phone } = req.body;
        let user = await UserModel.findOne({ phone: phone });
        if (!user) return res.status(401).json({ error: "User not found" })
        
        let myOtp = randomOtp(6);
        user.tokens.otp = await bcrypt.hash(myOtp, 12);
        user.tokens.validity = new Date().getTime() + (1000 * 60 * 5)

        await user.save();
        await sendSMS({
            smsContent: `Hello, ${user.username}, your OTP to reset password is ${myOtp}. It is valid for 5 minutes.`,
            phoneNumber: user.phone
        })
        return res.status(200).json({ msg: "Your otp is sent" })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
})

/*
    API Endpoint : /verifynewpass
    Method : post
    Access type : Private
    Validations : verifyNewPass
    Description : User can delete all the data of current trip and start a new trip
*/

router.post('/verifynewpass', verfiyNewPass(), errorMiddleware, async (req, res) => {
    try {
        let { phone, otp, password } = req.body;
        let user = await UserModel.findOne({ phone: phone });
        if (!user) return res.status(401).json({ error: "Invalid user" })
        let verifiedOtp = await bcrypt.compare(otp, user.tokens.otp)

        if (!verifiedOtp) return res.status(401).json({ error: "invalid otp" });

        if (new Date().getTime() > user.tokens.validity) return res.status(401).json({ error: "Token expired" })

        user.password = await bcrypt.hash(password, 12);
        user.tokens.validity = new Date().getTime();

        await user.save();

        res.status(200).json({ msg: "Password is updated" })
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error" })
    }
})

// verification purpose (in use effect);

router.get("/amilogin", authmiddleware, errorMiddleware, async (req, res) => {
    try {
        let validUser = UserModel.findById(req.payload._id)
        if (!validUser) return res.status(401).json({ error: "Invalid user, login again" });
        return res.status(200).json({ msg: "yes" });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: "internal server error" });
    }
})


export default router;