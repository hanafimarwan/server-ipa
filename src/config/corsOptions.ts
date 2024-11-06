import { allowedOrigins } from './allowedOrigins';

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow: boolean) => void) => {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      // Allow the request if the origin is in the allowedOrigins array
      callback(null, true);
    } else {
      // Reject the request if the origin is not in allowedOrigins
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  optionsSuccessStatus: 200, // For legacy browser support (e.g., IE11)
};

export default corsOptions;
