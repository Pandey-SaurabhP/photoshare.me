import styled from 'styled-components';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from './UploadModal';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  background-color: black;
  overflow: hidden;
  height: 60px;
  font-size: 15px;
  align-items: center;
`;

const NavLink = styled.a`
  float: left;
  display: block;
  height: 100%;
  color: white;
  text-align: center;
  padding: 14px 20px;
  text-decoration: none;
  cursor: pointer;
  margin-left: 10px;

  &:hover { 
    color: grey;
    background-color: white;
    border-radius: 100px;
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

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  color: white;
  padding-right: 20px;
`;

const SearchInput = styled.input`
  margin-right: 20px;
  margin-left: 10px;
  width: 60%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #009579;
  }
`;

const Navbar = ({ images, setFilteredImages }) => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFile] = useState(null); // Define selectedFile state

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await axios.post('http://localhost:3001/api/users/info', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    setUserInfo(response.data);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        // Filter images based on search query
        const filteredImages = images.filter((image) =>
            image.path.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredImages(filteredImages);

        fetchUserInfo();
    }, [searchQuery, images, setFilteredImages]);


    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('photo', selectedFile);

            await axios.post('http://localhost:3001/api/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    };

    const handleLogin = () => {
        navigate('/login');
    }

    return (
        <Nav>
            <SearchInput
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />


            <UserInfo>
                <div>
                    {userInfo && (
                        <>
                            <NavLink onClick={openModal}>+</NavLink>
                            {isModalOpen && (
                                <UploadModal onClose={closeModal} onUpload={handleUpload} />
                            )}
                        </>
                    )}

                </div>
                {userInfo ? (
                    <div>
                        <p>Welcome, {userInfo.username}</p>
                    </div>
                ) : (
                    <NavLink onClick={handleLogin}>Login</NavLink>
                )}
            </UserInfo>
        </Nav>
    );
}

export default Navbar;
