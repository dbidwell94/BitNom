import React, { useMemo } from 'react';
import styled from 'styled-components';
import { hexToNumber } from '../../utils';
import { DNSOpcode, RCode } from '../../mappings';

const DNSViewContainer = styled.div`
  grid-row: 1 / -1;
  grid-column: 2 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.basePadding / 2}rem;
  overflow-y: auto;

  section#view-container {
    display: grid;
    grid-template-columns: repeat(16, 1fr);
    .grid-item {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding: ${({ theme }) => theme.spacing.basePadding / 4}rem;
      text-align: center;
      border: thin solid ${({ theme }) => theme.colors.primaryv2};
    }
  }
`;

interface IDNSViewProps {
  bytes: [string, string][];
}

export default function DNSView(props: IDNSViewProps) {
  const { bytes: nibbles } = props;

  const bytes = useMemo<string[]>(() => {
    return nibbles.map((nibble) => nibble.join(''));
  }, [nibbles]);

  return (
    <DNSViewContainer>
      <h3>DNS Packet</h3>
      <section id='view-container'>
        <p className='grid-item'>0</p>
        <p className='grid-item'>1</p>
        <p className='grid-item'>2</p>
        <p className='grid-item'>3</p>
        <p className='grid-item'>4</p>
        <p className='grid-item'>5</p>
        <p className='grid-item'>6</p>
        <p className='grid-item'>7</p>
        <p className='grid-item'>8</p>
        <p className='grid-item'>9</p>
        <p className='grid-item'>10</p>
        <p className='grid-item'>11</p>
        <p className='grid-item'>12</p>
        <p className='grid-item'>13</p>
        <p className='grid-item'>14</p>
        <p className='grid-item'>15</p>
        <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
          <h6>ID</h6>
          <p>{hexToNumber(bytes[0] + bytes[1])}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '1 / 2' }}>
          <h6>QR</h6>
          <p>{hexToNumber(bytes[2]) >> 8 === 0 ? 'Req' : 'Res'}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '2 / 6' }}>
          <h6>OP</h6>
          <p>{DNSOpcode[(hexToNumber(bytes[2]) & 0b01111000) >> 3]}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '6 / 7' }}>
          <h6>AA</h6>
          <p>{(hexToNumber(bytes[2]) & 0b00000100) >> 2 === 1 ? 'Y' : 'N'}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '7 / 8' }}>
          <h6>TC</h6>
          <p>{(hexToNumber(bytes[2]) & 0b00000010) >> 1 === 1 ? 'Y' : 'N'}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '8 / 9' }}>
          <h6>RD</h6>
          <p>{(hexToNumber(bytes[2]) & 0b00000001) === 1 ? 'Y' : 'N'}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '9 / 10' }}>
          <h6>RA</h6>
          <p>{(hexToNumber(bytes[3]) & 0b10000000) >> 7 === 1 ? 'Y' : 'N'}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '10 / 13' }}>
          <h6>Reserved</h6>
        </div>
        <div className='grid-item' style={{ gridColumn: '13 / 17' }}>
          <h6>RCode</h6>
          <p>{RCode[hexToNumber(bytes[3]) & 0b00001111]}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
          <h6>Query Count</h6>
          <p>{hexToNumber(bytes[4] + bytes[5])}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
          <h6>Answer Count</h6>
          <p>{hexToNumber(bytes[6] + bytes[7])}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
          <h6>Nameserver Count</h6>
          <p>{hexToNumber(bytes[8] + bytes[9])}</p>
        </div>
        <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
          <h6>Additional Record Count</h6>
          <p>{hexToNumber(bytes[10] + bytes[11])}</p>
        </div>
      </section>
    </DNSViewContainer>
  );
}
