import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';


const Container = styled.div`
  background: white;
  margin: 0;
  padding: 0;
  position: absolute;
  max-width: 430px;
  width: 100%;
  height: 300px;
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
  padding-top: 15px;
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

const SignUp = styled.span`
  font-size: 14px;
  margin-left: 30%;
  color: #009579;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Note = styled.p`
  margin : 1px;
  text-align: center;
  font-size: 14px;
`

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://photoshare-me.onrender.com/api/users/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div className='LoginSignup'>
            <Container>
                <Title>Login</Title>

                <Note>Since, the application is hosted on a free server</Note>
                <Note>It may take 10-50 seconds to start the server. Please wait</Note>

                <Form onSubmit={handleLoginSubmit}>
                    <Input
                        type="email"
                        placeholder="Email Address"
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
                    <Button value="Login" />
                </Form>
                <SignUp onClick={() => navigate('/signup')}>Don't have an account? Sign up</SignUp>
            </Container>
        </div>
    );
};

export default Login;
