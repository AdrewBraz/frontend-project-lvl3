import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';
import React from 'react';
import { createRoot }  from 'react-dom/client';
import App from './components/App.jsx'
// import app from './app';

export default () => {
    const root = createRoot(document.getElementById('app'))
    root.render(<App/>)
}
