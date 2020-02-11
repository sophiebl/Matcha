import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { StoreContext } from '../App/Store';

import './Nav.scss'

const Nav = () => {
	const { notifs } = useContext(StoreContext);

	return (
        <div className="nav">
			{notifs.getCount}

			{/*
			<Link to="/" className="link">
                <FontAwesomeIcon className="icon color-dg mh-30" icon={['fa', 'shopping-cart']} />
			</Link>
			*/}

			<Link to="/likes" className="link">
                <FontAwesomeIcon className="icon color-dg" icon={['far', 'heart']} />
			</Link>
			
			<Link to="/browse" className="link">
                <FontAwesomeIcon className="icon color-dg" icon={['fas', 'users']} />
			</Link>

			<Link to="/messages" className="link">
                <FontAwesomeIcon className="icon color-dg" icon={['far', 'comment-alt']} />
			</Link>
			
			<Link to="/profile" className="link">
                <FontAwesomeIcon className="icon color-dg" icon={['far', 'user']} />
			</Link>
        </div>
    );
}

export default Nav;
