import express from 'express';
const router = express.Router();
import { sendEmail } from '../controllers/sendEmail';
import dotenv from 'dotenv';
dotenv.config();
router.use(express.json());
router.post(process.env.TYPE_APP_EMAIL_PATH || '/api.email',sendEmail);

export default router;