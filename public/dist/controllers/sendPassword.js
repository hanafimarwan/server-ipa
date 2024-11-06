"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.change_pass = exports.send_Password = void 0;
const sendPasswordEmail_1 = require("../model/sendPasswordEmail");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const XmlFunction_1 = require("../model/XmlFunction");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getRandomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function send_Password(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            // Check if the email exists
            const emailExists = yield (0, XmlFunction_1.checkEmailExists)(email);
            if (!emailExists)
                return res.json(-1);
            // Generate a random number between 10000 and 99999
            const randomNumber = getRandomNumberInRange(10000, 99999);
            // Get email credentials from environment variables
            const from = process.env.TYPE_APP_PY_EMAIL_USER || '';
            const password = process.env.TYPE_APP_PY_EMAIL_PASS || '';
            const to = email;
            const subject = 'Password Change Notification';
            const tempHtmlPath = path_1.default.join(__dirname, 'tempEmail.html');
            const body = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Change Notification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 5px; 
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333333;
                }
                p {
                    color: #555555;
                    line-height: 1.5;
                }
                .highlight {
                    font-weight: bold;
                    color: #e74c3c; 
                }
                strong{
                    color:green;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Change Notification</h1>
                <p>We are unable to change your password due to a <span class="highlight">security error</span>.</p>
                <p>Your code is <strong>${randomNumber}</strong>.</p>
            </div>
        </body>
        </html>`;
            fs_1.default.writeFileSync(tempHtmlPath, body); // Write the HTML content to the file
            // Send the email using the temporary HTML file
            (0, sendPasswordEmail_1.send_Email)(from, password, to, subject, tempHtmlPath)
                .then(result => {
                console.log(`Result from Python: ${result}`);
                return res.json(randomNumber);
            })
                .catch(error => {
                console.error("ERROR: " + error);
                return res.json(0);
            });
        }
        catch (error) {
            console.log('Error fetching last user ID: ' + error);
            return res.json(0);
        }
    });
}
exports.send_Password = send_Password;
function change_pass(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const rst = yield (0, XmlFunction_1.checkEmailExists)(email);
            if (!rst)
                return res.json(-1);
            const rst2 = yield (0, XmlFunction_1.changeUserByEmail)(email, password);
            return res.json(rst2);
        }
        catch (error) {
            console.log('Error fetching last user ID: ' + error);
            return res.json(0);
        }
    });
}
exports.change_pass = change_pass;
