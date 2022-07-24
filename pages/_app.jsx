import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { pink } from "@mui/material/colors";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { Provider } from "next-auth/client";
import Auth from "../components/auth";

function App(props) {
  const { Component, pageProps } = props;

  const darkTheme = createTheme({
    palette: {
      type: "dark",
      primary: pink,
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Provider session={pageProps.session}>
          <Auth>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Component {...pageProps} />
            </LocalizationProvider>
          </Auth>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
