import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LikeDislike = ({uidUser, onDelete}) => (
    <div className="valign">
        <div>
            <button className="bg-g btn-rond dislike" onClick={() => onDelete(uidUser)}>
                <FontAwesomeIcon className="color-w" size="3x" icon="times" />
            </button>
        </div>
        <div>
            <button className="bg-bg btn-rond like" onClick={() => onDelete(uidUser)}>
                <FontAwesomeIcon className="color-w" size="3x" icon={['far', 'star']} />
            </button>
        </div>
    </div>
);

export default LikeDislike;