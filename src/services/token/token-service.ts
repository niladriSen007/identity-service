import crypto from 'crypto';
import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { config } from '../../config';
import { models } from '../../models';
import { GlobalErrorResponse } from '../../utils/global-error';
import { StatusCodes } from 'http-status-codes';
const { User, RefreshToken } = models;
const { logger, config_env } = config;
const { JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY, JWT_ACCESS_TOKEN_EXPIRATION, JWT_REFRESH_TOKEN_EXPIRATION } = config_env;

export class TokenService {
  public static async generateToken(user: {
    _id: Types.ObjectId;
    email: string;
  }) {

    const getJWTExpirationTime = (): number => {
      const expiration = JWT_ACCESS_TOKEN_EXPIRATION;
      if (expiration && typeof expiration === 'number') {
        return expiration;
      }
      return 15 * 60; // default expiration
    };

    try {
      if (!JWT_SECRET_KEY) {
        throw new Error('JWT_SECRET_KEY is not defined');
      }

      const jwtOptions: SignOptions = {
        expiresIn: getJWTExpirationTime()
      }

      const accessToken = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email
        },
        Buffer.from(JWT_SECRET_KEY || ''),
        jwtOptions
      );

      const refreshToken = crypto.randomBytes(32).toString('hex');
      const refreshTokenExpiration = new Date();
      refreshTokenExpiration.setDate(refreshTokenExpiration.getDate() + 30 * 24 * 60 * 60);
      //removing pre existing refresh tokens
      const previousRefreshToken = await RefreshToken.findOne({ user: user._id });
      if (previousRefreshToken) {
        await RefreshToken.deleteMany({ user: user._id });
      }
      const newRefreshToken = new RefreshToken({
        user: user._id,
        token: refreshToken,
        expiresAt: refreshTokenExpiration
      })
      const newToken = await newRefreshToken.save();
      logger.info('Access token and refresh token generated successfully');

      return { accessToken, newToken };
    } catch (error) {
      logger.error('Error generating access token and refresh token');
      throw new GlobalErrorResponse(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}