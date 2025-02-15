import { StatusCodes } from "http-status-codes";
import { User } from "../../models/user/user-model";
import { TokenService } from "../../services/token/token-service";
import { CreateUserType } from "../../types";
import { GlobalErrorResponse } from "../../utils/global-error";

export class AuthRepository {

  public async register(data: CreateUserType) {
    const { username, email, password } = data;
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });
    if (existingUser) {
      throw new GlobalErrorResponse("User already exists", StatusCodes.CONFLICT);
    }
    const user = new User({
      username,
      email,
      password
    });
    const savedUser = await user.save();
    const { accessToken } = await TokenService.generateToken({
      _id: savedUser?._id,
      email: savedUser.email
    })
    return {
      id: savedUser?._id,
      username: savedUser.username,
      email: savedUser.email,
      accessToken,
    };

  }

}