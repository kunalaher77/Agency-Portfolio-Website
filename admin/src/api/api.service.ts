import { api } from "./axios";

// GET ALL
export const getAll = async (url: string) => {
  const response = await api.get(url);
  console.log(response,"esosd");
  return response.data;
};

// GET ONE
export const getOne = async (url: string, id: number | string) => {
  const response = await api.get(`${url}/${id}`);
  return response.data;
};

// CREATE
export const createData = async (url: string, data: any) => {
  const response = await api.post(url, data);
  return response.data;
};

// UPDATE
export const updateData = async (
  url: string,
  id: number | string,
  data: any
) => {
  const response = await api.patch(`${url}/${id}`, data);
  return response.data;
};

// DELETE
export const deleteData = async (
  url: string,
  id: number | string
) => {
  const response = await api.delete(`${url}/${id}`);
  return response.data;
};