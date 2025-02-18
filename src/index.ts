import express, { NextFunction, Request, Response } from 'express';
import { config } from './config';
import { apiRouter } from './routes';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';
import Redis from 'ioredis';
import { RateLimiterRedis } from "rate-limiter-flexible"
import { StatusCodes } from 'http-status-codes';
import { rateLimit } from 'express-rate-limit';
import { errorResponse } from './utils/error-response';
import { RedisReply, RedisStore } from "rate-limit-redis"
import { errorHandler } from './middlewares';


const { config_env } = config;
const { PORT, MONGO_URI, REDIS_URI } = config_env;
const app = express();
const redisClient = new Redis(REDIS_URI);


mongoose.connect(MONGO_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


app.use(helmet());
app.use(cors({
  origin: '*'
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  config.logger.info(`Received ${req.method} request to ${req.url}`);
  config.logger.info(`Request body, ${req.body}`);
  next();
});


// Rate limiter and preventing DDoS attacks
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1
})

app.use((req: Request, res: Response, next: NextFunction) => {
  rateLimiter.consume(req?.ip as string)
    .then(() => {
      next()
    })
    .catch(() => {
      config.logger.error(`Too many requests from IP: ${req?.ip}`)
      errorResponse.message = "Too many requests"
      errorResponse.error.message = "Too many requests"
      errorResponse.error.status = StatusCodes.TOO_MANY_REQUESTS
      res.status(StatusCodes.TOO_MANY_REQUESTS).json(errorResponse)
    })
})

//Ip based rate limiter for sensitive routes
const sensitiveRoutesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    config.logger.error(`Too many requests from IP so rate limit exceeded from Express rate limiter: ${req?.ip}`)
    errorResponse.message = "Too many requests"
    errorResponse.error.message = "Too many requests"
    errorResponse.error.status = StatusCodes.TOO_MANY_REQUESTS
    res.status(StatusCodes.TOO_MANY_REQUESTS).json(errorResponse)
  },
  store: new RedisStore({
    sendCommand: async (...args: [command: string, ...args: string[]]): Promise<RedisReply> => {
      const result = await redisClient.call(...args);
      return result as RedisReply;
    },
    prefix: 'rate-limit:'
  }),
})

//apply the rate limiter to the sensitive routes
app.use("/api/v1/auth", sensitiveRoutesLimiter)
app.use(errorHandler)
app.use("/api", apiRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  config.logger.error(err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  config.logger.error(err);
  process.exit(1);
});


process.on('SIGINT', () => {
  config.logger.info('SIGINT signal received.');
  process.exit(0);
});