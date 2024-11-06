"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const sendEmail_1 = require("../controllers/sendEmail");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
router.use(express_1.default.json());
router.post(process.env.TYPE_APP_EMAIL_PATH || '/api.email', sendEmail_1.sendEmail);
exports.default = router;
