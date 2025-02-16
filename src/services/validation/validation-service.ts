import { CreateUserType, LoginUserType, LogoutTypes, RefreshTokenTypes } from "../../types";
import Joi from 'joi';
export class ValidateRequests {
  public static async validateCreateUserRequestBody(data: CreateUserType) {
    const schema = Joi.object({
      username: Joi.string().min(1).max(20).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(1).required()
    });
    return schema.validate(data);
  }
  public static async validateLoginRequestBody(data: LoginUserType) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(1).required()
    });
    return schema.validate(data);
  }

  public static async validateRefreshTokenRequestBody(data: RefreshTokenTypes) {
    const schema = Joi.object({
      refreshToken: Joi.string().required(),
      userId: Joi.string().required(),
      email: Joi.string().email().required()
    });
    return schema.validate(data);
  }

  public static async validateLogoutRequestBody(data: LogoutTypes) {
    const schema = Joi.object({
      refreshToken: Joi.string().required(),
      userId: Joi.string().required(),
      email: Joi.string().email().required()
    });
    return schema.validate(data);
  }
}