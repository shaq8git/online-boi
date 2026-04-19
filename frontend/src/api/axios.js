import axios from "axios";


const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");
  const url = config.url || "";

  console.log("📤 REQUEST:");
  console.log("URL:", config.url);
  console.log("Method:", config.method);
  console.log("Headers:", config.headers);
  console.log("Data:", config.data);


  const publicAuthRoutes = [
    "/auth/login",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/verify-email",
  ];

  if (token && !publicAuthRoutes.some((route) => url.startsWith(route))) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;