import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  outline: none;
  background: ${({ theme }) => theme.colors.primaryv2};
  color: ${({ theme }) => theme.colors.text.baseNoAlpha};
  padding: ${({ theme }) => theme.spacing.basePadding / 2}rem
    ${({ theme }) => (theme.spacing.basePadding / 2) * (16 / 9)}rem;
  border: none;
  border-radius: ${({ theme }) => theme.spacing.basePadding / 4}rem;
  transition: 0.125s ease-in-out filter;

  &:active {
    box-shadow: 0rem 0rem 0.5rem 0rem black inset;
  }

  &:disabled {
    filter: opacity(0.5);
    cursor: not-allowed;
    &:active {
      box-shadow: none;
    }
  }
`;

type IReactButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

interface IButtonProps extends Omit<IReactButtonProps, 'ref'> {
  buttonText: string;
}

const Button = React.forwardRef<HTMLButtonElement, IButtonProps>((props, ref) => {
  const { buttonText, ...buttonProps } = props;

  return (
    <StyledButton ref={ref} {...buttonProps}>
      {buttonText}
    </StyledButton>
  );
});

export default Button;
