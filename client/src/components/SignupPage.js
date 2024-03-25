import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import './style.css';
import axios from 'axios';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 430px;
  width: 100%;
  height: 400px;
  background: #fff;
  border-radius: 7px;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
`;

const Title = styled.header`
  font-size: 30px;
  font-weight: 500;
  margin-top: 15px;
  text-align: center;
`;

const Form = styled.form`
  padding-top: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-bottom: 1rem;
`;

const Input = styled.input`
  height: 40px;
  width: 90%;
  padding: 0 15px;
  font-size: 12px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  &:focus {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
  }
`;

const Button = styled.input.attrs({ type: 'submit' })`
  color: #fff;
  background: #009579;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.4s;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  margin-left: 40%;
  &:hover {
    background: #006653;
  }
`;

const Login = styled.label`
  font-size: 14px;
  margin-left: 30%;
  color: #009579;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/users/signup', {
                username,
                email,
                password
            });
            console.log(response.data); // Handle response as needed
            // Redirect or perform other actions upon successful signup
        } catch (error) {
            console.error('Error signing up:', error);
            // Handle errors, e.g., show error message to user
        }
    };

    return (
        <div className='LoginSignup'>
            <Container>
                <Title>Sign Up</Title>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" value="Sign Up" />
                </Form>
                <Login onClick={() => navigate('/login')}>Already have an account? Login</Login>
            </Container>
        </div>
    );
};

export default SignUp;
