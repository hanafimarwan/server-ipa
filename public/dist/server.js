"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoute_1 = __importDefault(require("./routers/userRoute"));
const emailRouter_1 = __importDefault(require("./routers/emailRouter"));
const passwordRouter_1 = __importDefault(require("./routers/passwordRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path")); // Use import for consistency in ES modules
dotenv_1.default.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 10010;
const app = (0, express_1.default)();
// Apply CORS options
app.use((0, cors_1.default)(corsOptions_1.default));
// Parse incoming JSON requests
app.use(express_1.default.json());
// Define routes with paths from environment variables or default values
app.post(process.env.TYPE_APP_SING_PATH || '/api/signup', userRoute_1.default);
app.post(process.env.TYPE_APP_LOG_PATH || '/api/login', userRoute_1.default); // Ensure this is correctly defined
app.post(process.env.TYPE_APP_EMAIL_PATH || '/api/email', emailRouter_1.default); // Changed from '/api.login' to '/api/email'
app.post('/api/password', passwordRouter_1.default);
app.post('/api/change.password', passwordRouter_1.default);
// Serve static file (index.html)
app.get('/*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
