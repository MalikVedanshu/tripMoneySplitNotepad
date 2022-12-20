import express from "express";
import UserModel from "../Models/User.js";
import authmiddleware from '../middlewares/auth.js';
import { newTripValidation, errorMiddleware, tripInputValidation, forgotPass, verfiyNewPass } from '../middlewares/validation.js';
import settlePayment from '../Utils/paymentSettler.js';
const router = express.Router();


// 

/*
    API Endpoint : /trip/generatetrip
    Method : POST
    Access type : Private
    Validations : authmiddleware, newTripValidation,
    Description : User will create a trip for the first time, where name of the trip will be created
                    It takes tripname and members as a input and saves in new database modal in the database
*/


router.post('/generatetrip', authmiddleware, newTripValidation(), errorMiddleware, async (req, res) => {
    try {
        let { tripName, members } = req.body;

        let appUser = await UserModel.findById(req.payload._id)
        if (!appUser) return res.status(401).json({ error: "Invalid token. Login again" })
        if(appUser.username !== req.payload.username) return res.status(400).json({error: "Invalid token, login again"})

        if (appUser.verified === false) return res.status(401).json({ error: "Please verify you phone number first." })

        if (appUser.tripName != "") return res.status(401).json({ error: "A trip is already going on. First delete or save the ongoing trip and start new trip" })

        appUser.tripName = tripName;
        appUser.members = [...members];
        await appUser.save();
        return res.status(200).json({ msg: "Added successfully" });
    }
    catch (error) {
        return res.status(200).json({ error: "Internal server error" })
    }
})

/*
    API Endpoint : /trip/addexpense
    Method : POST
    Access type : Private
    Validations : authmiddleware, newTripValidation,
    Description : User will create a trip for the first time, where name of the trip will be created
                    It takes tripname and members as a input and saves in new database modal in the database
*/


router.post('/addexpense', authmiddleware, tripInputValidation(), errorMiddleware, async (req, res) => {
    try {
        let { expenseFor,moneySpentBy, moneyConsumedBy } = req.body;
        let user = await UserModel.findById(req.payload._id);
        if (!user) return res.status(401).json({ error: "Login again" })
        if(user.username  !== req.payload.username) return res.status(400).json({error: "Invalid token, login again"})

        if (user.verified === false) return res.status(401).json({ error: "Please verify you phone number first." })

        if (moneySpentBy.length !== user.members.length || moneyConsumedBy.length !== user.members.length) return res.status(401).json({ error: "Input is invalid" })

        let numberOfConsumers = 0
        let totalExpense = 0;
        moneyConsumedBy.forEach((ele, idx) => {
            if (ele === true) numberOfConsumers += 1;
            totalExpense = totalExpense + moneySpentBy[idx]
        })

        if (numberOfConsumers <= 0 || totalExpense <= 0) return res.status(401).json({ error: "Input is invalid" })

        let calculatedExpense = [];
        moneySpentBy.forEach((ele, indx) => {

            if (moneyConsumedBy[indx] === false) {
                if(ele * 1 === 0){
                    calculatedExpense[indx] = 0
                }
                else {
                    calculatedExpense[indx] = ele // condition 1 top priority
                }
            } else {
                calculatedExpense[indx] = ele - Math.round((totalExpense / numberOfConsumers))
            }

        })

        user.expenses[user.expenses.length] = {expenseFor:expenseFor, moneySpentBy: moneySpentBy, moneyConsumedBy: moneyConsumedBy, calculatedExpense: calculatedExpense };
        await user.save();
        return res.status(200).json({ msg: "expense added successfully" })
    }
    catch (error) {
        return res.status(500).json({ error: error.name })
    }
})

/*
    API Endpoint : /trip/generatereport
    Method : GET
    Access type : Private
    Validations : authmiddleware
    Description : Based upon data till now, user can view the result (who pays how much to whom)
*/


router.get('/generatereport', authmiddleware, async (req, res) => {

    try {
        let user = await UserModel.findById(req.payload._id);
        if (!user) return res.status(401).json({ error: "Login again" })
        if(user.username  !== req.payload.username) return res.status(400).json({error: "Invalid token, login again"})

        if (user.verified === false) return res.status(401).json({ error: "Please verify you phone number first." })


        let members = user.members;
        let allExpenses = user.expenses;
        let tripName = user.tripName;
        let expenseOutput = user.members.map(ele => ele = 0)
        user.expenses.forEach(exp => {
            exp.calculatedExpense.forEach((elem, indx) => {
                expenseOutput[indx] = expenseOutput[indx] + elem;
            })
        })
        let reports;
        if(user.expenses.length > 0) {
            reports = settlePayment(user.members, expenseOutput)
        } else {
            reports = []
        }
        

        return res.status(200).json({tripmembers: members, tripDashboard: reports, allExpenses: allExpenses, tripName: tripName })
    }
    catch (error) {
        return res.status(500).json({ error: error.name })
    }
})

