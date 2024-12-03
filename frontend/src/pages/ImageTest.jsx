import React, { useState } from 'react';
import photoUploadService from '../services/PhotoUploadService';

const ImageTest = () => {
  const [photoId, setPhotoId] = useState('');
  const [photoData, setPhotoData] = useState(null);
  const [message, setMessage] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await photoUploadService.uploadPhoto(file);
        setMessage('Photo uploaded successfully!');
        setPhotoId(response);
      } catch (error) {
        setMessage('Error uploading photo.');
      }
    }
  };

  const handleFetch = async () => {
    try {
      const response = await photoUploadService.getPhoto(photoId);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoData(reader.result);
      };
      reader.readAsDataURL(response);
      setMessage('Photo fetched successfully!');
    } catch (error) {
      setMessage('Error fetching photo.');
    }
  };

  const handleDelete = async () => {
    try {
      await photoUploadService.deletePhoto(photoId);
      setMessage('Photo deleted successfully!');
      setPhotoData(null);
      setPhotoId('');
    } catch (error) {
      setMessage('Error deleting photo.');
    }
  };

  return (
    <div style={{ 
      backgroundColor: 'white', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '20px' 
    }}>
      <h1>Image Test Page</h1>
      <input 
        type="text" 
        placeholder="Enter Photo ID" 
        value={photoId} 
        onChange={(e) => setPhotoId(e.target.value)} 
        style={{ marginBottom: '10px' }}
      />
      <p>Current Photo ID: {photoId}</p>
      <input type="file" onChange={handleUpload} />
      <button onClick={handleFetch} disabled={!photoId}>Fetch Photo</button>
      <button onClick={handleDelete} disabled={!photoId}>Delete Photo</button>
      <p>{message}</p>
      {photoData && (
        <img src={photoData} alt="Fetched" />
      )}
    </div>
  );
};

export default ImageTest;
