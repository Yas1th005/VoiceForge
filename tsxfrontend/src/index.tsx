import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Voice from './components/Voice';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let allRoutes=createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/voice',
      element: <Voice/>,
    }
  ]
)
root.render(
  <React.StrictMode>
    <RouterProvider router={allRoutes}/>
  </React.StrictMode>
);
