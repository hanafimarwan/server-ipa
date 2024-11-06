"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const SingUP_1 = require("../controllers/SingUP");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
router.use(express_1.default.json());
router.post(process.env.TYPE_APP_SING_PATH || '/api.signup', SingUP_1.Register);
router.post(process.env.TYPE_APP_LOG_PATH || '/api.login', SingUP_1.auto);
exports.default = router;
