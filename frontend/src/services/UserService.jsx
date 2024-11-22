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
        console.log("Sending data to backend for update:", { email, ...user });
        return axios.put(`${API_URL}/profile`, { email, ...user })
            .then((response) => response.data)
            .catch(handleError);
    },

    updateUserById(id) {
        console.log(`Updating user with ID: ${id}`); // Debugging log
        return axios.put(`${API_URL}/update/${id}`)
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
