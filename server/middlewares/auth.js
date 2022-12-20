import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
import config from 'config';

function authmiddleware(req,res,next) {
    try {
        let token = req.headers["z-auth-token"];
        var bytes = CryptoJS.AES.decrypt(token, config.get("encryption_key"));
        let decryptToken = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        let decoded = jwt.verify(decryptToken, config.get("jwt_secret_key"));
        req.payload = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({error: "Access denied. Authentication error"})
    }
}

export default authmiddleware;