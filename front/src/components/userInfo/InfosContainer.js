import React from 'react';
import UserImg from './UserImg';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import LikeDislike from './LikeDislike';

const InfosContainer = () => {
    return (
        <div className="infos-container">
            <UserImg />
            <MainInfos />
            <Bio />
            <div className="tag-container">
                <Tag />
                <Tag />
                <Tag />
                <Tag />
                <Tag />
            </div>
            <LikeDislike />
        </div>
    );
}

export default InfosContainer;