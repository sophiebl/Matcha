import React, { useState } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { gql } from "apollo-boost";
import { useQuery, useMutation } from '@apollo/react-hooks';

import FileBase64 from "./FileBase64";

const GET_IMGS = gql`
{
	me {
		images {
			uid
			src
		}
	}
}
`;

const ADD_IMG = gql`
	mutation uploadImage($src: String!) {
		uploadImage(src: $src) {
			uid
			src
		}
	}
`;

const REMOVE_IMG = gql`
	mutation deleteImage($uid: ID!) {
		deleteImage(uid: $uid) {
			uid
			src
		}
	}
`;

const Images = ({ getImages, setImages }) => {
	const [removeImg] = useMutation(REMOVE_IMG, {
		onError: data => console.log('Error: ', data),
	});

	const removeImage = (image, index) => {
		removeImg({
			variables: {
				uid: image.uid,
			}
		});

		getImages.splice(index, 1);
		setImages(getImages);
	}

	return <>
		{ getImages.map((image, index) =>
		<div key={index} className="fadein">
			<div onClick={() => removeImage(image, index)} className="delete">
				<FontAwesomeIcon icon={faTimesCircle} size="2x" />
			</div>
			<img src={image.src} alt="" className="user-img" />
		</div>
		) }
	</>
};

const handleFiles = (files, addImg) => {
	files.forEach((file) => {
		console.log(file);
		addImg({
			variables: {
				src: file.base64,
			}
		});
	});
}

const ProfileImages = () => {
	const { loading, error, data } = useQuery(GET_IMGS);

	const [mustRender, doRender] = useState(true);
	const [getImages, setImages] = useState([]);
	
	const [addImg] = useMutation(ADD_IMG, {
		onError: data => console.log('Error: ', data),
		onCompleted: data => {
			getImages.unshift(data.uploadImage);
			setImages(getImages);
			doRender(true);
		},
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error </p>;

	if (mustRender === true) {
		doRender(false);
		setImages(data.me.images);
	}

	return <>
		<Images getImages={getImages} setImages={setImages} />
		<FileBase64 multiple={true} onDone={(files) => handleFiles(files, addImg)}/>
	</>
}

export default ProfileImages;
