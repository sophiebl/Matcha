import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Nav = () => {
    return (
        <div className="nav">
            <a href="" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" size="2x" icon={['far', 'heart']} />
            </a>
            <a href="" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" size="2x" icon={['far', 'heart']} />
            </a>
            <a href="" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" size="2x" icon={['far', 'heart']} />
            </a>
            <a href="" classsName="link">
                <FontAwesomeIcon className="icon color-dg mh-30" size="2x" icon={['far', 'heart']} />
            </a>
        </div>
    );
}

export default Nav;