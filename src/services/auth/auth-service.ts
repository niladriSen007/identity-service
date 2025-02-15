import { GlobalErrorResponse } from './../../utils/global-error';
import { AuthRepository } from "../../repositories/auth/auth-repository";
import { CreateUserType } from "../../types";
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

}