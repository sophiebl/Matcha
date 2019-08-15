import React from 'react';
import './scss/App.css';
import Start from './components/start/Start';
import Login from './components/login/Login';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      {/*<Start />*/}
      <Login />
    </div>
  );
}

export default App;