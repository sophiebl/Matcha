import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from '@apollo/react-hooks';
import UploadSpinner from './UploadSpinner';
import Images from './Images';
import UploadButton from './UploadButton';
//import uniqid from 'uniqid';
import { getCurrentUid } from '../../Helpers';
/*
const UPLOADIMAGES = gql`
    mutation uploadImages($file: Upload!) {
            uploadImages(file: $file) {
                filename
        }
    }
`;
*/

const ME_AND_IMAGES = gql`
		{
			me {
				uid
				gender
				images {
					uid
					url
				}
			}

			Image {
				uid
				url
			}
		}
`;

const CREATE_IMG = gql`
	mutation CreateImage($uid: ID!, $url: String!) {
		CreateImage(uid: $uid, url: $url)
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



const UploadImages = (avatar) => {
    avatar = avatar.location.state.avatar; 
    // const { loading, error, data } = useQuery(ME_AND_IMAGES);
	// if (loading) return <p>Loading...</p>;
	// if (error) return <p>Error </p>;

    const [upload, setUpload] = useState(false);
    const [images, setImages] = useState([{avatar}]);
    // const [user, setUser] = useState({
	// 	//first: true,
    //     gender: null,
    //     images: [],
	// });

    const onError = data => console.log(data);

    const [addImg] = useMutation(ADD_IMG, {
        onError,
    });

    const onChange = e => {
        // if (e.size < 1000000) {
            // setUser({
            //     ...user,
            //     //first: false,
            //     gender: data.me.gender,
            //     images: data.Image,
            // });
			//const uidImage = uniqid('image-');

            const files = Array.from(e.target.files)
            files.forEach(file => {

                setUpload(true)

                const formData = new FormData()
                formData.append('upload_preset', 'dzhukajo');
                formData.append('file', file);
                formData.append('cloud_name', 'dtfunbpou');

                /*files.forEach((file, i) => {
                    formData.append(i, file)
                })*/

                fetch(`${process.env.REACT_APP_API_IMG_URL}`, {
                    method: 'POST',
                    body: formData
                })
                    .then(res => res.json())
                    .then(image => {
                        let newImgs = images;
                        // if (newImgs.length >= 5) {
                        //     newImgs[newImgs.length - 1] = image;
                        // } else {
                        //     newImgs.push(image);
                        // }
                        newImgs.push(image);
                        console.log("newImages", newImgs)
                        console.log("image en question", image.secure_url)
                        setImages(newImgs);
                        setUpload(false);
		                // const changedImage = images.filter(image => image['url'].toLowerCase() === (added || removed).toLowerCase())[0];
		                // if (changedImage === undefined)
                        //  	return;
                        createImg({
                            variables: {
                                //from: { uid: 'user-7t71gvk2rjpuvf' },
                                from: { uid: getCurrentUid() },
                                // to: { uid: changedImage.uid },
                                 to: { uid: 'image-1' },
                                //to: {uid: uidImage},
                            }
                        }
                        )
                        //create img avec id rand et url
                        //add Img dans OnCompleted
                        addImg({
                                variables: {
                                    //from: { uid: 'user-7t71gvk2rjpuvf' },
                                    from: { uid: getCurrentUid() },
                                    // to: { uid: changedImage.uid },
                                     to: { uid: 'image-1' },
                                    //to: {uid: uidImage},
                                }
                            }
                        )
                        console.log('OK')
                        // )
                    })
            });
    // /    }
    }

    const removeImage = id => {
        setImages(
            images.filter(image => image.public_id !== id)
        )
    }

    if (upload)
        return <UploadSpinner />
    else if (!upload && images.length >= 5)
        return <Images images={images} removeImage={removeImage} />
    else if (!upload && images.length < 5) {
        return  <div>
                    <Images images={images} removeImage={removeImage} />
                    <UploadButton onChange={onChange} />
                </div>
    }
    else 
        return <UploadButton onChange={onChange} />
}

export default UploadImages;