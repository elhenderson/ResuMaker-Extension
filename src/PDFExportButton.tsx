import React, { useState } from 'react';
import { IconButton, Box, keyframes } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { useHandleExportPDF } from "@elhenderson/resumaker-common"

// Soothing bubbles animation
const bubbleAnimation = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
`;

const SoothingBubbles: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '4px',
      width: '40px',
      height: '40px',
    }}
  >
    {[...Array(3)].map((_, index) => (
      <Box
        key={index}
        sx={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'gray',
          animation: `${bubbleAnimation} .5s ease-in-out infinite`,
          animationDelay: `${index * 0.1}s`,
        }}
      />
    ))}
  </Box>
);

interface PDFExportButtonProps {
  documentType: "resume" | "coverLetter";
  jobPosting: string
  content: string;
  disabled?: boolean;
  sx?: any;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ documentType, jobPosting, content, disabled = false, sx }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { handleExportPDF } = useHandleExportPDF();

  const onClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await handleExportPDF(jobPosting, documentType, content);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '48px',
          height: '48px',
          ...sx,
        }}
      >
        <SoothingBubbles />
      </Box>
    );
  }

  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={sx}
    >
      <PictureAsPdf />
    </IconButton>
  );
};

export default PDFExportButton;
