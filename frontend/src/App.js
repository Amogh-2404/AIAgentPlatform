import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import TaskProgress from './pages/TaskProgress';
import Conversation from './pages/Conversation';
import Profile from './pages/Profile';
import PasswordResetRequest from './pages/PasswordResetRequest';
import ResetPassword from './pages/ResetPassword';
import Sidebar from './components/Sidebar';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f0f2f5;
  }
`;

const Container = styled.div`
  padding-bottom: 50px;
`;

function App() {
  return (
    <Container>
      <GlobalStyle />
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/task/:taskId" element={<TaskProgress />} />
        <Route path="/conversation/:conversationId" element={<Conversation />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/request-password-reset" element={<PasswordResetRequest />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </Container>
  );
}

export default App;
