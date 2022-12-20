import twilio from "twilio";
import config from 'config';
async function sendSMS(smsData) {
    const {smsContent, phoneNumber} = smsData;
    
    const accountSID = config.get("sms.accountsid");
    const auth = config.get("sms.auth");
    const myPhone = config.get("sms.myphone");

    const client = new twilio(accountSID, auth);
    let messages = await client.messages
        .create({
            body: smsContent,
            from: myPhone,
            to: phoneNumber
        })
    try {
        console.log(messages.sid)
    }
    catch (err) {
        console.log(err)
    }
}
export default sendSMS;