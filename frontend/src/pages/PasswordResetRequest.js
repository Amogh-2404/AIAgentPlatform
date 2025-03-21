import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';

const Container = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: 50px auto;
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
`;

function PasswordResetRequest() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/auth/request-password-reset', { email })
      .then(response => {
        alert(response.data.message);
      })
      .catch(err => {
        console.error("Error requesting password reset:", err);
        alert("Request failed!");
      });
  };

  return (
    <Container>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit">Send Reset Link</Button>
      </form>
    </Container>
  );
}

export default PasswordResetRequest;
