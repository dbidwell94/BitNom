import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { hexToNumber } from '../../utils';
import { DNSOpcode, DNSOpcodeKeys, RCode, RCodeKeys } from './mappings';
import { DNSPacket, DNSQuery } from './types';
import { default as Query } from './DNSQuery';

const DNSViewContainer = styled.div`
  grid-row: 1 / -1;
  grid-column: 2 / 4;
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

      &.error {
        background: ${({ theme }) => theme.colors.error};
      }
    }
  }
`;

const DNSErrorsContainer = styled.div`
  grid-row: 1 / -1;
  grid-column: 4 / 5;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.basePadding}rem;
  border: thin solid white;

  p.error {
    color: ${({ theme }) => theme.colors.error};
    margin: ${({ theme }) => theme.spacing.basePadding}rem 0rem;
    &:first-child {
      margin: 0rem;
    }
    &:last-child {
      margin: 0rem;
    }
  }
`;

interface IDNSViewProps {
  nibbles: [string, string][];
}

export default function DNSView(props: IDNSViewProps) {
  const { nibbles } = props;

  const [packetErrors, setPacketErrors] = useState<Record<keyof DNSPacket, string | null>>({
    additionalRecordCount: null,
    answerCount: null,
    answers: null,
    authoritative: null,
    id: null,
    nameserverCount: null,
    op: null,
    qr: null,
    queries: null,
    queryCount: null,
    recursionAvailable: null,
    recursionDesired: null,
    resultCode: null,
    truncated: null,
  });

  const bytes = useMemo<string[]>(() => {
    return nibbles.map((nibble) => nibble.join(''));
  }, [nibbles]);

  const packet = useMemo<DNSPacket | null>(() => {
    const errors = packetErrors;
    const toReturn: DNSPacket = {
      answers: [],
      queries: [],
    };

    // bytes 0, 1
    {
      const id = hexToNumber(bytes[0] + bytes[1]);
      toReturn.id = id;
    }
    // byte 2
    {
      // QR
      const qr = hexToNumber(bytes[2]) >> 8 === 0 ? 'Req' : 'Res';
      toReturn.qr = qr;
      // OPCode
      const op = (hexToNumber(bytes[2]) & 0b01111000) >> 3;
      if (DNSOpcodeKeys.includes(op)) {
        toReturn.op = DNSOpcode[op] as unknown as DNSOpcode;
      } else {
        errors.op = 'Invalid OPCode';
      }
      // Authoritative
      const aa = (hexToNumber(bytes[2]) & 0b00000100) >> 2 === 1;
      toReturn.authoritative = aa;
      // TC
      const tc = (hexToNumber(bytes[2]) & 0b00000010) >> 1 === 1;
      toReturn.truncated = tc;
      // RD
      const rd = (hexToNumber(bytes[2]) & 0b00000001) === 1;
      toReturn.recursionDesired = rd;
    }
    // byte 3
    {
      // RA
      const ra = (hexToNumber(bytes[3]) & 0b10000000) >> 7 === 1;
      toReturn.recursionAvailable = ra;
      // RCode
      const rCode = hexToNumber(bytes[3]) & 0b00001111;
      if (RCodeKeys.includes(rCode)) {
        toReturn.resultCode = RCode[rCode] as unknown as RCode;
      } else {
        errors.resultCode = 'Invalid result code';
      }
    }
    // bytes 4, 5
    {
      const queryCount = hexToNumber(bytes[4] + bytes[5]);
      toReturn.queryCount = queryCount;
    }
    // bytes 6, 7
    {
      const answerCount = hexToNumber(bytes[6] + bytes[7]);
      toReturn.answerCount = answerCount;
    }
    // bytes 8, 9
    {
      const nameserverCount = hexToNumber(bytes[8] + bytes[9]);
      toReturn.nameserverCount = nameserverCount;
    }
    // bytes 10, 11
    {
      const additionalRecordCount = hexToNumber(bytes[10] + bytes[11]);
      toReturn.additionalRecordCount = additionalRecordCount;
    }
    // queries (starting at byte 12)
    let byteIndex = 12;
    {
      const queries: DNSQuery[] = [];
      let shouldBreak = false;
      if (toReturn.queryCount && !Number.isNaN(toReturn.queryCount)) {
        for (let i = 0; i < toReturn.queryCount; i++) {
          if (shouldBreak) {
            break;
          }
          if (byteIndex > bytes.length) {
            errors.queries = 'Malformed query section';
            continue;
          }

          let builtString = '';
          let nameLength: number = hexToNumber(bytes[byteIndex++]);

          while (nameLength !== 0x0) {
            if (Number.isNaN(nameLength)) {
              builtString = 'ERR';
              shouldBreak = true;
              errors.queries = 'Malformed query section';
              break;
            }
            const sectionBytes = bytes.slice(byteIndex, byteIndex + nameLength);
            byteIndex = byteIndex + nameLength;
            nameLength = hexToNumber(bytes[byteIndex++]);
            builtString += sectionBytes
              .map((byte) => hexToNumber(byte))
              .map((chCode) => String.fromCharCode(chCode))
              .join('');
            if (nameLength !== 0x0) {
              builtString += '.';
            }
          }
          byteIndex++;

          const qType = hexToNumber(bytes[byteIndex++]);
          const qClass = hexToNumber(bytes[byteIndex++]);
          queries.push({ qName: builtString, qClass, qType });
        }
      } else {
        queries.push({ qClass: Number.NaN, qType: Number.NaN, qName: 'ERR' });
        errors.queries = 'Malformed query section';
      }
      toReturn.queries = queries;
    }
    setPacketErrors(errors);
    return toReturn;
  }, [bytes]);

  return (
    <>
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
          <div className={`grid-item${packetErrors.id ? ' error' : ''}`} style={{ gridColumn: '1 / -1' }}>
            <h6>ID</h6>
            <p>{packet?.id?.toString()}</p>
          </div>
          <div className={`grid-item${packetErrors.qr ? ' error' : ''}`} style={{ gridColumn: '1 / 2' }}>
            <h6>QR</h6>
            <p>{packet?.qr?.toString()}</p>
          </div>
          <div className={`grid-item${packetErrors.op ? ' error' : ''}`} style={{ gridColumn: '2 / 6' }}>
            <h6>OP</h6>
            <p>{packet?.op?.toString()}</p>
          </div>
          <div className={`grid-item${packetErrors.authoritative ? ' error' : ''}`} style={{ gridColumn: '6 / 7' }}>
            <h6>AA</h6>
            <p>{packet?.authoritative ? 'Y' : 'N'}</p>
          </div>
          <div className={`grid-item${packetErrors.truncated ? ' error' : ''}`} style={{ gridColumn: '7 / 8' }}>
            <h6>TC</h6>
            <p>{packet?.truncated ? 'Y' : 'N'}</p>
          </div>
          <div className={`grid-item${packetErrors.recursionDesired ? ' error' : ''}`} style={{ gridColumn: '8 / 9' }}>
            <h6>RD</h6>
            <p>{packet?.recursionDesired ? 'Y' : 'N'}</p>
          </div>
          <div
            className={`grid-item${packetErrors.recursionAvailable ? ' error' : ''}`}
            style={{ gridColumn: '9 / 10' }}
          >
            <h6>RA</h6>
            <p>{packet?.recursionAvailable ? 'Y' : 'N'}</p>
          </div>
          <div className='grid-item' style={{ gridColumn: '10 / 13' }}>
            <h6>Reserved</h6>
          </div>
          <div className={`grid-item${packetErrors.resultCode ? ' error' : ''}`} style={{ gridColumn: '13 / 17' }}>
            <h6>RCode</h6>
            <p>{packet?.resultCode?.toString()}</p>
          </div>
          <div className={`grid-item${packetErrors.queryCount ? ' error' : ''}`} style={{ gridColumn: '1 / -1' }}>
            <h6>Query Count</h6>
            <p>{packet?.queryCount?.toString()}</p>
          </div>
          <div className={`grid-item${packetErrors.answerCount ? ' error' : ''}`} style={{ gridColumn: '1 / -1' }}>
            <h6>Answer Count</h6>
            <p>{packet?.answerCount?.toString()}</p>
          </div>
          <div className={`grid-item${packetErrors.nameserverCount ? ' error' : ''}`} style={{ gridColumn: '1 / -1' }}>
            <h6>Nameserver Count</h6>
            <p>{packet?.nameserverCount?.toString()}</p>
          </div>
          <div
            className={`grid-item${packetErrors.additionalRecordCount ? ' error' : ''}`}
            style={{ gridColumn: '1 / -1' }}
          >
            <h6>Additional Record Count</h6>
            <p>{packet?.additionalRecordCount}</p>
          </div>
          {packet?.queries.map((query, index) => {
            return (
              <Query
                query={query}
                key={`dns-query-${index}-${query.qName}`}
                className={packetErrors.queries ? 'error' : ''}
              />
            );
          })}
        </section>
      </DNSViewContainer>
      <DNSErrorsContainer>
        {Object.values(packetErrors).map((error, index) => (
          <p className='error' key={`dns-error-${index}-${error}`}>
            {error}
          </p>
        ))}
      </DNSErrorsContainer>
    </>
  );
}
