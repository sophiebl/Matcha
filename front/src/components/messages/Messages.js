import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";
import { ChatFeed, Message as ChatMessage } from 'react-chat-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Chat = ({ conv }) => {
  const myid = 5; //TODO: Use real current user id

  const messages = conv.messages.map(({author, content}) => (
	new ChatMessage({
	  id: (author.id !== myid) >>> 0,
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
  const myid = 5; //TODO: Use real current user id

  const { loading, error, data } = useQuery(gql`
  {
	Conversation(id: ${match.params.id}) {
	  members {
		id
		firstname
	  }
	  messages(orderBy: id_asc) {
		id
		author {
		  id
		  firstname
		}
		content
	  }
	}
  }
  `, {fetchPolicy: 'cache-and-network',});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const members = data.Conversation[0].members.filter(m => (m.id !== myid)).map(m => m.firstname).join(', ');

  return (
	<div>
	  <Link to="/messages" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="3x" icon="angle-left" /></Link>
	  <p style={{fontSize: '15px', display: 'inline-block'}}><strong>{members}</strong></p>
	  <Chat conv={data.Conversation[0]}/>
	</div>
  );
}

export default Messages;
