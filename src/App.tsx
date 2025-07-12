import './App.css'
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme } from "@elhenderson/resumaker-common";

export default function App({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
        minWidth={500}
        // minHeight="100vh"
        bgcolor="background.default"
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}
