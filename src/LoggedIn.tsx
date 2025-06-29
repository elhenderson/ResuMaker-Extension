import { Typography, Box } from '@mui/material';

export default function LoggedIn() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Typography variant="h4" color="primary">
        Logged In
      </Typography>
    </Box>
  );
}
