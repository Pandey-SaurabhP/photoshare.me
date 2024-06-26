import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
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
  margin-right: 12px;
  margin-left: 10px;

  &:hover { 
    color: grey;
    background-color: white;
    border-radius: 20px;
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
  width: 50%;
  padding: 10px;
  padding-left: 20px;
  border-radius: 35px;
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
                    const response = await axios.post('https://photoshare-me.onrender.com/api/users/info', {
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

            await axios.post('https://photoshare-me.onrender.com/api/files/upload', formData, {
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
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserInfo(null);
    };

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
                    <>
                        <p>Welcome, {userInfo.username}</p>
                        <NavLink onClick={handleLogout}>Logout</NavLink>
                    </>
                ) : (
                    <NavLink onClick={handleLogin}>Login</NavLink>
                )}
            </UserInfo>
        </Nav>
    );
}

export default Navbar;
