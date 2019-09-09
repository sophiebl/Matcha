import React/*, { useState }*/ from 'react';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import LikeDislike from './LikeDislike';
import Nav from '../Nav';


const InfosContainer = (props) => {
  const { uid, firstname, lastname, tags, likesCount, prefRadius } = props.user;

  return (
    <div className="infos-container" key={uid}>
      <div>
        <MainInfos firstname={firstname} lastname={lastname} likesCount={likesCount} prefRadius={prefRadius} />
        <Bio />
        <div className="tag-container">
          {tags.map(tag => <Tag key={tag.uid} tagName={tag.name} />)}
        </div>
        <LikeDislike uidUser={uid} dispatch={props.dispatch} />
        <Nav />
      </div>
    </div>
  );
}

export default InfosContainer;
