import express, { Request, Response } from 'express';
const router = express.Router();
import { Register,auto } from '../controllers/SingUP';
import dotenv from 'dotenv';
dotenv.config();
router.use(express.json());
router.post(process.env.TYPE_APP_SING_PATH || '/api.signup',Register);
router.post(process.env.TYPE_APP_LOG_PATH|| '/api.login',auto);

export default router;