import { useState } from 'react'
import { Box, Button, CircularProgress, TextField, Typography, Alert, Paper } from '@mui/material';
import { useAuth } from './auth/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { customFetch } from './customFetch';

export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setToken, token } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const getAuthToken = async () => {
  //     //@ts-ignore
  //     const authTokenResponse = await chrome.storage.local.get(["token"]);

  //     if (!authTokenResponse.token) { 
  //       const res = await customFetch('/authenticate', {
  //         method: 'GET',
  //       });
  //       if (res.status === 401) {
  //         navigate("/")
  //       }
  //       if (res.status === 200) {
  //         setToken(res.headers.get("Authorization"));
  //         //@ts-ignore
  //         chrome.storage.local.set({ token: res.headers.get("Authorization") });
  //         navigate("/app/logged-in");
  //       }
  //     }
  //   } 
  //   getAuthToken();
  // }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate login
    return customFetch('/signin', {
        method: 'POST', 
        body: JSON.stringify({
          "email": email.toString().toLowerCase(),
          "password": password,
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(async response => {

        // if (response.status === 401) {
        //   setSigninEmailPassError(true)
        //   setSigninEmailPassErrorMessage(await response.text());
        //   setIsLoading(false)
        // }

        if (response.status === 200) {
          setToken(response.headers.get("Authorization"));
          //@ts-ignore
          chrome.storage.local.set({ token: response.headers.get("Authorization") });
          navigate("/app/logged-in");
        }
      })
  };

  return (
    <Paper elevation={3} sx={{ p: 4, minWidth: 320, maxWidth: 400, bgcolor: 'background.paper', minHeight: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, mb: 1, background: 'linear-gradient(90deg, #90caf9 0%, #42a5f5 50%, #7e57c2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textFillColor: 'transparent' }}>
        ResuMaker
      </Typography>
      <Typography variant="h6" component="h2" gutterBottom align="center" sx={{ mb: 2, fontWeight: 400, fontSize: '1.1rem' }}>
        Login
      </Typography>
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
              background: 'linear-gradient(90deg, #90caf9 0%, #42a5f5 50%, #7e57c2 100%)',
              color: '#fff',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(90deg, #7e57c2 0%, #42a5f5 50%, #90caf9 100%)',
                boxShadow: 'none',
              },
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
        {token}
      </Box>
    </Paper>
  )
}