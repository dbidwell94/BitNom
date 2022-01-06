import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';
import HexView from '../../components/HexView';
import DNSView from './DNSView';

const DNSHexViewContainer = styled.div`
  grid-row: 1 / -1;
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(6, 1fr);
`;

export default function DNSHexView() {
  const params = useParams();

  const bytes = useMemo<[string, string][]>(() => {
    const bytes: [string, string][] = [];

    if (!params['*']) return bytes;

    params['*'].split('/').forEach((byte) => {
      const splitByte = byte.split(',');
      const nibble1 = splitByte.length < 2 ? '0' : splitByte[0];
      const nibble2 = splitByte.length < 2 ? splitByte[0] : splitByte[1];
      bytes.push([nibble1, nibble2]);
    });

    return bytes;
  }, []);

  return (
    <DNSHexViewContainer>
      <HexView bytes={bytes} className='dns-hex-view' />
      <DNSView bytes={bytes} />
    </DNSHexViewContainer>
  );
}
