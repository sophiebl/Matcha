import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LikeDislike = ({ uidUser, dispatch }) => (
  <div className="valign">
    <div>
      <button className="bg-g btn-rond dislike" onClick={() => dispatch({ type: 'dislike' })}>
        <FontAwesomeIcon className="color-w" size="3x" icon="times" />
      </button>
    </div>
    <div>
      <button className="bg-bg btn-rond like" onClick={() => dispatch({ type: 'like' })}>
        <FontAwesomeIcon className="color-w" size="3x" icon={['far', 'star']} />
      </button>
    </div>
  </div>
);

export default LikeDislike;