import React from 'react';
import UserImg from './UserImg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const MainInfos = (props) => {
    return (
        <div className="pos-rel">
        <div className="nav-user">
            <FontAwesomeIcon className="icon white" icon={['fa', 'map-marker-alt']} />
            <div className="rond"></div>
        </div>
            <UserImg/>
            <div className="main-infos">
                <div>
                    <h2>{props.firstname}</h2> 
                   {/*} <h3>{props.lastname}</h3>*/}
                </div>
                <div>
                    <div></div>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    );
}

export default MainInfos;