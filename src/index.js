import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom"
import ContextRouter from './context/ContextRouter';
import './index.css';
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ContextRouter>
        <App />
      </ContextRouter>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
