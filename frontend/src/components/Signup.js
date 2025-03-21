import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SignupContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffffff, #f0f0f0);
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
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
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
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

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/signup', { username, email, password, accept_terms: acceptTerms });
      alert(response.data.message);
      navigate('/login');
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed! " + error.response?.data?.detail);
    }
  };

  return (
    <SignupContainer>
      <Title>Sign Up</Title>
      <form onSubmit={handleSignup}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={e => setAcceptTerms(e.target.checked)}
          />
          &nbsp;I accept the Terms of Service and Privacy Policy
        </label>
        <Button type="submit">Register</Button>
      </form>
    </SignupContainer>
  );
}

export default Signup;
