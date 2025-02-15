import { Request } from "express"
import { Types } from "mongoose";
export interface CreateUserRequest extends Request {
  body:{
    username: string;
    email: string;
    password: string;
  }
}

export interface CreateUserType{
  username: string;
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