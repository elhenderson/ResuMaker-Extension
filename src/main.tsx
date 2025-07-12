import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import routes from "./routes";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@elhenderson/resumaker-common';

const router = createBrowserRouter(routes());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App>
        <RouterProvider router={router} />
      </App>
    </AuthProvider>
  </StrictMode>,
)
