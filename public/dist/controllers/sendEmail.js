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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer_1.default.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.TYPE_APP_EMAIL_USER,
        pass: process.env.TYPE_APP_EMAIL_PASS
    }
});
const sendEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipient, subject, text } = req.body;
    const mailOptions = {
        from: 'Cienflix support<habafimarwan@gmail.com>', // Sender address
        to: recipient, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body 
    };
    try {
        yield transport.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
});
exports.sendEmail = sendEmail;
