# ResuMaker Extension

A Chrome browser extension that generates personalized resumes and cover letters based on job postings using AI.

## Features

- **Context Menu Integration**: Right-click on selected job posting text to generate documents
- **AI-Powered Generation**: Creates tailored resumes and cover letters based on job descriptions
- **Secure Authentication**: Login via extension popup with token-based authentication
- **Real-time Streaming**: Live generation with streaming text updates
- **PDF Export**: Export generated documents as PDF files
- **Document Switching**: Toggle between resume and cover letter generation
- **Copy to Clipboard**: Easy copying of generated content
- **Material-UI Interface**: Modern, responsive user interface

## Technology Stack

- **Frontend**: React 19, TypeScript, Material-UI
- **Build Tool**: Vite
- **Extension API**: Chrome Extension Manifest V3
- **Authentication**: Token-based with Chrome storage
- **PDF Generation**: react-markdown with @react-pdf/renderer
- **Styling**: Emotion, Material-UI
