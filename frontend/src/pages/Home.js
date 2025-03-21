import React from 'react';
import styled from 'styled-components';
import AgentGallery from '../components/AgentGallery';

const HomeContainer = styled.div`
  padding: 20px;
  margin-left: 260px;
`;

function Home() {
  return (
    <HomeContainer>
      <h2>Welcome to AI Agents Beast Mode Ultimate</h2>
      <AgentGallery />
    </HomeContainer>
  );
}

export default Home;
