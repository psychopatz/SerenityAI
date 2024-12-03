import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

class PhotoUploadService {
  constructor(baseURL = BASE_URL) {
    this.api = axios.create({
      baseURL,
    });
  }

  async uploadPhoto(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }

  async getPhoto(id) {
    try {
      const response = await this.api.get(`/photo/${id}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }

  async getPhotoMetadata(id) {
    try {
      const response = await this.api.get(`/photo/${id}/metadata`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }

  async getAllPhotoMetadata() {
    try {
      const response = await this.api.get('/photos/metadata');
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }

  async deletePhoto(id) {
    try {
      const response = await this.api.delete(`/photo/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  }
}

const photoUploadService = new PhotoUploadService();
export default photoUploadService;
