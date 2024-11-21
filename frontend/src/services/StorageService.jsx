const StorageService = () => {
  // Helper functions for Local Storage
  const setLocalStorage = (key, value) => {
    // console.log(`Setting LocalStorage key: "${key}" with value:`, value);
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    // console.log(`Getting LocalStorage key: "${key}" - Value:`, value);
    return value ? JSON.parse(value) : null;
  };

  const removeLocalStorage = (key) => {
    // console.log(`Removing LocalStorage key: "${key}"`);
    localStorage.removeItem(key);
  };

  const clearLocalStorage = () => {
    console.log("Clearing all LocalStorage");
    localStorage.clear();
  };

  // Helper functions for Session Storage
  const setSessionStorage = (key, value) => {
    // console.log(`Setting SessionStorage key: "${key}" with value:`, value);
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  const getSessionStorage = (key) => {
    const value = sessionStorage.getItem(key);
    // console.log(`Getting SessionStorage key: "${key}" - Value:`, value);
    return value ? JSON.parse(value) : null;
  };

  const removeSessionStorage = (key) => {
    // console.log(`Removing SessionStorage key: "${key}"`);
    sessionStorage.removeItem(key);
  };

  const clearSessionStorage = () => {
    console.log("Clearing all SessionStorage");
    sessionStorage.clear();
  };

  return {
    // Expose Local Storage methods
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
    clearLocalStorage,
    // Expose Session Storage methods
    setSessionStorage,
    getSessionStorage,
    removeSessionStorage,
    clearSessionStorage,
  };
};

export default StorageService;


//Example Usage Sun a diri
// import React from "react";
// import StorageService from "./StorageService";

// const App = () => {
//   const storage = StorageService();

//   const handleSaveToLocal = () => {
//     storage.setLocalStorage("name", "John Doe");
//   };

//   const handleGetFromLocal = () => {
//     alert(storage.getLocalStorage("name"));
//   };

//   const handleSaveToSession = () => {
//     storage.setSessionStorage("sessionKey", "Session Value");
//   };

//   const handleGetFromSession = () => {
//     alert(storage.getSessionStorage("sessionKey"));
//   };

//   return (
//     <div>
//       <h1>Storage Service Example</h1>
//       <button onClick={handleSaveToLocal}>Save to LocalStorage</button>
//       <button onClick={handleGetFromLocal}>Get from LocalStorage</button>
//       <button onClick={handleSaveToSession}>Save to SessionStorage</button>
//       <button onClick={handleGetFromSession}>Get from SessionStorage</button>
//     </div>
//   );
// };

// export default App;
