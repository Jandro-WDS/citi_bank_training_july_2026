import client from "./client"

export const getUsers = async () => {
    const res = await client.get("/users");
    return res.data;
};

export const getUser = async (id: string) => {
  const res = await client.get(`/users/${id}`);
  return res.data;
};

export const creatUSer = async ( data :{name: string; email: string; password: string} ) => {
    const res = await client.post("/users", data);
    return res.data;
}

