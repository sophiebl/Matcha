import React from 'react';
import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';

import useForm from 'react-hook-form';

import { ChatFeed, Message as ChatMessage } from 'react-chat-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCurrentUid } from '../../Helpers';

import '../MessagesIndex/Messages.scss'

const GET_CONV = gql`
	query Conversation($uid: ID) {
	  Conversation(uid: $uid) {
		uid
		members {
		  uid
		  username
		  isConnected
		}
		messages(orderBy: uid_asc) {
		  uid
		  author {
			uid
			username
			avatar
			isConnected
		  }
		  content
		}
	  }
	}
  `;

const USER_STATE_CHANGED = gql`
	subscription userStateChanged($uid: ID!) {
		userStateChanged(uid: $uid) {
			state
		}
	}
`;

const SEND_MESSAGE = gql`
		mutation sendMessage($convUid: ID!, $message: String!) {
		  sendMessage(convUid: $convUid, message: $message)
		}
`;

const Chat = ({ conv }) => {
  const externalMembers = (conv.members.filter(member => member.uid !== getCurrentUid()));

  const { error, data } = useSubscription(USER_STATE_CHANGED, { variables: { uid: externalMembers[0].uid } });
  if (error) return <span>Subscription error!</span>;
  if (data) console.log(data);

  const messages = conv.messages.map(({ author, content }) => (
	new ChatMessage({
		id: (author.uid === getCurrentUid()) ? 0 : 1,
	  message: content,
	})
  ));

  const connected = (data ? data.userStateChanged.state : externalMembers[0].isConnected);

  return <>
	<div className={`rond ${connected ? "online" : "offline"}`}></div>
	<ChatFeed
	  messages={messages}
	  isTyping={false}
	  hasInputField={false}
	  showSenderName
	  bubblesCentered={false}
	  bubbleStyles={
		{
		  text: {
			fontSize: 12,
			fontWeight: 600
		  },
		  chatbubble: {
			background: 'linear-gradient(162.6deg, #2DC9EB 0%, #14D2B8 100%)',
			borderRadius: 50,
			padding: '15px 25px',
		  }
		}
	  }
	/>
  </>;
}

const Messages = ({ match }) => {
  const { loading, error, data } = useQuery(GET_CONV, {
	variables: {
	  'uid': match.params.uid,
	},
	fetchPolicy: 'cache-and-network',
  });

  const { register, handleSubmit, errors } = useForm();

  const [sendMessage] = useMutation(SEND_MESSAGE,
	{
	  onCompleted: data => {
		//TODO: ?
		window.location = window.location;
	  },
	  onError: data => {
		switch (data.message.split(':', 2)[1].trim()) {
		  case 'UnknownUsername':
			alert("Nom d'utilisateur inconnu.");
			break;
		  default:
			console.log(data);
		}
	  }
	});

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const members = data.Conversation[0].members.filter(m => (m.uid !== getCurrentUid())).map(m => m.username).join(', ');

  const onSubmit = inputs => {
	sendMessage({
	  variables: {
		convUid: data.Conversation[0].uid,
		//userUid: data.Conversation[0].members.filter(m => (m.uid !== getCurrentUid()))[0].uid,
		message: inputs.message,
	  }
	});
  };

  return (
		<div id="messages-container">
			<Link to="/messages" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="angle-left" /></Link>
			<p style={{fontSize: '15px', display: 'inline-block'}}><strong>{members}</strong></p>
			<Chat conv={data.Conversation[0]}/>
		    <form method="POST" onSubmit={handleSubmit(onSubmit)}>
		      <input type="text" name="message" placeholder="message" ref={register({ required: true })} required/>
		      {errors.message && 'Message is required.'}
		      <button>Envoyer</button>
		    </form>
		</div>
  );
}

export default Messages;
