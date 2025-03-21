import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.isOpen ? '0' : '-250px')};
  width: 250px;
  height: 100%;
  background: #1a1a2e;
  color: white;
  transition: left 0.3s ease;
  overflow-y: auto;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 200px;
    left: ${props => (props.isOpen ? '0' : '-200px')};
  }
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: ${props => (props.isOpen ? '250px' : '10px')};
  z-index: 1100;
  background: #e94560;
  border: none;
  padding: 10px;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: left 0.3s ease;

  @media (max-width: 768px) {
    left: ${props => (props.isOpen ? '200px' : '10px')};
  }
`;

const ConversationItem = styled.div`
  padding: 15px;
  border-bottom: 1px solid #333;
  cursor: pointer;
  &:hover {
    background: #16213e;
  }
`;

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get('/agents/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setConversations(response.data.conversations);
      })
      .catch(error => {
        console.error("Error fetching conversations:", error);
      });
    }
  }, [isOpen]);

  return (
    <>
      <ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Conversations'}
      </ToggleButton>
      <SidebarContainer isOpen={isOpen}>
        <h3 style={{ padding: '15px' }}>Conversations</h3>
        {conversations.map(conv => (
          <ConversationItem key={conv.id} onClick={() => navigate(`/conversation/${conv.id}`)}>
            💬 {conv.agent_id} - {new Date(conv.created_at).toLocaleString()}
          </ConversationItem>
        ))}
      </SidebarContainer>
    </>
  );
}

export default Sidebar;
