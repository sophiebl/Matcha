import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Nav = () => {
    return (
        <div className="nav">
			<a href="/" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" icon={['fa', 'shopping-cart']} />
            </a>
			<a href="/likes" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" icon={['far', 'heart']} />
            </a>
			<a href="/messages" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" icon={['far', 'comment-alt']} />
            </a>
			<a href="/profile" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" icon={['far', 'user']} />
            </a>
        </div>
    );
}

export default Nav;
