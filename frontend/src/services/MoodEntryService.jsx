import axios from "axios";

const API_URL = "http://localhost:8080/moodEntry";

const MoodEntryService = {
  getAllEntries: () => axios.get(`${API_URL}/get`),
  postEntry: (entry) => axios.post(`${API_URL}/post`, entry),
  updateEntry: (id, entry) => axios.put(`${API_URL}/update/${id}`, entry),
  deleteEntry: (id) => axios.delete(`${API_URL}/delete/${id}`)
};

export default MoodEntryService;
    