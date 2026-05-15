import axios, { AxiosError } from "axios";

import { useAuthStore } from "@/store/auth.store";
import { ApiClientError, type ApiError, type ApiSuccess } from "@/types/api";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1",
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers["ngrok-skip-browser-warning"] = "true";

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const statusCode = error.response?.status;
    const message = error.response?.data?.message ?? error.message ?? "Request failed";

    if (statusCode === 401 && typeof window !== "undefined") {
      useAuthStore.getState().clearSession();
      window.location.assign("/login");
    }

    return Promise.reject(new ApiClientError(message, statusCode));
  },
);

export async function unwrap<T>(request: Promise<{ data: ApiSuccess<T> }>): Promise<T> {
  const response = await request;
  return response.data.data;
}
