import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';

import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import { pink } from '@mui/material/colors';

import { Provider } from 'next-auth/client';
import Auth from '../components/auth';

function App(props) {
  const { Component, pageProps } = props;

  const darkTheme = createTheme({
    palette: {
      type: 'dark',
      primary: pink,
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider session={pageProps.session}>
          <Auth>
            <Component {...pageProps} />
          </Auth>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
