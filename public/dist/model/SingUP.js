"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = exports.SingUp = void 0;
const XmlFunction_1 = require("./XmlFunction");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const saltRounds = parseInt(process.env.TYPE_APP_SALTROUNDS || "10", 10);
function SingUp(email, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield (0, XmlFunction_1.checkEmailExists)(email))
            return res.json({ message: "this email is exist!" });
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const lastUserId = (yield (0, XmlFunction_1.getLastUserId)('./src/data/data.xml')) || '1'; // Await the Promise
        const newUser = {
            id: String(Number(lastUserId) + 1),
            email: email,
            password: hashedPassword
        };
        (0, XmlFunction_1.addUser)(newUser);
        return res.json({ message: "New user added successfully!" });
    });
}
exports.SingUp = SingUp;
function Login(email, password, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, XmlFunction_1.getUserByEmail)(email);
        if (user === null)
            return res.json(null);
        const test = yield bcrypt_1.default.compare(password, user.password[0]);
        const userFixe = {
            id: '0',
            email: user.email[0],
            password: user.password[0],
        };
        if (test)
            return res.json(userFixe);
        return res.json(null);
    });
}
exports.Login = Login;
