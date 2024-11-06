import express from 'express';
import userRoute from './routers/userRoute';
import emailRouter from './routers/emailRouter';
import passwordRouter from './routers/passwordRouter';
import dotenv from 'dotenv';
import corsOptions from './config/corsOptions';
import cors from 'cors';
import path from 'path'; // Use import for consistency in ES modules

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT || 10010;
const app = express();

// Apply CORS options
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Define routes with paths from environment variables or default values
app.post(process.env.TYPE_APP_SING_PATH || '/api/signup', userRoute);
app.post(process.env.TYPE_APP_LOG_PATH || '/api/login', userRoute); // Ensure this is correctly defined
app.post(process.env.TYPE_APP_EMAIL_PATH || '/api/email', emailRouter); // Changed from '/api.login' to '/api/email'
app.post('/api/password', passwordRouter);
app.post('/api/change.password', passwordRouter);

// Serve static file (index.html)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
