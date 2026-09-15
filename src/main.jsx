import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import './index.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element #root was not found in index.html');
}

ReactDOM.createRoot(root).render(
  <AppErrorBoundary>
    <BrowserRouter>
      <WishlistProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </WishlistProvider>
    </BrowserRouter>
  </AppErrorBoundary>
);
