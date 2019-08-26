import React from 'react';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import LikeDislike from './LikeDislike';
import Nav from '../Nav';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const InfosContainer = () => {
    const { loading, error, data } = useQuery(gql`
        {
            Users {
                id
                firstname
                lastname
                likesCount
                prefRadius
                tags{
                    name
                    id
                }
            }
        }
    `);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error </p>;

    return data.Users.map(({ id, firstname, lastname, tags, likesCount, prefRadius }) => (
            <div className="infos-container">
                <MainInfos firstname={firstname} lastname={lastname} likesCount={likesCount} prefRadius={prefRadius}/>
                <Bio />
                <div className="tag-container">
                    {tags.map(tag => <Tag tagName={tag.name}/>)}
                    <Tag tagName="hello"/>
                    <Tag tagName="hello"/>
                    <Tag tagName="hello"/>
                    <Tag tagName="hello koko"/>
                    <Tag tagName="hello"/>
                    <Tag tagName="Say hello"/>
                </div>
                <LikeDislike />
           <Nav/>
            </div>
    ));
}

export default InfosContainer;