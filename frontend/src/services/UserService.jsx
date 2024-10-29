import axios from 'axios';

const API_URL = 'http://localhost:8080/user'; // Update with your API URL

const UserService = {
    registerUser(user) {
        console.log("Sending data to backend:", user); // Check if this logs
        return axios.post(`${API_URL}/register`, user)
            .then((response) => response.data)
            .catch((error) => {
                console.error("Registration API error:", error);
                throw error;
            });
    },
    

    loginUser(user) {
        console.log("Attempting login with data:", user); // Log user data
        return axios.post(`${API_URL}/login`, user)
            .then((response) => {
                console.log("Login response:", response.data); // Log server response
                return response.data;
            })
            .catch((error) => {
                console.error("Login API error:", error);
                throw error;
            });
    },
    
    getUserById: async (id) => {
        const response = await axios.get(`${API_URL}/get/${id}`);
        return response.data; // Adjust if necessary
    },
    updateUser: async (id, user) => {
        const response = await axios.put(`${API_URL}/update/${id}`, user);
        return response.data; // Adjust if necessary
    },
    createUser: async (user) => {
        const response = await axios.post(`${API_URL}/post`, user);
        return response.data; // Adjust if necessary
    }
};

export default UserService;
