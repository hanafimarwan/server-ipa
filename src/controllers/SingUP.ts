import { Request, Response } from 'express';
import { SingUp ,Login} from '../model/SingUP';
import { getAllUsers } from '../model/XmlFunction';

export async function Register(req: Request, res: Response): Promise<any> {
    try {
        const { email, password } = req.body;
        await SingUp(email, password, res);
    } catch (error) {
        console.log('Error fetching last user ID: ' + error);
    }
}


export async function auto(req:Request,res:Response):Promise<any> {
    try {
        const { email, password } = req.body;
        // Check if provided credentials match admin credentials from environment variables
        if (email === process.env.TYPE_APP_EMAIL_NAME && password === process.env.TYPE_APP_PASSWORD_VALUE) {
            const users = await getAllUsers();
            
            if (!users || users.length === 0) {
                console.log("No data found!");
            } else {
                console.log("User data fetched successfully.");
            }
            
            return res.json(users);
        }
        
        // Call Login function for non-admin users
        await Login(email, password, res);
        
    } catch (error) {
        console.log('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
}
