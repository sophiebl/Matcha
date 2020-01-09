import React, { useState, useCallback } from "react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';

import { getCurrentUid } from '../../Helpers';

const REMOVE_IMG = gql`
	mutation RemoveUserImages($from: _UserInput!, $to: _ImageInput!) {
		RemoveUserImages(from: $from, to: $to) {
			from {
				images {
					uid
					url
				}
			}
		}
	}
`;

const Images = ({ images }) => {
	const [removeImg] = useMutation(REMOVE_IMG, {
		onError: data => console.log('Error: ', data),
	});

	const [getImages, setImages] = useState(images);

	const removeImage = (image, index) => {
		removeImg({
			variables: {
				from: { uid: getCurrentUid() },
				to: { uid: image.uid },
			}
		});
		images.splice(index, 1);
		setImages(images);
	}

	return <>
		{ getImages.map((image, index) =>
		<div key={index} className="fadein">
			<div onClick={() => removeImage(image, index)} className="delete">
				<FontAwesomeIcon icon={faTimesCircle} size="2x" />
			</div>
			<img src={image.url} alt="" className="user-img" />
		</div>
		) }
	</>
};

export default Images;
