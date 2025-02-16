import { Request } from "express"
import { Types } from "mongoose";
export interface CreateUserRequest extends Request {
  body:{
    username: string;
    email: string;
    password: string;
  }
}
export interface LoginUserRequest extends Request {
  body:{
    email: string;
    password: string;
  }
}

export interface CreateUserType{
  username: string;
  email: string;
  password: string;
}
export interface LoginUserType{
  email: string;
  password: string;
}


export interface User {
  _id: Types.ObjectId;
  // other user properties
}

export interface TokenPayload {
  userId: string;
}

export interface JWTPayload {
  userId: string;
  userEmail: string;
}

export interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}


export interface RefreshTokenRequest extends Request {
  body:{
    refreshToken: string;
    userId: string;
    email: string;
  }
}

export interface RefreshTokenTypes{
  refreshToken: string;
  userId: string;
  email: string;
}
export interface LogoutRequest extends Request {
  body:{
    refreshToken: string;
    userId: string;
    email: string;
  }
}

export interface LogoutTypes{
  refreshToken: string;
  userId: string;
  email: string;
}