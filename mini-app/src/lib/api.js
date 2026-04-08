import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3001/api" });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("sah_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login", data),
  me:       ()     => api.get("/auth/me"),
};

export const servicesAPI = {
  list: ()          => api.get("/services"),
  use:  (serviceId) => api.post(`/services/${serviceId}/use`),
};

export default api;
