import { fetchApi } from "./base-api";
import type { User } from "../types";

export interface UserDto {
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
}

export interface UserRequest {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
}

export const userApi = {
  getProfile: (): Promise<User> => fetchApi("/v1/users/profile"),

  getAllUsers: (): Promise<UserDto[]> => fetchApi("/v1/users"),

  createUser: (payload: UserRequest): Promise<UserDto> =>
    fetchApi("/v1/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateUser: (userId: number, payload: UserRequest): Promise<UserDto> =>
    fetchApi(`/v1/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteUser: (userId: number): Promise<void> =>
    fetchApi(`/v1/users/${userId}`, {
      method: "DELETE",
    }),
};
