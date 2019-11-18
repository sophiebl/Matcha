import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Actions from "./Actions";
import Nav from "../Nav/Nav";
import './History.scss'

const History = () => (
	<div className="history">
		<Link to="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></Link>
		<h2>Historique</h2>

		<div>
		</div>

		<Nav />
	</div>
);

export default History;
