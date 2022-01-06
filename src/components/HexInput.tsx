import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from './Button';

const HexInputContainer = styled.div`
  grid-row: 2 / 4;
  grid-column: 2 / 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  textarea {
    margin-top: ${({ theme }) => theme.spacing.basePadding / 2}rem;
    font-size: 2rem;
    background: none;
    outline: none;
    border: thin solid ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.spacing.basePadding}rem;
    width: 100%;
    height: 100%;
    transition: 0.125s ease-in-out border;
    color: ${({ theme }) => theme.colors.text.highEmphasis};
    text-transform: uppercase;
    font-family: 'Ubuntu Mono', monospace;
    padding: ${({ theme }) => theme.spacing.basePadding}rem;
    resize: none;
  }

  textarea:focus {
    border: thin solid ${({ theme }) => theme.colors.secondary};
  }

  textarea.error {
    border: thin solid ${({ theme }) => theme.colors.error};
  }

  h3 {
    text-align: center;
  }

  section#button-container {
    margin-top: ${({ theme }) => theme.spacing.basePadding / 2}rem;

    button {
      margin-right: ${({ theme }) => theme.spacing.basePadding / 2}rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

type HTMLInputProps = React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

interface IHexInputProps extends Omit<HTMLInputProps, 'onChange' | 'value'> {
  onChange?: (newValue: [string, string][]) => void;
}

const HexInput = React.forwardRef<HTMLTextAreaElement, IHexInputProps>((props, ref) => {
  const { onChange, className, ...inputProps } = props;
  const [input, setInput] = useState<string>('');

  const [bytes, setBytes] = useState<[string, string][]>([]);

  const [inputError, setInputError] = useState<string[]>([]);

  const navigate = useNavigate();

  function formatHexInput(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    evt.preventDefault();
    const { value } = evt.target;

    let builtString = '';

    const errors: string[] = [];

    [...value.toUpperCase().replace(/\s+/g, '').trim()].forEach((char, index) => {
      if (
        (char.charCodeAt(0) < 48 || char.charCodeAt(0) > 57) &&
        (char.charCodeAt(0) < 65 || char.charCodeAt(0) > 70)
      ) {
        errors.push(`${char} is not a hex code value`);
      }

      builtString += char;
      if (index !== 0 && index % 2 === 1) {
        builtString += ' ';
      }
    });
    setInput(builtString.trim());
    setInputError(errors);
  }

  useEffect(() => {
    if (inputError.length < 1) {
      const bytes = input.split(' ');

      const byteArray: [string, string][] = [];
      for (const byte of bytes) {
        if (!byte) continue;
        const nibble1 = byte.length < 2 ? '0' : byte[0];
        const nibble2 = byte.length < 2 ? byte[0] : byte[1];
        byteArray.push([nibble1, nibble2]);
      }
      setBytes(byteArray);
    }
  }, [input]);

  return (
    <HexInputContainer>
      <label htmlFor='hex-input'>
        <h3>Hex Input</h3>
      </label>
      <textarea
        onChange={formatHexInput}
        spellCheck={false}
        value={input}
        ref={ref}
        className={`${inputError.length > 0 ? 'error ' : ''}` + (className ? className : '')}
        id='hex-input'
        {...inputProps}
      />
      <section id='button-container'>
        <Button
          buttonText='DNS'
          onClick={() => {
            navigate(`/dns/${bytes.join('/')}`);
          }}
          disabled={inputError.length > 0 || input.length < 1}
        />
        <Button
          buttonText='TCP/UDP'
          onClick={() => {
            navigate(`/tcpudp/${bytes.join('/')}`);
          }}
          disabled={inputError.length > 0 || input.length < 1}
        />
        <Button buttonText='Auto Detect' disabled />
      </section>
    </HexInputContainer>
  );
});

export default HexInput;
