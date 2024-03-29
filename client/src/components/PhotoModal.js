import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { format } from 'date-fns';

const ModalWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: #fff;
    width: 50%;
    height: 70%;
    padding: 20px;
    display: flex;
`;

const ImageContainer = styled.div`
    flex: 1;
    margin-right: 0px;  
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
`;

const DetailsContainer = styled.div`
    flex: 1;
    padding-top: 10px;
    padding-right: 10px;
    width: 100%;
    overflow-y: auto;
`;

const Title = styled.h2`
    font-size: 24px;
    margin-bottom: 10px;
    margin-left: 0px;
`;

const Description = styled.p`
    font-size: 16px;
    margin-top: 1px;
    margin-left: 0px;
    padding-left: 0px;
    margin-bottom: 4px;
`;

const Tags = styled.ul`
    list-style-type: none;
    margin-top: 1px;
    margin-left: 0px;
    padding-left: 0px;
    margin-bottom: 4px;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 20px;
    background: none;
    border: none;
    cursor: pointer;
    color: #fff;
`;

const CommentInput = styled.input`
    width: 100%;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-right: 10px;
    margin-left: 0px;
    padding-left: 10px;
`;

const SubmitButton = styled.button`
    width: 100px;
    height: 40px;
    padding: 10px;
    background-color: #009579;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`;

const CommentContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    margin-left: 10px;
`;

const CommentBox = styled.div`
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 10px;
    background-color: #f9f9f9;
`;

const CommentText = styled.p`
    font-size: 15px;
    color: black;
    margin-bottom: 5px;
`;

const CommentDetails = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: #666;
`;

const Container1 = styled.div`
    display: grid;
    width: 40%;
    margin-left: 10px;
    padding-left: 0px;
`;

const PhotoModal = ({ username, imageUrl, title, description, tags, onClose }) => {

    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [already, setAlready] = useState(false);

    const fetchComments = useCallback(async () => {
        console.log('Trying to fetch comments');

        try {
            const response = await axios.post('https://photoshare-me.onrender.com/api/files/retrieve_comment', {
                filename: imageUrl
            });
            setAllComments(response.data);
        } catch (error) {
            console.error('Error uploading photo:', error);
        }
    }, [imageUrl]);


    useEffect(() => {
        if (!already) {
            fetchComments();
            setAlready(1);
        }

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

        if (!userInfo) fetchUserInfo();
    }, [already, userInfo, fetchComments]);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmitComment = async () => {
        console.log('Submitted comment:', comment);

        try {
            const response = await axios.post('https://photoshare-me.onrender.com/api/files/add_comment', {
                email: userInfo.email,
                filename: imageUrl,
                text: comment
            });

            console.log(response.data);
            fetchComments();
        }
        catch (error) {
            console.error('Error uploading photo:', error);
        }

        setComment('');
    };

    return (
        <ModalWrapper>
            <ModalContent>
                <ImageContainer>
                    <Image src={imageUrl} alt="Photo" />
                </ImageContainer>

                <Container1>
                    <DetailsContainer>
                        <CloseButton onClick={onClose}>X</CloseButton>

                        <Title>Title : {title}</Title>
                        <Tags> Uploaded by : {username} </Tags>

                        <Description> Description : {description}</Description>
                        <Tags> Tags : {tags} </Tags>

                        <CommentBox>
                            {allComments.map((comment, index) => (
                                <div key={index}>
                                    <CommentText>{comment.text}</CommentText>
                                    <CommentDetails>
                                        <span>{comment.email}</span>
                                        <span>{format(new Date(comment.time), 'dd/MM/yyyy HH:mm:ss')}</span>
                                    </CommentDetails>
                                </div>
                            ))}
                        </CommentBox>


                    </DetailsContainer>

                    <CommentContainer>
                        {userInfo ? (
                            <>
                                <CommentInput
                                    type="text"
                                    placeholder="Add a comment"
                                    value={comment}
                                    onChange={handleCommentChange}
                                />
                                <SubmitButton onClick={handleSubmitComment}>Submit</SubmitButton>
                            </>
                        ) : (
                            <p>Please log in to comment.</p>
                        )}
                    </CommentContainer>
                </Container1>
            </ModalContent>
        </ModalWrapper>
    );
};

export default PhotoModal;
