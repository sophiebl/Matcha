import React from 'react';
import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getCurrentUid } from '../../Helpers';
import ConvItem from "./ConvItem";
import Nav from "../Nav/Nav";

import './Messages.scss'

const GET_CONVS = gql`
	query  {
	  me {
		uid
		conversations {
		  uid
		  members {
		    uid
		    username
			avatar
			isConnected
		  }
		  lastMessage {
			uid
			author {
			  uid
			  firstname
			  avatar
			  isConnected
			}
			content
		  }
		}
	  }
	}
  `;

const MessagesList = () => {
  const { loading, error, data } = useQuery(GET_CONVS, { fetchPolicy: 'cache-and-network' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const convs = data.me.conversations;
  console.log('convs', convs);
  return <>{ convs.map((conv, index) => <ConvItem key={index} conv={conv} />) }</>
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
