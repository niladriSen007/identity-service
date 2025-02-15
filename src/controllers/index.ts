import { services } from "../services";
import { AuthController } from "./auth/auth-controller";

const { authService } = services;

export const controllers = {
  authController: new AuthController(authService)
}