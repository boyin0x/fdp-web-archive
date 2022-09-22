import React from "react";
import ReactDOM from "react-dom";
import Container from '@mui/material/Container';
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@emotion/react";

const theme = createTheme({
  palette: {
    primary: {
      main: '#00FFAB',
      contrastText: "#0000088",
    },
    secondary: {
      main: '#808080',
    }
  }
});

const Options = () => {
  
  return (
    <>
      <Container maxWidth="xl">
        
        
        
      </Container>
    </>
  );
};



ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Options />
    </ThemeProvider>
  </React.StrictMode >
    
  , document.getElementById("root")
);
