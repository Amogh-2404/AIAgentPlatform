import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useSearchParams, useNavigate } from 'react-router-dom';

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

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    api.post('/auth/reset-password', { token, new_password: newPassword })
      .then(response => {
        alert(response.data.message);
        navigate('/login');
      })
      .catch(err => {
        console.error("Error resetting password:", err);
        alert("Reset failed!");
      });
  };

  return (
    <Container>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <Input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <Button type="submit">Reset Password</Button>
      </form>
    </Container>
  );
}

export default ResetPassword;
