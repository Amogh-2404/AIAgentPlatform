import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Card = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin: 20px;
  width: 300px;
  padding: 20px;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const Title = styled.h3`
  margin-top: 0;
`;

const Description = styled.p`
  color: #555;
`;

const Button = styled.button`
  background: #008cba;
  border: none;
  padding: 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  margin-top: 10px;
`;

function AgentCard({ agent }) {
  const [taskId, setTaskId] = useState(null);
  const navigate = useNavigate();

  const runAgent = () => {
    let payload = {};
    if (agent.id === "chatbot") {
      payload = { input: "Hello, beast mode AI!" };
    } else if (agent.id === "summarizer") {
      payload = { text: "This is a long text requiring a beast mode summarization." };
    } else if (agent.id === "translator") {
      payload = { text: "Hello, world!" };
    } else if (agent.id === "sentiment") {
      payload = { text: "I absolutely love this product, it's fantastic!" };
    }
    api.post(`/agents/${agent.id}/run`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(response => {
        const newTaskId = response.data.task_id;
        setTaskId(newTaskId);
        navigate(`/task/${newTaskId}`);
      })
      .catch(error => {
        console.error("Error running agent:", error);
      });
  };

  return (
    <Card>
      <Title>{agent.name}</Title>
      <Description>{agent.description}</Description>
      <Button onClick={runAgent}>Run Agent</Button>
    </Card>
  );
}

export default AgentCard;
