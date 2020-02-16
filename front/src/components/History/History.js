import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { gql } from "apollo-boost";
import { useQuery } from '@apollo/react-hooks';

// import Actions from "./Actions";
import Nav from "../Nav/Nav";
import './History.scss'

const GET_MY_ACTIONS = gql`
	{
		me {
			uid

			likedUsers {
				uid
				username
			}

			visitedUsers {
				uid
				username
			}

		}
	}
`;

const div = (users, history) => <>
	{ users.map(({ uid, username }) => (
		<div className="action" key={uid} onClick={() => history.push("/browse/" + username)}>
			{username}
		</div>
	))}
</>

const History = () => {

	// const [mode, setMode] = useState("own");
	const { loading, error, data } = useQuery(GET_MY_ACTIONS);
	const history = useHistory();
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error :(</p>;
		console.log(data);

	return (
		<div className="history">
			<Link to="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></Link>
			<h2>Historique</h2>

			<div className="history-container valign50">
				<div className="history-sections">
					{/* <a href="#me" onClick={() => setMode("own")}>Profils visités</a> */}
					{/* <a href="#others" onClick={() => setMode("others")}>Profils likés</a> */}
					<a href="#me">Profils visités</a>
					{ div(data.me.likedUsers, history) }
				</div>
				<div className="history-sections hs2">
					<a href="#others">Profils likés</a>
					{ div(data.me.visitedUsers, history) }
				</div>
			</div>
			<Nav />
		</div>
	);
}

export default History;
