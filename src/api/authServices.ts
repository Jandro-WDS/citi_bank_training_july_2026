import client from "./client";

export const login = async (data: { email: string; password: string }) => {
  const res = await client.post("/api/auth/login", data);
  return res.data;
};

export const signup = async (data: { name: string; email: string; password: string }) => {
  const res = await client.post("/api/auth/signup", data);
  return res.data;
};