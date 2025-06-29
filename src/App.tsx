import './App.css'
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#181a20',
      paper: '#23272f',
    },
    primary: {
      main: '#90caf9',
    },
    error: {
      main: '#f44336',
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function App({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}
