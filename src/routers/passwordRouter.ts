import express, { Request, Response } from 'express';
const router = express.Router();
import { send_Password ,change_pass} from '../controllers/sendPassword';
import dotenv from 'dotenv';


dotenv.config();
router.use(express.json());
router.post('/api.password',send_Password);
router.post('/api.change.password',change_pass);
export default router;