import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';

import { Provider } from 'next-auth/client';
import Auth from '../components/auth';

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
