import axios from "axios";

const client = axios.create({
    baseURL: "http://127.0.0.1:5000",
    headers: {
        "Content-type": "application/json"
    },
});

// token is stored outside React so the interceptor can read it
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default client;;