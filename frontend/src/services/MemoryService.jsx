import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/memories';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createMemory = async (memoryData) => {
  try {
    const response = await axiosInstance.post('/post', memoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating memory:', error);
    throw error;
  }
};

export const getAllMemories = async () => {
  try {
    const response = await axiosInstance.get('/get');
    return response.data;
  } catch (error) {
    console.error('Error fetching all memories:', error);
    throw error;
  }
};

export const getMemoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/get/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching memory with ID ${id}:`, error);
    throw error;
  }
};

export const updateMemoryById = async (id, updatedMemory) => {
  try {
    const response = await axiosInstance.put(`/update/${id}`, updatedMemory);
    return response.data;
  } catch (error) {
    console.error(`Error updating memory with ID ${id}:`, error);
    throw error;
  }
};

export const deleteMemoryById = async (id) => {
  try {
    const response = await axiosInstance.delete(`/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting memory with ID ${id}:`, error);
    throw error;
  }
};
