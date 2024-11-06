"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.changeUserByEmail = exports.getAllUsers = exports.getUserByEmail = exports.addUser = exports.checkEmailExists = exports.getLastUserId = void 0;
const fs_1 = __importDefault(require("fs"));
const xml2js_1 = __importStar(require("xml2js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// Function to get the ID of the last user from the XML file
const getLastUserId = (filePath) => {
    return new Promise((resolve, reject) => {
        // Read the existing XML file
        fs_1.default.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error("Error reading the XML file:", err);
                return reject(err); // Reject the Promise if there's an error
            }
            // Parse the XML data
            (0, xml2js_1.parseString)(data, (err, result) => {
                if (err) {
                    console.error("Error parsing XML:", err);
                    return reject(err); // Reject the Promise if there's an error
                }
                // Access the users and get the last user
                const users = result.users.user; // Access the user array
                if (users && users.length > 0) {
                    const lastUser = users[users.length - 1]; // Get the last user
                    const lastUserId = lastUser.$.id; // Access the ID attribute
                    resolve(lastUserId); // Resolve the Promise with the last user ID
                }
                else {
                    console.log("No users found in the file.");
                    resolve(null); // Resolve with null if no users found
                }
            });
        });
    });
};
exports.getLastUserId = getLastUserId;
const checkEmailExists = (emailToFind) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read the XML file
        const xmlData = fs_1.default.readFileSync('./src/data/data.xml', 'utf8');
        // Parse XML into a JavaScript object
        const result = yield (0, xml2js_1.parseStringPromise)(xmlData);
        // Extract users
        const users = result.users.user;
        // Search for the email
        const emailExists = users.some((user) => user.email[0] === emailToFind);
        return emailExists;
    }
    catch (err) {
        console.error("Error reading or parsing the XML file:", err);
        return false;
    }
});
exports.checkEmailExists = checkEmailExists;
const addUser = (newUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Read existing XML data
        const xmlData = fs_1.default.readFileSync('./src/data/data.xml', 'utf8');
        // Step 2: Parse XML data into a JavaScript object
        const result = yield (0, xml2js_1.parseStringPromise)(xmlData);
        const date = new Date();
        // Step 3: Add new user to the existing users array
        const usersArray = result.users.user || []; // Get current users or an empty array if none
        usersArray.push({
            $: { id: newUser.id, type: 'user' }, // Adds the ID as an attribute of <user> and specifies type
            date: [{ $: { d: date } }], // Sets <date d="value"/>
            email: [{ _: newUser.email }], // Wraps email in an array and adds as element value
            password: [{ _: newUser.password }] // Wraps password in an array and adds as element value
        });
        // Step 4: Update the users array in the parsed object
        result.users.user = usersArray;
        // Step 5: Convert the updated object back to XML
        const builder = new xml2js_1.Builder();
        const updatedXmlData = builder.buildObject(result);
        // Step 6: Write the updated XML data back to the file
        fs_1.default.writeFileSync('./src/data/data.xml', updatedXmlData, 'utf8');
        console.log("New user added successfully!");
    }
    catch (err) {
        console.error("Error adding new user:", err);
    }
});
exports.addUser = addUser;
// Function to get a user by email from the XML file
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new xml2js_1.default.Parser();
    const xmlFilePath = './src/data/data.xml'; // Adjust the path to your XML file
    try {
        // Read the XML file
        const xmlData = yield fs_1.default.promises.readFile(xmlFilePath, 'utf8');
        // Parse the XML data
        const result = yield parser.parseStringPromise(xmlData);
        const users = result.users.user;
        // Find the user by email
        const user = users.find((u) => u.email[0] === email); // Accessing email as it's in an array
        return user ? user : null; // Return the user object or null if not found
    }
    catch (error) {
        console.error('Error reading XML file:', error);
        throw new Error('Unable to fetch user data');
    }
});
exports.getUserByEmail = getUserByEmail;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Read the XML file
        const data = yield fs_1.default.promises.readFile('./src/data/data.xml', 'utf8');
        // Parse the XML data
        const result = yield (0, xml2js_1.parseStringPromise)(data);
        // Check if `users` and `user` elements exist
        const users = ((_a = result === null || result === void 0 ? void 0 : result.users) === null || _a === void 0 ? void 0 : _a.user) || [];
        // Map the parsed users to the User type
        const userList = users.map((user) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: ((_a = user === null || user === void 0 ? void 0 : user.$) === null || _a === void 0 ? void 0 : _a.id) || '', // Access the ID attribute safely
                email: ((_b = user === null || user === void 0 ? void 0 : user.email) === null || _b === void 0 ? void 0 : _b[0]) || '', // Check if email exists and get first element
                password: ((_c = user === null || user === void 0 ? void 0 : user.passworld) === null || _c === void 0 ? void 0 : _c[0]) || '', // Check if password exists and get first element
                date: ((_f = (_e = (_d = user === null || user === void 0 ? void 0 : user.date) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.$) === null || _f === void 0 ? void 0 : _f.d) || '' // Access date safely, if available
            });
        });
        return userList; // Return the array of users
    }
    catch (error) {
        console.error("Error reading or parsing the XML file:", error);
        throw error; // Re-throw the error after logging
    }
});
exports.getAllUsers = getAllUsers;
// Function to change user by email
function changeUserByEmail(email, newPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the XML file
            const xmlData = yield fs_1.default.promises.readFile('./src/data/data.xml', 'utf-8');
            // Parse the XML data
            const result = yield (0, xml2js_1.parseStringPromise)(xmlData);
            const saltRounds = parseInt(process.env.TYPE_APP_SALTROUNDS || "10", 10);
            // Find the user by email
            let userFound = false;
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, saltRounds);
            result.users.user.forEach((user) => {
                if (user.email[0] === email) {
                    // Update the user's password
                    user.password[0] = hashedPassword; // Change the password
                    userFound = true;
                }
            });
            if (!userFound) {
                console.log('User not found.');
                return -1;
            }
            // Build the updated XML
            const builder = new xml2js_1.Builder();
            const updatedXml = builder.buildObject(result);
            // Write the updated XML back to the file
            yield fs_1.default.promises.writeFile('./src/data/data.xml', updatedXml);
            console.log('User updated successfully.');
            return 1;
        }
        catch (error) {
            console.error('Error updating user:', error);
            return 0;
        }
    });
}
exports.changeUserByEmail = changeUserByEmail;
// Example usage
// changeUserByEmail('hmarwanf130@gmail.com', 'new_password@123');
