import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Actions from "./Actions";
import Nav from "../Nav/Nav";
import './History.scss'

const History = () => {

	const [mode, setMode] = useState("own");

	return (
		<div className="history">
			<Link to="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></Link>
			<h2>Historique</h2>

			<div>
				<div className="history-sections">
					<a href="#me" onClick={() => setMode("own")}>Moi</a>
					<a href="#others" onClick={() => setMode("others")}>Mes matchs</a>
				</div>
				<div className="history-sections">
					<Actions mode={mode}/>
				</div>
			</div>
			<Nav />
		</div>
	);
}

export default History;
