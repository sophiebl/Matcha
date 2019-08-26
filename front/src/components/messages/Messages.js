import React from 'react';

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const Conversations = () => {
  const { loading, error, data } = useQuery(gql`
    {
      User (firstname: "Manon") {
        conversations {
          id
          lastMessage {
            id
            author {
              id
              firstname
            }
            content
          }
      	}
      }
    }
  `);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.User[0].conversations.map(({ id, lastMessage }) => (
    <div key={id}>
		<div /*style={{float: 'left'}}*/>
		<img alt="user icon" style={{'border-radius': '50%'}} src="https://bulma.io/images/placeholders/128x128.png" />
	  </div>
	  <div>
		<p>{lastMessage.author.firstname}</p>
        <p>{lastMessage.content}</p>
	  </div>
	  <hr />
    </div>
  ));
}

export default () => {
  return (
      <div>
	    <p>Discussions</p>
	    <Conversations />
      </div>
  );
}
