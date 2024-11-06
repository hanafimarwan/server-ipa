import { getLastUserId,addUser,checkEmailExists,getUserByEmail,User } from "./XmlFunction";
import bcrypt from 'bcrypt';
import {  Response } from 'express';
import dotenv from 'dotenv';
dotenv.config()

const saltRounds: number = parseInt(process.env.TYPE_APP_SALTROUNDS || "10", 10);

export async function SingUp(email:string,password:string, res: Response):Promise<any>{
    if(await checkEmailExists(email)) return res.json({ message: "this email is exist!"});
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const lastUserId = await getLastUserId('./src/data/data.xml')||'1'; // Await the Promise
    const newUser = {
        id: String(Number(lastUserId)+1),
        email: email,
        password: hashedPassword
    };
    addUser(newUser);
    return res.json({ message: "New user added successfully!"});
}
export async function Login(email:string,password:string, res: Response):Promise<any>{
    const user:User=await getUserByEmail(email);
    if(user===null) return res.json(null);
    const test:boolean=await bcrypt.compare(password,user.password[0]);
    const userFixe:User={
        id:'0',
        email:user.email[0],
        password:user.password[0],
    }
    if(test) return res.json(userFixe);
    return res.json(null);
}