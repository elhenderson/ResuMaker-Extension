import { useState } from 'react'
import { Box, Button, CircularProgress, TextField, Typography, Alert, Paper } from '@mui/material';
import { useAuth } from '@elhenderson/resumaker-common';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '@elhenderson/resumaker-common';
import { gradientAnimation, gradientHoverAnimation, gradient, Logo } from '@elhenderson/resumaker-common';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await customFetch('/signin', {
      method: 'POST',
      body: JSON.stringify({
        "email": email.toString().toLowerCase(),
        "password": password,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (response.status === 200) {
      setToken(response.headers.get("Authorization"));
      chrome.storage.local.set({ token: response.headers.get("Authorization") });
      navigate("/app/logged-in");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        minWidth: 320,
        maxWidth: 400,
        bgcolor: 'background.paper',
        minHeight: 0
      }}>
      <Logo />
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Box mt={3} display="flex" justifyContent="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              color: '#fff',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                ...gradientHoverAnimation
              },
              background: gradient,
              ...gradientAnimation
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>

        <Box mt={3} display="flex" justifyContent="center">
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            Register{' '}
            <a 
              // href="https://resumaker.link" 
              href="http://localhost:3000/"
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1976d2', textDecoration: 'none' }}
            >
              here!
            </a>
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}