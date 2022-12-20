import { body, validationResult } from 'express-validator';

function userRegisterValidation() {
    return [
        body("username", "username should be more than 6 and less than 20 letters and should be alphanumeric").notEmpty().isLength({ min: 6, max: 20 }),
        body("phone", "Enter a valid Phone number").isMobilePhone(),
        body("password", "Password must contain a small letter, a capital letter, a number and a special character").isStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 }),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password did not match');
            }
            return true;
        }),
    ]
}

function verifyotpvalidations() {
    return [
        body("phone").isMobilePhone(),
        body("otp").notEmpty()
    ]
}

function userLoginValidation() {
    return [
        body("username", "username is required").notEmpty(),
        body("password", "Password is required").notEmpty()
    ]
}

function tripInputValidation() {
    return [
        body("expenseFor", "Please enter a valid input").isString().notEmpty(),
        body("moneySpentBy", "Please enter a valid input").isArray(),
        body("moneyConsumedBy", "Please enter a valid input").isArray()
    ]
}

function newTripValidation() {
    return [
        body("tripName", "Please enter a valid trip name").notEmpty().isString().isLength({ min: 4, max: 30 }),
        body("members", "Enter a minimum 2 members. Maximum 200 members are allowed").isArray({ min: 2 })
    ]
}

function forgotPass() {
    return [
        body("phone", "please enter a valid value").isMobilePhone()
    ]
}

function verfiyNewPass() {
    return [
        body("phone", "please enter valid value").isMobilePhone(),
        body("otp", "Please enter a valid value").isString().notEmpty(),
        body("password", "Please Enter a strong Password").isStrongPassword({ minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 }),
        body("confirmPassword").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password did not match');
            }
            return true;
        })
    ]
}

function errorMiddleware(req, res, next) {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }
    next();
}





export { userRegisterValidation, tripInputValidation, forgotPass, verfiyNewPass, newTripValidation, userLoginValidation, verifyotpvalidations, errorMiddleware }