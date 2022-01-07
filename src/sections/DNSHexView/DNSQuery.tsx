import React from 'react';
import { DNSQuery } from './types';

interface IDNSQueryProps {
  query: DNSQuery;
  className?: string;
}

export default function Query(props: IDNSQueryProps) {
  const { query, className } = props;
  return (
    <>
      <div className={`grid-item ${className ? className : ''}`} style={{ gridColumn: '1 / -1' }}>
        <h6>Query Name</h6>
        <p>{query.qName}</p>
      </div>
      <div className={`grid-item ${className ? className : ''}`} style={{ gridColumn: '1 / -1' }}>
        <h6>Query Type</h6>
        <p>{query.qType}</p>
      </div>
      <div className={`grid-item ${className ? className : ''}`} style={{ gridColumn: '1 / -1' }}>
        <h6>Query Class</h6>
        <p>{query.qClass}</p>
      </div>
    </>
  );
}
