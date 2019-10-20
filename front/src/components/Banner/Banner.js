import React from 'react';
import './Banner.scss'
import ReactDOM from 'react-dom';
//import React, { useState } from 'react';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Banner = ({ isShowing, show, content }) => isShowing ? ReactDOM.render(
    <div className="banner">
        {content}
    </div>, document.getElementById('signup-banner')
) : null;

export default Banner;
