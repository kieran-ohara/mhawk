import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';

import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';

import pink from '@material-ui/core/colors/pink';

function App(props) {
  const { Component, pageProps } = props;

  const darkTheme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: pink,
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default App;
