import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import FileUpload from './FileUpdate';
import ImageGallery from './DisplayMedia';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <FileUpload /> */}
    <ImageGallery />
  </React.StrictMode>
);


reportWebVitals();
