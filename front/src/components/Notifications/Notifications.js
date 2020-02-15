import React from 'react';
import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GET_NOTIFS = gql`
	query {
	  me {
		notifications {
		  uid
		  type
		  title
		  message
		}
	  }
	}
  `;

const Notification = ({ notif, last }) => {
  return (
	<>
	  <div>
		<p>{notif.title}</p>
		<p>{notif.message}</p>
	  </div>
	  {last ? null : <hr /> }
	</>
  );
}

const Notifications = () => {
  const { loading, error, data } = useQuery(GET_NOTIFS, { fetchPolicy: 'cache-and-network' });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const notifs = data.me.notifications || [];
  const last = notifs.length - 1;

  return (
	<div className="settings">
	  <a href="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></a>
	  <h2>Notifications</h2>
	  { notifs.map((notif, index) => <Notification key={index} notif={notif} last={index === last}/>) }
	</div>
  );
}

export default Notifications;
