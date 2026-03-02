import { fetchApi } from "./base-api";
import type { User } from "../types";

export const userApi = {
  getProfile: (): Promise<User> => fetchApi("/v1/user/profile"),
};