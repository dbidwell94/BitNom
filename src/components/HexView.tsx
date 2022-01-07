import React from 'react';
import styled from 'styled-components';

const HexViewContainer = styled.div`
  display: flex;
  grid-row: 1 / 6;
  grid-column: 1 / 2;
  width: 100%;
  height: auto;
  div#hex {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(2rem, 1fr));
    grid-template-rows: repeat(auto-fill, minmax(2rem, 1fr));
    grid-gap: 0.25rem;
    background: ${({ theme }) => theme.colors.primary};
    padding: ${({ theme }) => theme.spacing.basePadding / 2}rem;
    box-shadow: 0rem 0rem 1rem 0rem ${({ theme }) => theme.colors.onBase};
    overflow-y: auto;
    code {
      text-align: center;
    }
  }
`;

interface IHexViewProps {
  nibbles: [string, string][];
  className?: string;
}

export default function HexView(props: IHexViewProps) {
  const { nibbles, className } = props;

  return (
    <HexViewContainer className={className}>
      <div id='hex'>
        {nibbles.map((byte, index) => {
          return <code key={`${byte} - ${index}`}>{byte}</code>;
        })}
      </div>
    </HexViewContainer>
  );
}
