// wordScrambleCaptcha.js

let captcha;

export function generateCaptcha() {
    captcha = '';

    const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Generate captcha of length 5 with random characters
    for (let i = 0; i < 5; i++) {
        captcha += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }

    return captcha;
}

export function checkCaptcha(userInput) {
    return userInput === captcha;
}