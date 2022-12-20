import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    phone : {
        type : String,
        required: true,
        unique: true
    },
    password : {
        type : String,
        required : true
    },
    tripName: {
        type: String,
        default: ""
    },
    members: [
        { type: String }
    ],
    expenses: [
        {
            expenseFor: {
                type: String
            },
            moneySpentBy: [
                { type: Number }
            ],
            moneyConsumedBy: [
                { type: Boolean }
            ],
            calculatedExpense: [
                { type: Number }
            ]
        }
    ],
    verified : {
        type : Boolean , 
        default : false,
        required: true
    },
    tokens :  {
        otp: {
            type : String, 
            required : true
        },
        validity: {
            type: String,
            required: true
        }
    },
    pin : {
        type: String,
        default: ""
    }
});
const UserModel = mongoose.model("User",userSchema,"app-members");
export default UserModel; 