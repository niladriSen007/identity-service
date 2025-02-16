import { StatusCodes } from "http-status-codes";
import { User } from "../../models/user/user-model";
import { TokenService } from "../../services/token/token-service";
import { CreateUserType, LoginUserType, RefreshTokenTypes } from "../../types";
import { GlobalErrorResponse } from "../../utils/global-error";
import { config } from "../../config";
import { RefreshToken } from "../../models/refreshToken/refreshToken-model";
const { logger } = config;

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

  public async login(data: LoginUserType) {
    const { email, password } = data;
    logger.info(`Attempting to login user with email: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      logger.error(`User not found with email: ${email}`);
      throw new GlobalErrorResponse("User not found", StatusCodes.NOT_FOUND);
    }
    const isMatch = await user?.comparePassword(password);
    if (!isMatch) {
      logger.error(`Invalid credentials for user with email: ${email}`);
      throw new GlobalErrorResponse("Invalid credentials", StatusCodes.UNAUTHORIZED);
    }
    const { accessToken, newToken } = await TokenService.generateToken({
      _id: user?._id,
      email: user.email
    })
    logger.info(`User logged in successfully with email: ${email}`);
    return {
      id: user?._id,
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken: newToken.token
    };
  }

  public async refreshTokenForUser(data: RefreshTokenTypes) {
    const { refreshToken, userId, email } = data;
    const user = await User.findOne({ _id: userId, email });
    if (!user) {
      logger.error(`User not found with email: ${email}`);
      throw new GlobalErrorResponse("User not found", StatusCodes.NOT_FOUND);
    }
    const userRefreshToken = await RefreshToken.findOne({
      user: userId,
      token: refreshToken
    });
    if (!userRefreshToken) {
      logger.error(`Refresh token not found for user with email: ${email}`);
      throw new GlobalErrorResponse("Refresh token not found", StatusCodes.NOT_FOUND);
    }
    if (userRefreshToken?.expiresAt < new Date()) {
      logger.error(`Refresh token expired for user with email: ${email}`);
      throw new GlobalErrorResponse("Refresh token expired", StatusCodes.UNAUTHORIZED);
    }
    const { accessToken, newToken } = await TokenService.generateToken({
      _id: user?._id,
      email: user.email
    })
    logger.info(`User refresh token has been refreshed successfully: ${email}`);
    return {
      id: user?._id,
      username: user.username,
      email: user.email,
      accessToken,
      refreshToken: newToken.token
    };
  }

  public async logoutUser(data: RefreshTokenTypes) {
    const { refreshToken, userId, email } = data;
    const user = await User.findOne({ _id: userId, email });
    if (!user) {
      logger.error(`User not found with email: ${email}`);
      throw new GlobalErrorResponse("User not found", StatusCodes.NOT_FOUND);
    }
    const userRefreshToken = await RefreshToken.findOne({
      user: userId,
      token: refreshToken
    });
    if (!userRefreshToken) {
      logger.error(`Refresh token not found for user with email: ${email}`);
      throw new GlobalErrorResponse("Refresh token not found", StatusCodes.NOT_FOUND);
    }
    await RefreshToken.deleteMany({ _id: userRefreshToken._id });
    logger.info(`User logged out successfully: ${email}`);
    return {
      id: user?._id,
      username: user.username,
      email: user.email
    };
  }
}
