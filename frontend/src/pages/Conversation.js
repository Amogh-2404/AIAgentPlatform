import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  margin-left: 260px;
`;

function Conversation() {
  const { conversationId } = useParams();
  const [conversation, setConversation] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get('/agents/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const conv = response.data.conversations.find(c => c.id.toString() === conversationId);
        setConversation(conv);
      })
      .catch(error => {
        console.error("Error fetching conversation:", error);
      });
    }
  }, [conversationId]);

  if (!conversation) return <Container>Loading conversation...</Container>;

  return (
    <Container>
      <h2>Conversation Detail</h2>
      <p><strong>Agent:</strong> {conversation.agent_id}</p>
      <p><strong>Started at:</strong> {new Date(conversation.created_at).toLocaleString()}</p>
      <pre>{conversation.conversation}</pre>
    </Container>
  );
}

export default Conversation;
