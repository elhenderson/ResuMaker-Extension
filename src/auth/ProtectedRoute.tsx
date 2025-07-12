import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "@elhenderson/resumaker-common";
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
// import "./Loading.scss";
import { customFetch } from '../customFetch';

export default function ProtectedRoute() {
  const {setToken} = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const getAuthToken = async () => {
      // Check if running in Chrome extension environment and get token
      const authTokenResponse = typeof chrome !== 'undefined' && 
        chrome.storage && 
        chrome.storage.local
        ? await chrome.storage.local.get(["token"])
        : { token: null };

      const res = !authTokenResponse.token ?
        await customFetch('/authenticate', {
          method: 'GET',
        }) :
        await customFetch('/authenticate', {
          method: 'GET',
          headers: {
            'Authorization': authTokenResponse.token
          }
        });
      if (res.status === 401) {
        navigate("/")
      }
      if (res.status === 200) {
        setToken(res.headers.get("Authorization"));
        // Check if running in Chrome extension environment
        if (typeof chrome !== 'undefined' && 
            chrome.storage && 
            chrome.storage.local) {
          chrome.storage.local.set({ token: res.headers.get("Authorization") });
        }
        setIsAuthenticated(true);
      }
    } 
    getAuthToken();
  }, [])

  return isAuthenticated ? <Outlet /> : <div className='loading'><CircularProgress /></div>;
}