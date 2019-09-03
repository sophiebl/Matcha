import React/*, { useState }*/ from 'react';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import LikeDislike from './LikeDislike';
import Nav from '../Nav';

import { useQuery } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const InfosContainer =  () => {
	const { loading, error, data } = useQuery(gql`
		{
			User {
				uid
				firstname
				lastname
				likesCount
				prefRadius
				tags{
					name
					uid
				}
			}
		}
	`);
    //const [users, setUsers] = useState([]);
    /*
    useEffect(() => {
        console.log(loading);
        if (loading === false) {
            setUsers(data.Users);
        }
        console.log(users);
        console.log(data.Users);
    }, [users, setUsers, loading, data.Users]);*/

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error </p>;
/*
    const HandleDelete = idUser => {
        const updatedUsers = [...data.Users];
        //console.log(updatedUsers);
        //console.log(idUser);
        const index = updatedUsers.findIndex(user => user.id === idUser);
        //console.log(index);
        updatedUsers.splice(index, 1);
        data.Users.splice(index, 1);
        setUsers(updatedUsers);
    }
   // console.log(data.Users);
*/
    return data.User.map(({ id, firstname, lastname, tags, likesCount, prefRadius }) => (
        <div className="infos-container" key={id}>
            <div>
                <MainInfos firstname={firstname} lastname={lastname} likesCount={likesCount} prefRadius={prefRadius}/>
                <Bio />
                <div className="tag-container">
                    {tags.map(tag => <Tag tagName={tag.name}/>)}
                </div>
                <LikeDislike idUser={id} /*onDelete={HandleDelete}*/ />
                <Nav/>
            </div>
        </div>
    ));
}

export default InfosContainer;
