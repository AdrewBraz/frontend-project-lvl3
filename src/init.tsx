import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';
import React from 'react';
import { createRoot }  from 'react-dom/client';
import App from './components/App'
import reducers from './reducers/index.js';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const store = configureStore({
    reducer: reducers,

})

export default () => {
    const root = createRoot(document.getElementById('app'))
    root.render(<Provider store={store}><App/></Provider>)
}
