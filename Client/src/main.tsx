import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <span className="min-h-screen bg-[#2d6a4f] overflow-y-scroll">
      <App />
    </span>
    </BrowserRouter>
  </React.StrictMode>
);