/*
    API Endpoint : /deletecurrenttrip
    Method : delete
    Access type : Private
    Validations : authmiddleware
    Description : User can delete all the data of current trip and start a new trip
*/


router.delete('/deletecurrenttrip', authmiddleware, async (req, res) => {
    try {
        let user = await UserModel.findById(req.payload._id);
        if (!user) return res.status(401).json({ error: "Login again" })
        if(user.username  !== req.payload.username) return res.status(400).json({error: "Invalid token, login again"});

        if(!user.verified) return res.status(401).json({error: "Please verify your mobile number first"})

        user.tripName = "";
        user.expenses = [];
        user.members = [];
        await user.save()
        return res.status(200).json({ msg: "Your current trip data is deleted successfully" })
    }
    catch (error) {
        return res.status(500).json({ error: `Internal server error` })
    }
})

/*
    API Endpoint : /forgotpassword
    Method : post
    Access type : Private
    Validations : authmiddleware, forgotPass
    Description : user will recieve a otp to reset password 
*/




router.get('/getmembers', authmiddleware, async (req,res) => {
    try {
        const myData = await UserModel.findById(req.payload._id);
        if(!myData) return res.status(401).json({msg: "Invalid token"})

        if(myData.username  !== req.payload.username) return res.status(400).json({error: "Invalid token, login again"})
        if(!myData.verified) return res.status(401).json({error: "Please verify your mobile number first"})

        return res.status(200).json({members: myData.members})
    }
    catch(error) {
        return res.status(500).json({error: "invalid request"})
    }
})

router.get('/getallexpensedata',authmiddleware, async(req,res) => {
    try {
        const userData = await UserModel.findById(req.payload._id);
        if(!userData) res.status(401).json({error: "Invalid token"})

        if(userData.username  !== req.payload.username) return res.status(400).json({error: "Invalid token, login again"})
        if(!userData.verified) return res.status(401).json({error: "Please verify your mobile number first"})
        return res.status(200).json({expenses: userData.expenses, tripName: userData.tripName, members: userData.members})
    }
    catch (error) {
        return res.status(500).json({error: "Something went wrong"})
    }
})

router.get('/atrip/:eid', authmiddleware, async(req,res) => {
    try {
        let userData = await UserModel.findById(req.payload._id);
        if(!userData) res.status(401).json({error: "Invalid user"})

        if(userData.username !== req.payload.username) return res.status(400).json({msg: "Invalid token, Login again"})

        if (userData.verified === false) return res.status(401).json({ error: "Please verify you phone number first." })

        let {eid} = req.params
        let expenseIndex = userData.expenses.findIndex(ele => ele._id.toString() === eid)
        if(expenseIndex == -1) return res.status(401).json({error: "Invalid Trip"})
        return res.status(200).json({expenseDetails: userData.expenses[expenseIndex], members: userData.members});
    }
    catch(error) {
        return res.status(500).json({error: "Internal server error"})
    }
})

router.put('/edit/:eid',authmiddleware, tripInputValidation() , errorMiddleware, async(req,res) => {
    try {
        let userData = await UserModel.findById(req.payload._id);
        if(!userData) return res.status(401).json({error: "Invalid user"})
        if (userData.username !== req.payload.username) return res.status(400).json({msg: "Invalid token, Login again"})
        if (userData.verified === false) return res.status(401).json({ error: "Please verify you phone number first." })

        let {eid} = req.params
        let {expenseFor, moneySpentBy, moneyConsumedBy } = req.body;
        if (moneySpentBy.length !== userData.members.length || moneyConsumedBy.length !== userData.members.length) return res.status(401).json({ error: "Input is invalid" })

        let expenseIndex = userData.expenses.findIndex(ele => ele._id.toString() === eid)
        if(expenseIndex == -1) return res.status(401).json({error: "Invalid Trip"})

        let numberOfConsumers = 0
        let totalExpense = 0;
        moneyConsumedBy.forEach((ele, idx) => {
            if (ele === true) numberOfConsumers += 1;
            totalExpense = totalExpense + moneySpentBy[idx]
        })

        if (numberOfConsumers <= 0 || totalExpense <= 0) return res.status(401).json({ error: "Input is invalid" })

        let calculatedExpense = [];
        moneySpentBy.forEach((ele, indx) => {

            if (moneyConsumedBy[indx] === false) {
                if(ele * 1 === 0){
                    calculatedExpense[indx] = 0
                }
                else {
                    calculatedExpense[indx] = ele
                }
            } else {
                calculatedExpense[indx] = ele - Math.round((totalExpense / numberOfConsumers))
            }

        })
        userData.expenses[expenseIndex] = {expenseFor:expenseFor, moneySpentBy: moneySpentBy, moneyConsumedBy: moneyConsumedBy, calculatedExpense: calculatedExpense};

        await userData.save();
        return res.status(200).json({msg: "Expense editied successfully"});
    }
    catch(error) {
        return res.status(500).json({error: "Internal server error"})
    }
})


export default router;