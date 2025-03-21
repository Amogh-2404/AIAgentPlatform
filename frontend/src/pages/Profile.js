import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';

const Container = styled.div`
  padding: 20px;
  margin-left: 260px;
`;

const Input = styled.input`
  width: 100%;
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  border: none;
  padding: 12px;
  color: white;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
`;

function Profile() {
  const [profile, setProfile] = useState({});
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => {
        setProfile(response.data);
        setEmail(response.data.email);
        setProfilePicture(response.data.profile_picture_url || '');
      }).catch(err => {
        console.error("Error fetching profile:", err);
      });
    }
  }, []);

  const handleUpdate = () => {
    const token = localStorage.getItem("token");
    api.put('/auth/profile', { email, profile_picture_url: profilePicture }, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      alert(response.data.message);
    }).catch(err => {
      console.error("Error updating profile:", err);
      alert("Update failed!");
    });
  };

  return (
    <Container>
      <h2>Your Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Profile Picture URL"
        value={profilePicture}
        onChange={e => setProfilePicture(e.target.value)}
      />
      <Button onClick={handleUpdate}>Update Profile</Button>
    </Container>
  );
}

export default Profile;
