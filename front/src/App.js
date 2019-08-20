import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './scss/App.scss';
import Start from './components/start/Start';
import Login from './components/login/Login';
import Signup from './components/signup/Signup';
import Browse from './components/browse/Browse';


function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Start} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/browse" component={Browse} />
      </div>
    </Router>
  );
}

export default App;