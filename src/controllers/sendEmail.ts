import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
// Looking to send emails in production? Check out our Email API/SMTP product!
var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.TYPE_APP_EMAIL_USER,
      pass: process.env.TYPE_APP_EMAIL_PASS
    }
  });


export const  sendEmail=async(req: Request, res: Response):Promise<void>=>{
    const { recipient, subject, text } = req.body;
    const mailOptions = {
        from: 'Cienflix support<habafimarwan@gmail.com>', // Sender address
        to: recipient, // List of recipients
        subject: subject, // Subject line
        text: text, // Plain text body 
    };

   try {
        await transport.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email.');
    }
}