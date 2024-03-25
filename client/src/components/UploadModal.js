import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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
width: 30%;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
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
    const [selectedFile, setSelectedFile] = useState(null);
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (title.trim() === '' || description.trim() === '' || categories.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);
    
            await axios.post('https://photoshare-me.onrender.com/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
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

                <CloseButton onClick={onClose}>Close</CloseButton>
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
