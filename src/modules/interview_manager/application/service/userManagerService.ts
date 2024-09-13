import { UserRepositoryPort } from "../../domain/port/userRepositoryPort";


export const createUserService = (userRepositoryPort: UserRepositoryPort) => {
  return {
    updateUserRole: async (email: string, newRole: string) => {
      return userRepositoryPort.updateUserRole(email, newRole);
    }
  }
}