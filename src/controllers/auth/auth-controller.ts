import { successResponse } from './../../utils/success-response';
import { StatusCodes } from 'http-status-codes';
import { Response } from "express";
import { AuthService } from "../../services/auth/auth-service";
import { CreateUserRequest, LoginUserRequest, LogoutRequest, RefreshTokenRequest } from "../../types";
import { config } from "../../config"
import { errorResponse } from '../../utils/error-response';

const { logger } = config


export class AuthController {
  constructor(private readonly authService: AuthService) { }

  public async registerUser(req: CreateUserRequest, res: Response) {
    try {
      logger.info(`Registering user with email: ${req.body.email}`);
      const user = await this.authService.register(req.body);
      logger.info(`User registered with email: ${req.body.email}`);
      successResponse.data = user;
      successResponse.message = "User registered successfully";
      successResponse.status = StatusCodes.CREATED;
      successResponse.success = true;
      return res.status(StatusCodes.CREATED).json(successResponse);
    } catch (error) {
      logger.error(`Error registering user with email: ${req.body.email}`);
      errorResponse.message = error.message;
      errorResponse.status = error?.statusCode || StatusCodes.BAD_REQUEST;
      errorResponse.success = false;
      errorResponse.error.message = error.message;
      errorResponse.error.stack = error.stack;
      errorResponse.error.status = StatusCodes.BAD_REQUEST;
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }
  }

  public async loginUser(req: LoginUserRequest, res: Response) {
    try {
      logger.info(`Logging in user with email: ${req.body.email}`);
      const user = await this.authService.login(req.body);
      logger.info(`User logged in with email: ${req.body.email}`);
      successResponse.data = user;
      successResponse.message = "User logged in successfully";
      successResponse.status = StatusCodes.OK;
      successResponse.success = true;
      return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
      logger.error(`Error logging in user with email: ${req.body.email}`);
      errorResponse.message = error.message;
      errorResponse.status = error?.statusCode || StatusCodes.BAD_REQUEST;
      errorResponse.success = false;
      errorResponse.error.message = error.message;
      errorResponse.error.stack = error.stack;
      errorResponse.error.status = StatusCodes.BAD_REQUEST;
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }
  }

  public async refreshToken(req: RefreshTokenRequest, res: Response) {
    try {
      logger.info(`Refreshing token for user with email: ${req.body.email}`);
      const user = await this.authService.refreshToken(req?.body);
      logger.info(`Token refreshed for user with email: ${req?.body?.email}`);
      successResponse.data = user;
      successResponse.message = "Token refreshed successfully";
      successResponse.status = StatusCodes.OK;
      successResponse.success = true;
      return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
      logger.error(`Error refreshing token for user with email: ${req.body.email}`);
      errorResponse.message = error.message;
      errorResponse.status = error?.statusCode || StatusCodes.BAD_REQUEST;
      errorResponse.success = false;
      errorResponse.error.message = error.message;
      errorResponse.error.stack = error.stack;
      errorResponse.error.status = StatusCodes.BAD_REQUEST;
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }
  }

  public async logoutUser(req: LogoutRequest, res: Response) {
    try {
      logger.info(`Logging out user with email: ${req.body.email}`);
      const user = await this.authService.logoutUser(req?.body);
      logger.info(`User logged out with email: ${req?.body?.email}`);
      successResponse.data = user;
      successResponse.message = "User logged out successfully";
      successResponse.status = StatusCodes.OK;
      successResponse.success = true;
      return res.status(StatusCodes.OK).json(successResponse);
    } catch (error) {
      logger.error(`Error logging out user with email: ${req.body.email}`);
      errorResponse.message = error.message;
      errorResponse.status = error?.statusCode || StatusCodes.BAD_REQUEST;
      errorResponse.success = false;
      errorResponse.error.message = error.message;
      errorResponse.error.stack = error.stack;
      errorResponse.error.status = StatusCodes.BAD_REQUEST;
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }
  }
}