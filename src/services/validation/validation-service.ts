import { CreateUserType } from "../../types";
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
}