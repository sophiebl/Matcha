import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LikeDislike = ({idUser, onDelete}) => (
    <div className="valign">
        <div>
            <button className="bg-g btn-rond dislike" onClick={() => onDelete(idUser)}>
                <FontAwesomeIcon className="color-w" size="3x" icon="times" />
            </button>
        </div>
        <div>
            <button className="bg-bg btn-rond like" onClick={() => onDelete(idUser)}>
                <FontAwesomeIcon className="color-w" size="3x" icon={['far', 'star']} />
            </button>
        </div>
    </div>
);

export default LikeDislike;