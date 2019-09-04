import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";
import { ChatFeed, Message as ChatMessage } from 'react-chat-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jwt_decode from 'jwt-decode';

const getId = () => {
	try {
		return jwt_decode(localStorage.getItem('token')).uid
	}
	catch(error) {
		return null;
	}
}
const myuid = (getId());

const GET_CONV = gql`
	query Conversation($uid: ID) {
	  Conversation(uid: $uid) {
		members {
		  uid
		  firstname
		}
		messages(orderBy: uid_asc) {
		  uid
		  author {
			uid
			firstname
		  }
		  content
		}
	  }
	}
  `;

const Chat = ({ conv }) => {
  const messages = conv.messages.map(({author, content}) => (
	new ChatMessage({
	  id: (author.uid !== myuid) >>> 0,
	  message: content,
	})
  ));

  return (
	<ChatFeed
	  messages={messages}
	  isTyping={false}
	  hasInputField={false}
	  showSenderName
	  bubblesCentered={false}
	  bubbleStyles={
		{
		  text: {
			fontSize: 13
		  },
		  chatbubble: {
			borderRadius: 50,
			padding: 10
		  }
		}
	  }
	/>
  );
}

const Messages = ({ match }) => {
  const { loading, error, data } = useQuery(GET_CONV, {
	variables: {
	  'uid': match.params.uid,
	},
	fetchPolicy: 'cache-and-network',
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const members = data.Conversation[0].members.filter(m => (m.uid !== myuid)).map(m => m.firstname).join(', ');

  return (
	<div>
	  <Link to="/messages" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="3x" icon="angle-left" /></Link>
	  <p style={{fontSize: '15px', display: 'inline-block'}}><strong>{members}</strong></p>
	  <Chat conv={data.Conversation[0]}/>
	</div>
  );
}

export default Messages;
