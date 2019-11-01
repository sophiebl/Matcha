import React from 'react';
import UserImg from './UserImg';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const MainInfos = (props) => {
    return (
        <div className="pos-rel img-container">
			{ props.isMyProfile ? (
                <div className="nav-user w-100">
                    <Link to="/preferences" className="btn bg-r btn-rond more">
						<FontAwesomeIcon className="color-w" size="lg" icon="plus" />
					</Link>
                    <Link to="#" className="btn bg-bg btn-rond image">
						<FontAwesomeIcon className="color-w" size="2x" icon="image" />
					</Link>
                </div>
			) : (
                <div className="nav-user w-100">
                    <div>
                        <FontAwesomeIcon className="icon white" icon={['fa', 'map-marker-alt']} />
                        <span className="icon-top">{props.prefRadius} Km</span>
                    </div>
                    <div>
                        <FontAwesomeIcon className="icon white" icon={['far', 'heart']} />
                        <span className="icon-top">{props.likesCount}</span>
                    </div>
                    <div>
                        <div className="rond"></div>
                    </div>
                </div>
			)}
            <UserImg avatar={props.avatar}/>
            <div className="main-infos">
                <div className="mb-5">
                    <h2>{props.firstname}</h2> 
                    <span className="f-base">Creative writter</span>
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