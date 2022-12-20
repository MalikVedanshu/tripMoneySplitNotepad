function randomOtp(till) {
    let token = '';
    for (let i = 0; i < till; i++) {
        token += String.fromCharCode(48 + Math.floor(9 * Math.random()))
    }
    return token;
}
export default randomOtp;