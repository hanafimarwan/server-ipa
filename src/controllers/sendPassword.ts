import { send_Email } from '../model/sendPasswordEmail';

import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { checkEmailExists,changeUserByEmail } from '../model/XmlFunction';
import dotenv from 'dotenv';
dotenv.config();

function getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export async function send_Password(req: Request, res: Response): Promise<any> {
    try {
        const { email } = req.body;

        // Check if the email exists
        const emailExists: boolean = await checkEmailExists(email);
        if (!emailExists) return res.json(-1);

        // Generate a random number between 10000 and 99999
        const randomNumber = getRandomNumberInRange(10000, 99999);
        
        // Get email credentials from environment variables
        const from: string = process.env.TYPE_APP_PY_EMAIL_USER || '';
        const password: string = process.env.TYPE_APP_PY_EMAIL_PASS || '';
        const to: string = email;
        const subject: string = 'Password Change Notification';
        const tempHtmlPath = path.join(__dirname, 'tempEmail.html');
        const body: string = `
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
        fs.writeFileSync(tempHtmlPath, body); // Write the HTML content to the file

        // Send the email using the temporary HTML file
        send_Email(from, password, to, subject, tempHtmlPath)
            .then(result => {
                console.log(`Result from Python: ${result}`);
                return res.json(randomNumber);
            })
            .catch(error => {
                console.error("ERROR: " + error);
                return res.json(0);
            });

    } catch (error) {
        console.log('Error fetching last user ID: ' + error);
        return res.json(0);
    }
}


export async function change_pass(req:Request,res:Response) :Promise<any> {
    try{
        const {email,password} = req.body;
        const rst:boolean=await checkEmailExists(email);
        if(!rst) return res.json(-1);
        const rst2:number=await changeUserByEmail(email,password);
        return res.json(rst2);
    }catch (error) {
        console.log('Error fetching last user ID: ' + error);
        return res.json(0);
    }
}