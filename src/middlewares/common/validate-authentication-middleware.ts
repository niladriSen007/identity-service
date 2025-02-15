import { config } from './../../config';
import { errorResponse } from './../../utils/error-response';
import { JWTPayload, RequestWithUser } from '../../types';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
const { config_env } = config
const { JWT_SECRET_KEY } = config_env

export const validateAuthentication = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      errorResponse.message = 'Access token required';
      errorResponse.error.message = 'Access token required';
      errorResponse.error.status = StatusCodes.UNAUTHORIZED;
      return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JWTPayload;
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      errorResponse.message = 'Access token expired';
      errorResponse.error.message = 'Access token expired';
      errorResponse.error.status = StatusCodes.UNAUTHORIZED;
      return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
    }
    return res.status(StatusCodes.FORBIDDEN).json(errorResponse);
  }
};
