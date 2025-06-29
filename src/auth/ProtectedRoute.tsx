import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from "./AuthProvider";
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
      //@ts-ignore
      const authTokenResponse = await chrome.storage.local.get(["token"]);

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
        //@ts-ignore
        chrome.storage.local.set({ token: res.headers.get("Authorization") });
        setIsAuthenticated(true);
      }
    } 
    getAuthToken();
  }, [])

  return isAuthenticated ? <Outlet /> : <div className='loading'><CircularProgress /></div>;
}