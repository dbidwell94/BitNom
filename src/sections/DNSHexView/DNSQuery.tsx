import React from 'react';
import { hexToNumber } from '../../utils';

interface IDNSQueryProps {
  bytes: string[];
  startingIndex: number;
}

export default function DNSQuery(props: IDNSQueryProps): [JSX.Element, number] {
  const { bytes, startingIndex } = props;
  return [
    <>
      <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
        <h6>QName</h6>
        <p>{hexToNumber(bytes[10] + bytes[11])}</p>
      </div>
      <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
        <h6>QType</h6>
        <p>{hexToNumber(bytes[10] + bytes[11])}</p>
      </div>
      <div className='grid-item' style={{ gridColumn: '1 / -1' }}>
        <h6>QClass</h6>
        <p>{hexToNumber(bytes[10] + bytes[11])}</p>
      </div>
    </>,
    1,
  ];
}
