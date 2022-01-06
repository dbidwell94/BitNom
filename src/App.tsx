import React, { useState } from 'react';
import styled from 'styled-components';
import HexInput from './components/HexInput';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  background: ${({ theme }) => theme.colors.base};
`;

export default function App() {
  const [hexInput, setHexInput] = useState<[string, string][]>();

  return (
    <AppContainer>
      <HexInput onChange={(value) => setHexInput(value)} />
    </AppContainer>
  );
}
