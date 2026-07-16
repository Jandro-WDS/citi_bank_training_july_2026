import client from "./client";

export const createAccount = async (data: { userId: string; accountType: string }) => {
  const res = await client.post("/api/accounts", data);
  return res.data;
};

export const getAccount = async (id: string) => {
  const res = await client.get(`/api/accounts/${id}`);
  return res.data;
};

export const getAccountsByUserId = async (id: string) => {
  const res = await client.get(`/api/accounts/user/${id}`);
  return res.data;
};

export const deposit = async (id: string, amount: number) => {
  const res = await client.post(`/api/accounts/${id}/deposit`, { amount });
  return res.data;
};

export const withdraw = async (id: string, amount: number) => {
  const res = await client.post(`/api/accounts/${id}/withdraw`, { amount });
  return res.data;
};

export const getTransactions = async (id: string) => {
  const res = await client.get(`/api/accounts/${id}/transactions`);
  return res.data;
};

export const deleteAccount = async (id: string) => {
  const res = await client.delete(`/api/accounts/${id}`);
  return res.data;
};