import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import AgentCard from '../components/AgentCard';

const DashboardContainer = styled.div`
  padding: 20px;
  margin-left: 260px;
`;

function Dashboard() {
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
    <DashboardContainer>
      <h2>Your AI Agents Dashboard</h2>
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </DashboardContainer>
  );
}

export default Dashboard;
