import React from 'react';
import { Link } from 'react-router-dom';

import { gql } from "apollo-boost";
import { useQuery, useMutation } from '@apollo/react-hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GET_REPORTS = gql`
	query {
	  getReportedUsers {
		uid
		username
	  }
	}
  `;

const BAN_USER = gql`
	mutation banUser($uid: ID!) {
	  banUser(uid: $uid)
	}
  `;

const Report = ({ user, banUser }) => {
  const ban = (uid) => {
	console.log('ban', uid);
	banUser({
	  variables: {
		uid: uid,
	  }
	});
	window.location.reload();	
  }

  return (
	<div>
	  - {user.username} <FontAwesomeIcon icon="trash" size="2x" onClick={() => ban(user.uid)}></FontAwesomeIcon>
	</div>
  );
}

const AdminReports = () => {
  const { loading, error, data } = useQuery(GET_REPORTS);
  const [banUser] = useMutation(BAN_USER);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
	<div className="settings">
	  <Link to="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></Link>
	  <h2>Reports</h2>
	  { data.getReportedUsers ? (data.getReportedUsers.map((user, index) => <Report key={index} user={user} banUser={banUser} />)) : "Aucun report" }
	</div>
  );
}

export default AdminReports;
