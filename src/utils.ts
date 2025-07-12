export const gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)';

export const gradientAnimation = {
  animation: 'gradientShift 10s ease-in-out infinite',
  '@keyframes gradientShift': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}

export const gradientHoverAnimation = {
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'brightness(1.2)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 2s ease-in-out infinite',
  },
  '@keyframes gradientShift': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}