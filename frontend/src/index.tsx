import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }} basename="/portal">
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);