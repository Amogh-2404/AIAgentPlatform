import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: #0d2538;
  padding: 15px;
  color: white;
  display: flex;
  justify-content: space-between;
`;

const NavLinks = styled.nav`
  a {
    color: white;
    margin: 0 15px;
    text-decoration: none;
    transition: color 0.2s;
    &:hover {
      color: #feb47b;
    }
  }
`;

function Header() {
  return (
    <HeaderContainer>
      <div>
        <h1>AI Agents Beast Mode Ultimate</h1>
      </div>
      <NavLinks>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </NavLinks>
    </HeaderContainer>
  );
}

export default Header;
