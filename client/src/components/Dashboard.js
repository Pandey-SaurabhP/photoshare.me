import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar from './Navbar';
import SidebarComponent from './Sidebar';
import Masonry from 'react-responsive-masonry';
import PhotoModal from './PhotoModal'; // Import the PhotoModal component

const Container = styled.div`
    display: flex;
    width: 99%;
`;

const PhotosContainer = styled.div`
    width: 100%;
    
`;

const MainContainer = styled.div`
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    
`;

const MasonryImg = styled.img`
    border-radius: 15px;
    cursor: pointer;
    transition: transform 0.3s ease;

    &:hover { 
        transform: scale(1.02);
    }
`;

const SidebarWrapper = styled.div`
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
`;

const Username = styled.p`
    margin-top: 5px;
    margin-left: 5%;
    font-size: 15px;
`;

function Dashboard() {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null); // State to track the selected image
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleImageClick = (image) => {
        console.log(image);
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    const fetchPhotos = async () => {
        try {
            const response = await axios.get('https://photoshare-me.onrender.com/api/files/retrieve');
            setImages(response.data);
            setFilteredImages(response.data);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    return (
        <Container>
            <SidebarWrapper>
                <SidebarComponent />
            </SidebarWrapper>
            <PhotosContainer>
                <Navbar images={images} setFilteredImages={setFilteredImages} />
                <MainContainer>
                    <Masonry columnsCount={5} gutter="10px">
                        {filteredImages.map((image, i) => (
                            <div key={i} onClick={() => handleImageClick(image)}>
                                <MasonryImg
                                    src={`${image.path}`}
                                    style={{ width: "100%", display: "block" }}
                                />
                                <Username>By {(image.username)? (image.username): "Undefined"}</Username>
                            </div>
                        ))}
                    </Masonry>
                </MainContainer>
            </PhotosContainer>

            {isModalOpen && selectedImage && (
                <PhotoModal
                    username={(selectedImage.username)? (selectedImage.username): "Undefined"}
                    imageUrl={selectedImage.path}
                    title={(selectedImage.title)? (selectedImage.title): "Undefined"}
                    description={(selectedImage.description)? (selectedImage.description): "Undefined"}
                    tags={(selectedImage.tags)? (selectedImage.tags): "Undefined"}
                    onClose={handleCloseModal}
                />
            )}

        </Container>
    );
}

export default Dashboard;
