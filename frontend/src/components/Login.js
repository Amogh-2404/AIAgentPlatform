import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
`;

const Input = styled.input`
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #008cba, #00aaff);
  border: none;
  padding: 12px;
  color: white;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.02);
  }
`;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    api.post('/auth/login', { username, password, two_factor_code: twoFactorCode })
      .then(response => {
        localStorage.setItem("token", response.data.access_token);
        navigate("/dashboard");
      })
      .catch(error => {
        console.error("Login failed:", error);
        alert("Login failed! " + error.response?.data?.detail);
      });
  };

  return (
    <LoginContainer>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Two-Factor Code (if enabled)"
          value={twoFactorCode}
          onChange={e => setTwoFactorCode(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
    </LoginContainer>
  );
}

export default Login;
