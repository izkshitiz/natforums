import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Landingwrapper from './views/landing/Landingwrapper';
import './antd-style/red-antd.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Landingwrapper />
      </div>
    </BrowserRouter>
  );
}

export default App;
