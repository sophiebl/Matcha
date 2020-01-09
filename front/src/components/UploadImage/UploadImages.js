import React, { useState, useEffect, useCallback } from "react";
//import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from '@apollo/react-hooks';
import UploadSpinner from './UploadSpinner';
import Images from './Images';
import UploadButton from './UploadButton';
import nextId from "react-id-generator";
import { getCurrentUid } from '../../Helpers';

const CREATE_IMG = gql`
    mutation CreateImage($uid: ID!, $url: String!) {
        CreateImage(uid: $uid, url: $url) {
            uid
            url
        }
    }
`;

const ADD_IMG = gql`
	mutation AddUserImages($from: _UserInput!, $to: _ImageInput!) {
		AddUserImages(from: $from, to: $to) {
			from {
				images {
					uid
					url
				}
			}
		}
	}
`;

const GET_IMGS = gql`
{
	me {
		images {
			uid
			url
		}
	}
}
`;

const UploadImages = () => {
	const { loading, error, data } = useQuery(GET_IMGS);

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error </p>;

	return <Images images={data.me.images} />
}

export default UploadImages;
