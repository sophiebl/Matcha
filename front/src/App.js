import React  from 'react';
import Start  from './components/start/Start';
import Login  from './components/login/Login';
import Button from './components/Button';
import './scss/App.css';

import ApolloClient from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const client = new ApolloClient({
	uri: 'http://localhost:4000/api',
});

const Users = () => {
  const { loading, error, data } = useQuery(gql`
    {
      Users {
        id
        firstname
	  }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.Users.map(({ id, firstname }) => (
    <div key={id}>
      <p>
        {id}: {firstname}
      </p>
    </div>
  ));
}

const App = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
		{/*<Start />*/}
		{/*<Login />*/}
        <Users />
      </div>
    </ApolloProvider>
  );
}

export default App;
