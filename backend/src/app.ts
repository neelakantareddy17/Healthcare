import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env, isProduction } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Healthcare API is up and running' });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
