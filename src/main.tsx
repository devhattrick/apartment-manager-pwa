import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import { system } from './theme';
import './i18n';
import './styles/global.css';

const githubPagesBase = '/apartment-manager-pwa';
const currentPath = window.location.pathname;
const routerBasename =
  currentPath === githubPagesBase || currentPath.startsWith(`${githubPagesBase}/`)
    ? githubPagesBase
    : '/';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <BrowserRouter basename={routerBasename}>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
