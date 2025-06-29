import React, { useEffect, useState } from 'react';
import { customFetch } from './customFetch';
import { 
  Box, 
  Typography, 
  IconButton, 
  Paper,
  TextField,
} from '@mui/material';
import { Close, ContentCopy, Check, Refresh } from "@mui/icons-material"
import PDFExportButton from './PDFExportButton';

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
  const [documentType, setDocumentType] = useState<string>("");

  useEffect(() => {
    window.addEventListener("show-generation-container", (event: any) => {
      setVisible(true);
      setLoginRequired(false);
      setJobPosting(event.detail.jobPosting);
      setDocumentType(event.detail.documentType);
      getDocument(event.detail.jobPosting, event.detail.documentType);
    });

    window.addEventListener("login-required", () => {
      setLoginRequired(true);
      setVisible(true);
    })

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
    setIsDocumentLoading(true);

    try {
      // @ts-ignore
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
          background: '#1c1c1a',
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
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10000,
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: 2,
            width: 40,
            height: 40,
            '&:hover': {
              background: '#f5f5f5',
            },
          }}
        >
          <Close />
        </IconButton>
        {loginRequired ? 
          <Box sx={{ display: 'flex', flexDirection: "column", gap: `${GAP}px`, width: "100%", margin: 'auto 40px' }}>
            <Typography variant="h5" component="h3" sx={{marginTop: "-72px"}} >ResuMaker</Typography>
            <Typography variant="body1" sx={{ fontSize: "16px" }}>
              <strong>Please login via the extension popup to generate documents.</strong>
            </Typography>
          </Box> :
          <>
            <IconButton
              onClick={handleRefresh}
              disabled={!jobPosting || !documentType || isDocumentLoading}
              sx={{
                position: 'absolute',
                top: 16,
                right: 184, // Position to the left of the PDF export button
                zIndex: 10000,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 40,
                height: 40,
                '&:hover': {
                  background: '#f5f5f5',
                },
              }}
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
              onClick={handleCopyToClipboard}
              disabled={!generatedDocument || isDocumentLoading}
              sx={{
                position: 'absolute',
                top: 16,
                right: 72, // Position to the left of the close button
                zIndex: 10000,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 40,
                height: 40,
                '&:hover': {
                  background: '#f5f5f5',
                },
              }}
            >
              {copied ? <Check /> : <ContentCopy />}
            </IconButton>
            <PDFExportButton
              documentType={documentType}
              jobPosting={jobPosting}
              content={generatedDocument}
              disabled={!generatedDocument || isDocumentLoading}
              sx={{
                position: 'absolute',
                top: 16,
                right: 128,
                zIndex: 10000,
                background: '#fff',
                border: '1px solid #ccc',
                borderRadius: 2,
                width: 40,
                height: 40,
                '&:hover': {
                  background: '#f5f5f5',
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: `${GAP}px`, width: "100%", margin: 'auto 40px' }}>
              <Paper
                sx={{
                  width: "100%",
                  height: INNER_HEIGHT,
                  background: 'black',
                  padding: '20px',
                  borderRadius: '8px',
                  overflowY: 'auto',
                }}
              >
                <Typography variant="body1" sx={{whiteSpace: "pre-line", color: 'white'}}>{jobPosting}</Typography>
              </Paper>  
              <TextField
                multiline
                value={generatedDocument}
                disabled={isDocumentLoading}
                variant="outlined"
                onChange={(e) => setGeneratedDocument(e.target.value)}
                slotProps={{
                  input: {
                    sx: {
                      color: 'white',
                      backgroundColor: 'black',
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
                sx={{
                  width: "100%",
                  // height: INNER_HEIGHT,
                  '& .MuiInputBase-root': {
                    height: '100%',
                    alignItems: 'flex-start',
                    padding: '20px 0px 20px 20px',
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
