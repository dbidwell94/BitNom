import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

const DNSHexView = lazy(() => import('./sections/DNSHexView'));
const NotImplemented = lazy(() => import('./sections/NotImplemented'));
const HexInput = lazy(() => import('./components/HexInput'));

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
        <Route
          path='/'
          element={
            <Suspense fallback={<h1>Loading...</h1>}>
              <HexInput />
            </Suspense>
          }
        />

        <Route
          path='/dns/*'
          element={
            <Suspense fallback={<h1>Loading...</h1>}>
              <DNSHexView />
            </Suspense>
          }
        />

        <Route
          path='/tcpudp/*'
          element={
            <Suspense fallback={<h1>Loading...</h1>}>
              <NotImplemented />
            </Suspense>
          }
        />
      </Routes>
    </AppContainer>
  );
}
