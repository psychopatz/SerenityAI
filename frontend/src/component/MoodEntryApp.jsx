import React, { useState, useEffect } from "react";
import MoodEntryService from "../services/MoodEntryService";

function MoodEntryApp() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    mood_type: "",
    description: "",
    entry_date: ""
  });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await MoodEntryService.getAllEntries();
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleAddEntry = async (e) => {
    e.preventDefault();
    try {
      await MoodEntryService.postEntry(newEntry);
      fetchEntries();
      setNewEntry({ mood_type: "", description: "", entry_date: "" });
    } catch (error) {
      console.error("Error adding mood entry:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await MoodEntryService.deleteEntry(id);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting mood entry:", error);
    }
  };

  return (
    <div>
      <h1>Mood Entry Management</h1>
      <form onSubmit={handleAddEntry}>
        <input
          type="text"
          name="mood_type"
          value={newEntry.mood_type}
          onChange={handleInputChange}
          placeholder="Mood Type"
          required
        />
        <textarea
          name="description"
          value={newEntry.description}
          onChange={handleInputChange}
          placeholder="Description"
          required
        ></textarea>
        <input
          type="date"
          name="entry_date"
          value={newEntry.entry_date}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Mood Entry</button>
      </form>

      <ul>
        {entries.map((entry) => (
          <li key={entry.mood_entry_id}>
            <p><strong>Mood:</strong> {entry.mood_type}</p>
            <p><strong>Description:</strong> {entry.description}</p>
            <p><strong>Date:</strong> {new Date(entry.entry_date).toLocaleDateString()}</p>
            <button onClick={() => handleDelete(entry.mood_entry_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MoodEntryApp;
