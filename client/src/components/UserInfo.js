// UserInfoPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserInfoPage = () => {
    const [userInfo, setUserInfo] = useState(null);

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

        fetchUserInfo();
    }, []);

    return (
        <div>
            {userInfo ? (
                <div>
                    <h2>User Information</h2>
                    <p>Username: {userInfo.username}</p>
                    <p>Email: {userInfo.email}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default UserInfoPage;
