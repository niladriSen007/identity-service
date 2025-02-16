
import { Request, Response, Router } from 'express';
import { controllers } from '../../../controllers';
import { CreateUserRequest, LoginUserRequest, RefreshTokenRequest } from '../../../types';
export const authRouter = Router();

const { authController } = controllers;
authRouter.post("/register", async (req: Request, res: Response) => {
  await authController.registerUser(req as CreateUserRequest, res);
});

authRouter.post("/login", async (req: Request, res: Response) => {
  await authController.loginUser(req as LoginUserRequest, res);
});

authRouter.post("/refresh-token", async (req: Request, res: Response) => {
  await authController.refreshToken(req as RefreshTokenRequest, res);
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  await authController.logoutUser(req as RefreshTokenRequest, res);
});