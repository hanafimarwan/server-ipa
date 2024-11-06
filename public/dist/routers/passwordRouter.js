"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const sendPassword_1 = require("../controllers/sendPassword");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
router.use(express_1.default.json());
router.post('/api.password', sendPassword_1.send_Password);
router.post('/api.change.password', sendPassword_1.change_pass);
exports.default = router;
