import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCurrentUid } from '../../Helpers';
import Nav from "../Nav/Nav";

import './Messages.scss'

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
				avatar
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
	marginLeft: '25px'
};

const imgStyle = {
  borderRadius: '50px',
  height: '50px',
  width: '50px'
};

const txtStyle = {
  textAlign: 'left',
  marginLeft: '20px',
};

const hrStyle = {
  display: 'block',
  height: '1px',
	border: 0,
	borderBottom: '1px solid rgb(108, 123, 138,0.2)',
  margin: '1em 0',
  padding: 0
};

const nameStyle = {
  color: 'black',
  fontSize: '15px',
  fontWeight: 'bold',
  marginTop: '5px',
  marginBottom: '2px'
};

const msgStyle = {
  color: '#27d5db',
  fontSize: '13px',
  margin: '0',
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
	<div key={uid} className="msg-container">
	  <Link to={"/messages/" + uid}>
		<div style={divStyle}>
			<div className="author-container">
					<div className="rond"></div>
					<img alt="user icon" className="img" style={imgStyle} src={lastMessage.author.avatar} />
			</div>
			<div style={txtStyle}>
			<p style={nameStyle}>{lastMessage.author.firstname}</p>
			<p style={msgStyle}>{lastMessage.content}</p>
		</div>
		</div>
	  </Link>
	  <div style={hrStyle}></div>
	</div>
  ));
}

const MessagesIndex = () => {
  return (
	<div>
		<div id="messages-header">
	  	<Link to="/" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></Link>
	  	<p style={{fontSize: '15px'}}><strong>Discussions</strong></p>
		</div>
	  <MessagesList />
	  <Nav />
	</div>
  );
}

export default MessagesIndex;
