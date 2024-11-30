// UserService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/user'; // Update with your API URL

const handleError = (error) => {
    console.error("API error:", error.response || error.message);
    throw error.response?.data?.message || "An error occurred.";
};

const UserService = {
    registerUser(user) {
        console.log("Sending data to backend:", user);
        return axios.post(`${API_URL}/register`, user)
            .then((response) => response.data)
            .catch(handleError);
    },

    loginUser(user) {
        console.log("Attempting login with data:", user);
        return axios.post(`${API_URL}/login`, user)
            .then((response) => {
                const { token } = response.data;
                if (token) {
                    localStorage.setItem("token", token);
                    console.log("Token:", token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                return response.data;
            })
            .catch(handleError);
    },

    updateProfile(email, user) {
        // Filter out the password if it's empty
        const filteredUser = { ...user };
        if (!filteredUser.password || filteredUser.password.trim() === "") {
            delete filteredUser.password;
        }
    
        console.log("Sending data to backend for update:", { email, ...filteredUser });
    
        // Send the filtered data
        return axios
            .put(`${API_URL}/profile`, { email, ...filteredUser })
            .then((response) => response.data)
            .catch(handleError);
    },
    
    updateUserById(id, userData) { 
        console.log(`Updating user with ID: ${id} and data:`, userData); // Debugging log
        return axios.put(`${API_URL}/update/${id}`, userData) // Send userData in the PUT request
            .then((response) => {
                console.log("Response from backend:", response.data);
                return response.data;
            })
            .catch(handleError);
    },

    getAllUsers: async () => {
        return axios.get(`${API_URL}/all`).then((response) => response.data).catch(handleError);
    },

    deleteUser: async (id) => {
        return axios.delete(`${API_URL}/delete/${id}`).then((response) => response.data).catch(handleError);
    },

    createUser: async (user) => {
        console.log("Creating new user:", user);
        return axios.post(`${API_URL}/post`, user)
            .then((response) => response.data)
            .catch(handleError);
    }
};

export default UserService;
