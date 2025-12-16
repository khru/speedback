import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (e) {
  console.error("Mount Error:", e);
  rootElement.innerHTML = `<div style="padding: 20px; text-align: center; color: #e11d48;">
    <h2>Something went wrong loading the app.</h2>
    <p>Please try refreshing the page.</p>
  </div>`;
}