import React  from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './scss/App.scss';
import Start  from './components/start/Start';
import Login  from './components/login/Login';
import Signup from './components/signup/Signup';
import Browse from './components/browse/Browse';
import TestQL from './components/TestQL';
import Messages from './components/messages/Messages';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCoffee, faTimes, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { faStar, faHeart } from '@fortawesome/free-regular-svg-icons';
library.add(faCheckSquare, faCoffee, faStar, faTimes, faShoppingBasket, faHeart);

const client = new ApolloClient({uri: 'http://localhost:4000/api'});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Route exact path="/" component={Start} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/browse" component={Browse} />
          <Route path="/testql" component={TestQL} />
          <Route path="/messages" component={Messages} />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
