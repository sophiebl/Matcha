import React from 'react';
import InfosContainer from '../userInfo/InfosContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faCoffee } from '@fortawesome/free-solid-svg-icons';

const Browse = () => {
    return (
        <div className="browse">
           <InfosContainer /> 
           <FontAwesomeIcon icon={['fab', 'apple']} />
        </div>
    );
}

export default Browse;