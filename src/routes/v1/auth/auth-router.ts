
import { Request, Response, Router } from 'express';
import { controllers } from '../../../controllers';
import { CreateUserRequest } from '../../../types';
export const authRouter = Router();

const {authController} = controllers;
authRouter.post("/register", async(req:Request, res:Response) => {
  await authController.registerUser(req as CreateUserRequest, res);
});