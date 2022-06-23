import * as React from 'react';
import ReactDOM from "react-dom/client";
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.Fragment>
        <CssBaseline/>
        <BrowserRouter>
                <App/>
        </BrowserRouter>
    </React.Fragment>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

