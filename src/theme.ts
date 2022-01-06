const theme = {
  colors: {
    base: '#121212',
    primary: '#bb86fc',
    primaryv2: '#3700b3',
    secondary: '#03dac6',
    error: '#cf6679',
    onBase: '#ffffff80',
    notOnBase: '#000000',
    text: {
      baseNoAlpha: '#ffffff',
      highEmphasis: '#ffffff87',
      mediumEmphasis: '#ffffff60',
      disabled: '#ffffff38',
    },
  },
  spacing: {
    basePadding: 1.6,
  },
};

type ITheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {}
}

export default theme;
