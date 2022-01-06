import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
    html {
        font-size: 62.5%;
        overflow-x: hidden;
    }

    * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
    }

    h1, h2, h3, h4, h5, h6, p, small, a, input, textarea {
        color: ${({ theme }) => theme.colors.text.highEmphasis};
        font-family: 'Ubuntu', sans-serif;
    }

    h1 {
        font-size: 9rem;
        letter-spacing: 0rem;
        font-weight: 300;
    }
    h2 {
        font-size: 6rem;
        font-weight: 300;
    }
    h3 {
        font-size: 5rem;
        font-weight: 400;
    }
    h4 {
        font-size: 3.5rem;
        font-weight: 400;

    }
    h5 {
      font-size: 2.4rem;
      font-weight: 400;

    }
    h6 {
      font-size: 2rem;
      font-weight: 500;
    }
    p, a, code, input, textarea {
        font-size: 1.6rem;
        font-weight: 400;
    }

    code {
        font-family: monospace;
        background: ${({ theme }) => theme.colors.secondary};
    }
`;

if ((module as any).hot) {
  (module as any).hot.accept();
}

ReactDOM.render(
  <>
    <Router>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </Router>
  </>,
  document.querySelector('#root')
);
