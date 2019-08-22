import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


/*props class concatenation*/

const Button = (props) => (
    <a href="" className={props.className}>
        <FontAwesomeIcon className="color-w" size="2x"  icon={['far', 'star']} />
    </a>      
);

export default Button;