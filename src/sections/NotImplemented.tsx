import React from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import Button from '../components/Button';

const NotImplementedContainer = styled.div`
  grid-row: 2 / 4;
  grid-column: 2 / 4;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    button {
      margin-top: ${({ theme }) => theme.spacing.basePadding / 2}rem;
    }
  }
`;

export default function NotImplemented() {
  const navigate = useNavigate();

  return (
    <NotImplementedContainer>
      <div>
        <h3>This feature is not yet implemented</h3>
        <Button buttonText='Go Back' onClick={() => navigate(-1)} />
      </div>
    </NotImplementedContainer>
  );
}
