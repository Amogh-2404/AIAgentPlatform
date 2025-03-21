import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: #0d2538;
  padding: 10px;
  color: white;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
`;

function Footer() {
  return (
    <FooterContainer>
      © 2025 AI Agents Beast Mode Ultimate. All rights reserved.
    </FooterContainer>
  );
}

export default Footer;
