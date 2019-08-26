import React, { /*useState*//*, useEffect*/ } from 'react';
import {  Link } from 'react-router-dom';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const GET_CONVS = gql`
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
  `;

const divStyle = {
  display: 'flex',
  flexDirection: 'row',
  marginLeft: '25px',
};

const imgStyle = {
  borderRadius: '50%',
  height: '10vh',
};

const txtStyle = {
  textAlign: 'left',
  marginLeft: '20px',
};

const hrStyle = {
  display: 'block',
  height: '1px',
  border: 0,
  borderTop: '1px solid #ccc',
  margin: '1em 0',
  padding: 0
};

const nameStyle = {
  color: 'black',
  fontSize: '15px',
  fontWeight: 'bold',
  marginTop: '5px'
};

const msgStyle = {
  color: '#27d5db',
  fontSize: '15px',
};

const Conversations = () => {
  const { loading, error, data } = useQuery(GET_CONVS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const convs = data.User[0].conversations;
  return convs.map(({ id, lastMessage }) => (
	<div key={id}>
	  <Link to={"/conversations/" + id}>
		<div style={divStyle}>
		  <img alt="user icon" style={imgStyle} src="https://bulma.io/images/placeholders/128x128.png" />
		  <div style={txtStyle}>
			<p style={nameStyle}>{lastMessage.author.firstname}</p>
			<p style={msgStyle}>{lastMessage.content}</p>
		  </div>
		</div>
	  </Link>
	  <hr style={hrStyle}/>
	</div>
  ));
}

export default () => {
  return (
	<div>
	  <p style={{fontSize: '15px'}}><strong>Discussions</strong></p>
	  <Conversations />
	</div>
  );
}
