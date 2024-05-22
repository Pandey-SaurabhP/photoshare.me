import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Navbar from './Navbar';
// import SidebarComponent from './Sidebar';
import Masonry from 'react-responsive-masonry';
import PhotoModal from './PhotoModal';

const Container = styled.div`
    display: flex;
    width: 99%;
`;

const PhotosContainer = styled.div`
    width: 100%;
`;

const MainContainer = styled.div`
    margin-top: 20px;
    margin-left: 10px;
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

const Username = styled.p`
    margin-top: 5px;
    margin-left: 5%;
    font-size: 15px;
`;

const Note = styled.p`
  margin : 1px;
  text-align: center;
  font-size: 14px;
`

function Dashboard() {
  const [images, setImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [columnsCount, setColumnsCount] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {

    const activeCheck = async () => {
      try {
        const response = await axios.get('https://photoshare-me.onrender.com/api/users/active');
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching active status:', error);
      }
    };

    activeCheck();


    const calculateColumnsCount = () => {
      if (windowWidth >= 1200) {
        setColumnsCount(5);
      } else if (windowWidth >= 992) {
        setColumnsCount(4);
      } else if (windowWidth >= 768) {
        setColumnsCount(3);
      } else {
        setColumnsCount(2);
      }
    };

    calculateColumnsCount();

    return () => {
      window.removeEventListener('resize', calculateColumnsCount);
    };
  }, [windowWidth]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
    <>
      <Container>
        {/* <SidebarWrapper>
                <SidebarComponent />
            </SidebarWrapper> */}
        <PhotosContainer>
          <Navbar images={images} setFilteredImages={setFilteredImages} />
          <MainContainer>
            <Masonry columnsCount={columnsCount} gutter="10px">
              {filteredImages.map((image, i) => (
                <div key={i} onClick={() => handleImageClick(image)}>
                  <MasonryImg
                    src={`${image.path}`}
                    style={{ width: "100%", display: "block" }}
                  />
                  <Username>By {image.username ? image.username : "Undefined"}</Username>
                </div>
              ))}
            </Masonry>
          </MainContainer>
        </PhotosContainer>

        {isModalOpen && selectedImage && (
          <PhotoModal
            username={(selectedImage.username) ? (selectedImage.username) : "Undefined"}
            imageUrl={selectedImage.path}
            title={(selectedImage.title) ? (selectedImage.title) : "Undefined"}
            description={(selectedImage.description) ? (selectedImage.description) : "Undefined"}
            tags={(selectedImage.tags) ? (selectedImage.tags) : "Undefined"}
            onClose={handleCloseModal}
          />
        )}

      </Container>


      <Note>Since, the application is hosted on a free server</Note>
      <Note>It may take 10-50 seconds to start the server. Please wait</Note>

    </>
  );
}

export default Dashboard;
