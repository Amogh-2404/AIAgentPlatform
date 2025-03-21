import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import AgentCard from './AgentCard';

const GalleryContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: 260px;
`;

function AgentGallery() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    api.get('/agents/')
      .then(response => {
        setAgents(response.data.agents);
      })
      .catch(error => {
        console.error("Error fetching agents:", error);
      });
  }, []);

  return (
    <GalleryContainer>
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </GalleryContainer>
  );
}

export default AgentGallery;
