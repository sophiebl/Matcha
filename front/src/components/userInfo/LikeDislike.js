import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LikeDislike = () => {
    return (
        <div className="valign">
            <div>
                <a href="" className="bg-g btn-rond dislike">
                    <FontAwesomeIcon className="color-w" size="3x" icon="times" />
                </a>      
            </div>
            <div>
                <a href="" className="bg-bg btn-rond like">
                    <FontAwesomeIcon className="color-w" size="3x"  icon={['far', 'star']} />
                </a>      
            </div>
        </div>
    );
}

export default LikeDislike;