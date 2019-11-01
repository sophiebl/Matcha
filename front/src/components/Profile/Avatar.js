import React from 'react';

const Avatar = ({ src }) => {
    return (
        <img className="user-img" src={src} alt="user profile"/>
    );
}

export default Avatar;
