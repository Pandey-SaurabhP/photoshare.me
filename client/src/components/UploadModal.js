import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import imageCompression from 'browser-image-compression';

const NavLink = styled.a`
  float: left;
  display: block;
  height: 100%;
  color: white;
  text-align: center;
  padding: 14px 20px;
  margin: 10px;
  text-decoration: none;
  cursor: pointer;
  background-color: #009579;
  color: white;

  &:hover {
    background-color: #009579;
    color: white;
  }

  &.active {
    background-color: #009579;
    color: white;
  }

  @media screen and (max-width: 600px) {
    float: none;
    display: block;
    text-align: left;
  }
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure the modal appears on top of other elements */
`;

const ModalContent = styled.div`
  position: relative; /* Changed from fixed to relative */
  width: 30%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  margin-left: 95%;
  margin-bottom: 10px;
  font-size: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 999;
`;

const UploadedImage = styled.img`
  width: 100%;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const UploadModal = ({ onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const response = await axios.post('https://photoshare-me.onrender.com/api/users/info', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setUserInfo(response.data.email);
          console.log(response.data.email);
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (!userInfo) fetchUserInfo();
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {

    if (title.trim() === '' || description.trim() === '' || categories.trim() === '') {
      alert('Please fill in all fields.');
      return;
    }

    const compressedImage = await imageCompression(selectedFile, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 720
    });

    setSelectedFile(compressedImage);

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('categories', categories);
      formData.append('username', userInfo);

      const response = await axios.post('https://photoshare-me.onrender.com/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.imageUrl;
      setUploadedImageUrl(imageUrl);

      setTitle('');
      setDescription('');
      setCategories('');
      setSelectedFile(null);

      onClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };


  return (
    <ModalWrapper>
      <ModalContent>
        <CloseButton onClick={onClose}>X</CloseButton>

        <div style={{ display: 'flex', marginBottom: '20px' }}>
          {uploadedImageUrl ? (
            <UploadedImage src={uploadedImageUrl} alt="Uploaded Image" />
          ) : (
            <p>No image selected</p>
          )}

          <div style={{ marginLeft: '20px', flex: '1' }}>
            <Input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Categories"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />
          </div>
        </div>
        <>
          <label htmlFor="fileInput">
            <NavLink>Add Image</NavLink>
          </label>

          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <NavLink onClick={handleUpload}>Upload</NavLink>
        </>
      </ModalContent>
    </ModalWrapper>
  );
};

export default UploadModal;
