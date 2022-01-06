import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import HexInput from './components/HexInput';
import DNSHexView from './sections/DNSHexView';
import NotImplemented from './sections/NotImplemented';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  background: ${({ theme }) => theme.colors.base};
`;

export default function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path='/' element={<HexInput />} />
        <Route path='/dns/*' element={<DNSHexView />} />
        <Route path='/tcpudp/*' element={<NotImplemented />} />
      </Routes>
    </AppContainer>
  );
}
