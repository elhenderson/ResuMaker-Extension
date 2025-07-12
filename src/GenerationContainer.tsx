import React, { useEffect, useState } from 'react';
import { customFetch } from "@elhenderson/resumaker-common";
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper,
  TextField,
} from '@mui/material';
import { Close, ContentCopy, Check, Refresh } from "@mui/icons-material"
import PDFExportButton from './PDFExportButton';
import { gradientAnimation, gradient } from '@elhenderson/resumaker-common';

const GENERATION_WIDTH = 1500;
const GENERATION_HEIGHT = 1123;
const LOGIN_REQUIRED_WIDTH = 400;
const LOGIN_REQUIRED_HEIGHT = 200;
const INNER_HEIGHT = "1000px";
const GAP = 40;

const GenerationContainer: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [jobPosting, setJobPosting] = useState<string>("");
  const [generatedDocument, setGeneratedDocument] = useState<string>("");
  const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(false);
  const [loginRequired, setLoginRequired] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [documentType, setDocumentType] = useState<"resume" | "coverLetter">("resume");

  useEffect(() => {
    window.addEventListener("show-generation-container", (event: any) => {
      setVisible(true);
      setLoginRequired(false);
      // setJobPosting(event.detail.jobPosting);
      setDocumentType(event.detail.documentType);
      getDocument(event.detail.jobPosting, event.detail.documentType);
    });

    window.addEventListener("login-required", () => {
      setLoginRequired(true);
      setVisible(true);
    })

    window.addEventListener("auth-updated", (event: any) => {
      if (event.detail.authenticated) {
        setLoginRequired(false);
        setVisible(true);
      }
    });

    return () => {
      window.removeEventListener("show-generation-container", () => {
        setLoginRequired(false);
        setVisible(true);
      });

      window.removeEventListener("login-required", () => {
        setLoginRequired(true);
        setVisible(true);
      });
    };
  }, []);

  const getDocument = async (jobPosting: string, documentType: string) => {
    setGeneratedDocument("");
    setIsDocumentLoading(true);

    if (!jobPosting) {
      setJobPosting(window.getSelection()?.toString() || "");
    }

    try {
      const storage = await chrome.storage.local.get(["token"]);

      const body = {
        jobDescription: jobPosting
      }

      const response = documentType === "resume" ?
        await customFetch("/resume", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Authorization": await storage.token,
            "Content-Type": "application/json"
          }
        }) :  
        await customFetch("/coverLetter", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Authorization": await storage.token,
            "Content-Type": "application/json"
          }
        })

      const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader()

      let accumulatedText = ""
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setIsDocumentLoading(false);
          break;
        }
        accumulatedText += value.toString();
        setGeneratedDocument(accumulatedText);
      }
    } catch (error) {
      console.error(error);
    }

    setIsDocumentLoading(false);
  }

  const handleRemoveSquares = () => {
    setVisible(false);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedDocument);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleRefresh = () => {
    if (jobPosting && documentType) {
      setGeneratedDocument("");
      getDocument(jobPosting, documentType);
    }
  };

  const textAreaStyles = {
    width: "100%",
    height: INNER_HEIGHT,
    '& .MuiInputBase-root': {
      height: '100%',
      alignItems: 'flex-start',
      padding: '20px',
      borderRadius: '8px',
      fontSize: '1rem',
      lineHeight: '1.5',
      fontFamily: 'inherit',
    },
    '& .MuiInputBase-input': {
      height: '100% !important',
      overflow: 'auto !important',
      whiteSpace: 'pre-line',
    },
  }

  const buttonStyles = {
    position: 'absolute',
    top: 16,
    zIndex: 10000,
    background: '#d3d3d3',
    border: '1px solid #ccc',
    borderRadius: 2,
    width: 40,
    height: 40,
    '&:hover': {
      background: '#f5f5f5',
    },
  }

  return (
    visible && (
      <Paper
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "75%",
          height: "100%",
          maxWidth: loginRequired ? LOGIN_REQUIRED_WIDTH : GENERATION_WIDTH,
          maxHeight: loginRequired ? LOGIN_REQUIRED_HEIGHT : GENERATION_HEIGHT,
          background: '#363636',
          boxShadow: '0 0 16px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <IconButton
          onClick={handleRemoveSquares}
          sx={{ ...buttonStyles, right: 16, }}
        >
          <Close />
        </IconButton>
        {loginRequired ? 
          <Box sx={{ display: 'flex', flexDirection: "column", gap: `${GAP}px`, width: "100%", margin: 'auto 40px' }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{
                marginTop: "-50px",
                background: gradient,
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
                ...gradientAnimation,
              }}
            >
              ResuMaker
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "16px", color: "#d3d3d3" }}>
              <strong>Please login via the extension popup to generate documents.</strong>
            </Typography>
          </Box> :
          <>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{
                position: 'absolute',
                top: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                background: gradient,
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: 'bold',
                zIndex: 10001,
                margin: 0,
                ...gradientAnimation,
              }}
            >
              ResuMaker
            </Typography>
            <IconButton
              onClick={handleRefresh}
              disabled={!jobPosting || !documentType || isDocumentLoading}
              sx={{ ...buttonStyles, right: 184 }}
            >
              <Refresh 
                sx={{
                  animation: isDocumentLoading ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': {
                      transform: 'rotate(0deg)',
                    },
                    '100%': {
                      transform: 'rotate(360deg)',
                    },
                  },
                }}
              />
            </IconButton>
            <IconButton
              onClick={() => {
                if (!isDocumentLoading && jobPosting) {
                  const newDocumentType = documentType === "resume" ? "coverLetter" : "resume";
                  setDocumentType(newDocumentType);
                  getDocument(jobPosting, newDocumentType);
                }
              }}
              disabled={!jobPosting || isDocumentLoading}
              sx={{
                ...buttonStyles,
                width: 100,
                right: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {documentType === "resume" ? "Cover Letter" : "Resume"}
            </IconButton>
            <IconButton
              onClick={handleCopyToClipboard}
              disabled={!generatedDocument || isDocumentLoading}
              sx={{ ...buttonStyles, right: 72 }}
            >
              {copied ? <Check /> : <ContentCopy />}
            </IconButton>
            <PDFExportButton
              documentType={documentType}
              jobPosting={jobPosting}
              content={generatedDocument}
              disabled={!generatedDocument || isDocumentLoading}
              sx={{ ...buttonStyles, right: 128, }}
            />
            <Box sx={{ display: 'flex', gap: `${GAP}px`, width: "100%", margin: 'auto 40px' }}>
              <TextField
                multiline
                value={jobPosting}
                disabled={true}
                variant="outlined"
                sx={textAreaStyles}
                slotProps={{
                  input: {
                    sx: {
                      backgroundColor: '#d3d3d3',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiInputBase-input.Mui-disabled': {
                        color: 'black !important',
                        '-webkit-text-fill-color': 'black !important',
                      }
                    }
                  }
                }}
              />
              <TextField
                multiline
                value={generatedDocument}
                disabled={isDocumentLoading}
                variant="outlined"
                onChange={(e) => setGeneratedDocument(e.target.value)}
                sx={textAreaStyles}
                slotProps={{
                  input: {
                    sx: {
                      backgroundColor: '#d3d3d3',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    }
                  }
                }}
              />
            </Box>
          </>
        }
      </Paper>
    )
  );
};

export default GenerationContainer;
