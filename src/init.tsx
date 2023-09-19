import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal';
import React from 'react';
import { createRoot }  from 'react-dom/client';
import App from './components/App'
import {setStore} from './reducers/index';
import { Provider } from 'react-redux';


export default () => {
    const root = createRoot(document.getElementById('app'))
    root.render(<Provider store={setStore()}><App/></Provider>)
}
