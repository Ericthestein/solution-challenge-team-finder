import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase";
import config from "./config";

// Initialize Firebase

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: config.FIREBASE_apiKey,
        authDomain: config.FIREBASE_authDomain,
        projectId: config.FIREBASE_projectId,
        storageBucket: config.FIREBASE_storageBucket,
        appId: config.FIREBASE_appId
    });
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
