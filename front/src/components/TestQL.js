import React/*, { useState }*/ from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
        lastname
		    likesCount
		    tags {
          name
          id
		    }
	    }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.Users.map(({ id, firstname, lastname, tags, likesCount }) => (
    <div key={id}>
      <p>
		  {id}: {firstname} {lastname}
		  <br/>	- Tags: {tags.map(tag => tag.name).join(', ')}
		  <br/>	- Likes: {likesCount}
      </p>
    </div>
  ));
}

const TestQL = () => {
  return (
    <ApolloProvider client={client}>
      <div className="App">
		  <Users />
		  <FontAwesomeIcon icon="coffee" />
		  <FontAwesomeIcon icon={['far', 'star']} />
      </div>
    </ApolloProvider>
  );
}

export default TestQL;
