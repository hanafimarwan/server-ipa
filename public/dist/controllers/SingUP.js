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
Object.defineProperty(exports, "__esModule", { value: true });
exports.auto = exports.Register = void 0;
const SingUP_1 = require("../model/SingUP");
const XmlFunction_1 = require("../model/XmlFunction");
function Register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            yield (0, SingUP_1.SingUp)(email, password, res);
        }
        catch (error) {
            console.log('Error fetching last user ID: ' + error);
        }
    });
}
exports.Register = Register;
function auto(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            // Check if provided credentials match admin credentials from environment variables
            if (email === process.env.TYPE_APP_EMAIL_NAME && password === process.env.TYPE_APP_PASSWORD_VALUE) {
                const users = yield (0, XmlFunction_1.getAllUsers)();
                if (!users || users.length === 0) {
                    console.log("No data found!");
                }
                else {
                    console.log("User data fetched successfully.");
                }
                return res.json(users);
            }
            // Call Login function for non-admin users
            yield (0, SingUP_1.Login)(email, password, res);
        }
        catch (error) {
            console.log('Error fetching user data:', error);
            res.status(500).send('Internal Server Error');
        }
    });
}
exports.auto = auto;
