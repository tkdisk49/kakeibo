import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url === "/api/user";
    if (
      error.response?.status === 401 &&
      !isAuthCheck &&
      typeof window !== "undefined" &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export async function ensureCsrfCookie() {
  await apiClient.get("/sanctum/csrf-cookie");
}
