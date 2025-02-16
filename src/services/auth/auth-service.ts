
import { GlobalErrorResponse } from './../../utils/global-error';
import { AuthRepository } from "../../repositories/auth/auth-repository";
import { CreateUserType, LoginUserType, LogoutTypes, RefreshTokenTypes } from "../../types";
import { config } from "../../config";
import { StatusCodes } from 'http-status-codes';
import { ValidateRequests } from '../validation/validation-service';

const { logger } = config;
export class AuthService {
  constructor(private readonly repository: AuthRepository) { }

  public async register(data: CreateUserType) {
    try {
      logger.info(`Registering user with email in Service: ${data.email}`);
      const requestBodyValidation = await ValidateRequests?.validateCreateUserRequestBody(data);
      if (requestBodyValidation.error) {
        logger.error(`Error validating user request body with email in Service: ${data.email}`);
        throw new GlobalErrorResponse(requestBodyValidation.error.message, StatusCodes.BAD_REQUEST);
      }
      return await this.repository.register(data);
    } catch (error) {
      logger.error(`Error registering user with email in Service: ${data.email}`);
      throw new GlobalErrorResponse(error.message, StatusCodes.BAD_REQUEST);
    }
  }


  public async login(data: LoginUserType) {
    try {
      logger.info(`Logging in user with email in Service: ${data.email}`);
      const requestBodyValidation = await ValidateRequests?.validateLoginRequestBody(data);
      if (requestBodyValidation.error) {
        logger.error(`Error validating user request body with email in Service: ${data.email}`);
        throw new GlobalErrorResponse(requestBodyValidation.error.message, StatusCodes.BAD_REQUEST);
      }
      return await this.repository.login(data);
    } catch (error) {
      logger.error(`Error logging in user with email in Service: ${data.email}`);
      throw new GlobalErrorResponse(error.message, StatusCodes.BAD_REQUEST);
    }
  }

  public async refreshToken(data: RefreshTokenTypes) {
    try {
      logger.info(`Refreshing token with refreshToken in Service`);
      const requestBodyValidation = await ValidateRequests?.validateRefreshTokenRequestBody(data);
      if (requestBodyValidation.error) {
        logger.error(`Error validating refresh token request body in Service: ${data.email}`);
        throw new GlobalErrorResponse(requestBodyValidation.error.message, StatusCodes.BAD_REQUEST);
      }
      return await this.repository.refreshTokenForUser(data);
    } catch (error) {
      logger.error(`Error refreshing token with refreshToken in Service`);
      throw new GlobalErrorResponse(error.message, StatusCodes.BAD_REQUEST);
    }
  }

  public async logoutUser(data: LogoutTypes) {
    try {
      logger.info(`Logging out user with email in Service: ${data.email}`);
      const requestBodyValidation = await ValidateRequests?.validateLogoutRequestBody(data);
      if (requestBodyValidation.error) {
        logger.error(`Error validating logout request body in Service: ${data.email}`);
        throw new GlobalErrorResponse(requestBodyValidation.error.message, StatusCodes.BAD_REQUEST);
      }
      return await this.repository.logoutUser(data);
    } catch (error) {
      logger.error(`Error logging out user with email in Service: ${data.email}`);
      throw new GlobalErrorResponse(error.message, StatusCodes.BAD_REQUEST);
    }
  }

}