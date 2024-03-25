import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar from './Navbar';
import SidebarComponent from './Sidebar';
import Masonry from 'react-responsive-masonry';

const Container = styled.div`
    display: flex;
    width: 99%;
`;

const PhotosContainer = styled.div`
    width: 100%;
`;

const MainContainer = styled.div`
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around; /* Adjust this as needed */
    gap: 10px;
`;

const MasonryImg = styled.img`
    border-radius: 15px;
    border : 2px solid black;
`;

const SidebarWrapper = styled.div`
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
`;

function Dashboard() {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await axios.get('https://photoshare-me.onrender.com/api/files/retrieve');
            setImages(response.data);
            setFilteredImages(response.data); // Initially set filtered images to all images
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
                            <MasonryImg
                                key={i}
                                src={`${image.path}`}
                                style={{ width: "100%", display: "block" }}
                            />
                        ))}
                    </Masonry>
                </MainContainer>
            </PhotosContainer>
        </Container>
    );
}

export default Dashboard;
