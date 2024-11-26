import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/privacySettings';

class PrivacySettingsService {
    // Instance creation with custom configuration
    constructor(customConfig = {}) {
        this.axiosInstance = axios.create({
            baseURL: customConfig.baseURL || API_BASE_URL,
            timeout: customConfig.timeout || 5000,
            headers: {
                'Content-Type': 'application/json',
                ...customConfig.headers
            }
        });

        // Add request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // You can add custom logic here (e.g., adding auth tokens)
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // Handle common errors here
                if (error.response) {
                    console.error('Response error:', error.response.data);
                } else if (error.request) {
                    console.error('Request error:', error.request);
                } else {
                    console.error('Error:', error.message);
                }
                return Promise.reject(error);
            }
        );
    }

    // Create new privacy settings
    async createPrivacySettings(privacySettings) {
        try {
            const response = await this.axiosInstance.post('/post', privacySettings);
            return response.data; // Returns the privacyId
        } catch (error) {
            throw this.handleError('Error creating privacy settings', error);
        }
    }

    // Get all privacy settings
    async getAllPrivacySettings() {
        try {
            const response = await this.axiosInstance.get('/get');
            return response.data;
        } catch (error) {
            throw this.handleError('Error fetching all privacy settings', error);
        }
    }

    // Get privacy settings by ID
    async getPrivacySettingsById(id) {
        try {
            const response = await this.axiosInstance.get(`/get/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(`Error fetching privacy settings with ID ${id}`, error);
        }
    }

    // Delete privacy settings
    async deletePrivacySettings(id) {
        try {
            const response = await this.axiosInstance.delete(`/delete/${id}`);
            return response.data;
        } catch (error) {
            throw this.handleError(`Error deleting privacy settings with ID ${id}`, error);
        }
    }

    // Error handler helper method
    handleError(message, error) {
        const errorMessage = error.response?.data?.message || error.message;
        const enhancedError = new Error(`${message}: ${errorMessage}`);
        enhancedError.originalError = error;
        enhancedError.response = error.response;
        return enhancedError;
    }
}

// Example usage and helper functions
export const createDefaultPrivacySettings = () => ({
    dataSharingConsent: false,
    emailNotificationConsent: false,
    profileVisibility: false
});

// Create a default instance
const defaultPrivacySettingsService = new PrivacySettingsService();

export default defaultPrivacySettingsService;

// Named export for creating custom instances
export const createPrivacySettingsService = (config) => new PrivacySettingsService(config);