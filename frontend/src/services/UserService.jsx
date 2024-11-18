import axios from 'axios';

const API_URL = 'http://localhost:8080/user'; // Update with your API URL


const handleError = (error) => {
    console.error("API error:", error.response || error.message);
    throw error.response?.data?.message || "An error occurred.";
};

const UserService = {
    registerUser(user) {
        console.log("Sending data to backend:", user); // Check if this logs
        return axios.post(`${API_URL}/register`, user)
            .then((response) => response.data)
            .catch(handleError);
    },
    

    loginUser(user) {
        console.log("Attempting login with data:", user); // Log user data
        return axios.post(`${API_URL}/login`, user)
            .then((response) => {
                const { token } = response.data;
                if (token) {
                    localStorage.setItem("token", token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                }
                return response.data;
            })
            .catch(handleError);
    },

    logoutUser() {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
    },

    getProfile(email) {
        return axios.get(`${API_URL}/profile`, { params: { email } })
            .then(response => response.data)
            .catch(error => {
                console.error("Error fetching profile:", error);
                throw error;
            });
    },
    
    updateProfile(email, user) {
        console.log("Sending data to backend for update:", { email, ...user }); // Debugging log
        return axios.put(`${API_URL}/profile`, { email, ...user })
            .then(response => {
                console.log("Response from backend:", response.data); // Log the backend response
                return response.data;
            })
            .catch(error => {
                console.error("Error updating profile:", error);
                throw error;
            });
    },
    
    

    getAllUsers: async () => {
        return axios.get(`${API_URL}/all`).then((response) => response.data).catch(handleError);
    },

    deleteUser: async (id) => {
        return axios.delete(`${API_URL}/delete/${id}`).then((response) => response.data).catch(handleError);
    },
    createUser: async (user) => {
        const response = await axios.post(`${API_URL}/post`, user);
        return response.data; // Adjust if necessary
    }
};

export default UserService;
