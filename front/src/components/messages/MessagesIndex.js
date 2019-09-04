import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCurrentUid } from '../../Helpers';

const GET_CONVS = gql`
	query User($uid: ID) {
	  User(uid: $uid) {
		uid
		conversations {
		  uid
		  lastMessage {
			uid
			author {
			  uid
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

const MessagesList = () => {
  const { loading, error, data } = useQuery(GET_CONVS, {
	variables: {
	  'uid': getCurrentUid(),
	},
	fetchPolicy: 'cache-and-network',
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const convs = data.User[0].conversations;
  return convs.map(({ uid, lastMessage }) => (
	<div key={uid}>
	  <Link to={"/messages/" + uid}>
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

const MessagesIndex = () => {
  return (
	<div>
	  <Link to="/" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="3x" icon="times" /></Link>
	  <br />
	  <p style={{fontSize: '15px'}}><strong>Discussions</strong></p>
	  <MessagesList />
	</div>
  );
}

export default MessagesIndex;
