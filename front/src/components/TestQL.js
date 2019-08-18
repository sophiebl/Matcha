import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

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


const TestQL = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Users />
      </div>
    </ApolloProvider>
  );   
}

export default TestQL;
