import { AuthService } from "./auth/auth-service";
import { repositories } from "../repositories";

const {authRepository} = repositories
export const services = {
  authService: new AuthService(authRepository)
}