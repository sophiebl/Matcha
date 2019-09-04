import React/*, { useState }*/ from 'react';
import MainInfos from './MainInfos';
import Bio from './Bio';
import Tag from './Tag';
import LikeDislike from './LikeDislike';
import Nav from '../Nav';


const InfosContainer = (props) => {
	
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

    const { uid, firstname, lastname, tags, likesCount, prefRadius } = props.user;

    return (
        <div className="infos-container" key={uid}>
            <div>
                <MainInfos firstname={firstname} lastname={lastname} likesCount={likesCount} prefRadius={prefRadius}/>
                <Bio />
                <div className="tag-container">
                    {tags.map(tag => <Tag key={tag.uid} tagName={tag.name}/>)}
                </div>
                <LikeDislike uidUser={uid} /*onDelete={HandleDelete}*/ />
                <Nav/>
            </div>
        </div>
    );
}

export default InfosContainer;
