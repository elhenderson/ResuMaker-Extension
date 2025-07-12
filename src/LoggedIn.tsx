import { gradient, gradientAnimation, gradientHoverAnimation } from '@elhenderson/resumaker-common';
import { Typography, Box, Link, Button } from '@mui/material';
import { useAuth } from '@elhenderson/resumaker-common';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '@elhenderson/resumaker-common';

export default function LoggedIn() {
  const { setToken, token } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await customFetch("/logout", {
        method: "POST",
        headers: {
          "Authorization": token?.toString() || "",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
    // Navigate to login page after logout attempt
    setToken(null);
    //@ts-ignore
    chrome.storage.local.set({ token: null });
    navigate("/");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontWeight: 700,
          mb: 1,
          background: gradient,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          backgroundSize: '200% 200%',
          WebkitTextFillColor: 'transparent',
          ...gradientAnimation,
        }}
      >
        ResuMaker
      </Typography>
      <Typography variant="h4" color="primary" gutterBottom>
        You're logged in!
      </Typography>

      
      
      <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 2, mb: 1 }}>
        Get better results by expanding your profile!
      </Typography>
      <Link
        href="http://localhost:3000/app/prompt-creator"
        // href="https://resumaker.link/app/prompt-creator"
        target="_blank"
        rel="noopener noreferrer"
        variant="body1"
        sx={{
          textDecoration: 'none',
          fontWeight: 600,
          color: 'primary.main',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        resumaker.link
      </Link>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          How to use:
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          1. Highlight the relevant parts of the job post
        </Typography>
        <Typography variant="body1" color="text.secondary">
          2. Right click and choose an option from ResuMaker
        </Typography>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Button
          onClick={handleLogout}
          variant="outlined"
          color="secondary"
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              borderColor: gradient,
              ...gradientHoverAnimation
            },
            borderColor: gradient,
            ...gradientAnimation
          }}
        >
          Log Out
        </Button>
      </Box>

      
    </Box>
  );
}
