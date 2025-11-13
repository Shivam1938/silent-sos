import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error-handler.js';
import { requestLogger } from './middlewares/request-logger.js';
import healthRouter from './routes/health.js';
import sosRouter from './routes/sos.js';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';

const app = express();

// CORS configuration - flexible for development and production
const corsOptions = {
  origin: process.env.CLIENT_BASE_URL === '*' 
    ? '*' 
    : (process.env.CLIENT_BASE_URL?.split(',') || '*'),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(requestLogger);

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/sos', sosRouter);

app.use(errorHandler);

export default app;

