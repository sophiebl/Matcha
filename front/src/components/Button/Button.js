import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Button = (props) => (
    <a href="" className={props.className}>
        <FontAwesomeIcon className="color-w" size="2x"  icon={['far', 'star']} />
    </a>      
);

export default Button;