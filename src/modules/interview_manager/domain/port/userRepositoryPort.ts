import { User } from "../model/user";

export interface UserRepositoryPort {
  updateUserRole: (email: string, newRole: string) => Promise<User>;
}