import { Navigate } from 'react-router-dom';
import { ProtectedRoute }  from '@elhenderson/resumaker-common';
import LoggedIn from './LoggedIn';
import Login from "./Login";

const routes = () => [
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        path: "logged-in",
        element: <LoggedIn />
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/app/logged-in" replace />
  }
]


export default routes;