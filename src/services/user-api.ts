import { fetchApi } from "./base-api";
import type { User } from "../types";

export interface UserDto {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role?: string;
}

export const userApi = {
  getProfile: (): Promise<User> => fetchApi("/v1/user/profile"),
  
    getAllUsers: (): Promise<UserDto[]> => fetchApi("/v1/users"),
};