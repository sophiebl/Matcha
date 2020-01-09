import React, { useState, useEffect } from "react";
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

const GET_IMGS = gql`
{
    Image {
        uid
        url
    }
}
`;



const UploadImages = (avatar) => {

    // const [images, setImages] = useState({
    //     first: true,
    //     img: [],
    // });
    // // const { loading, error, data } = useQuery(GET_IMGS);
    // console.log("get imgs");
    //     if (images['first'] === true) {
    //         if(data){
    //         console.log(data);
    //         console.log(data.Image[0].url);
    //         var imgDB = data.Image[0].url;
    //         console.log(imgDB);

    //         let img = [];
    //         for (const v of data.Image.values())
    //         {
    //             console.log('v', v.url);
    //             img.push(v.url);
    //         }
    //         setImages({
    //             first: false,
    //             img: v.url,
    //         });
    //     }
    // }
    avatar = avatar.location.state.avatar; 
    const [upload, setUpload] = useState(false);
    const [images, setImages] = useState([{avatar}]);
    const { loading, error, data } = useQuery(GET_IMGS);
    // if(data){
    //     console.log(data);
    //     console.log(data.Image[0].url);
    //     var imgDB = data.Image[0].url;
    //     console.log(imgDB);
    //     var imgDB2 = data.Image[1].url;
    // }
    // const [images, setImages] = useState([{avatar, imgDB}]);
    //     console.log(imgDB);

    const onError = data => console.log(data);

    const [addImg] = useMutation(ADD_IMG, {
        onError,
    });

    const [createImage] = useMutation(CREATE_IMG, {
        onCompleted: data => {
            // addImg({
            //     variables: {
            //         from: { uid: getCurrentUid() },
            //         // to: { uid: 'image-1' },
            //         to: {uid: uidImage}
            //     }
            // }
            //addImg();
            console.log("Completed", data);
        },
	    onError: data => {console.log('Error:', data)},
    });


    const onChange = e => {
        // if (e.size < 1000000) {

            const files = Array.from(e.target.files)
            files.forEach(file => {

                setUpload(true)

                const formData = new FormData()
                formData.append('upload_preset', 'dzhukajo');
                formData.append('file', file);
                formData.append('cloud_name', 'dtfunbpou');

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
                        // newImgs.push(image);
                        console.log("newImages", newImgs)
                        console.log("image en question", image.secure_url)
                        const uidImage = nextId('image-');
                        setImages(newImgs);
                        setUpload(false);
                        createImage({
                            variables: {
                                uid: uidImage,
                                url: image.secure_url,
                            }
                        })
                        addImg({
                                variables: {
                                    from: { uid: getCurrentUid() },
                                    to: { uid: uidImage },
                                }
                            }
                        )
                        newImgs.push(image);
                        // )
                    })
            });
    // /    }
    }

    const [removeImg] = useMutation(REMOVE_IMG, {
        onError,
    });

    const removeImage = (id) => {
        setImages(
            images.filter(image => image.public_id !== id)

            // removeImg({
            //         variables: {
            //             from: { uid: getCurrentUid() },
            //             to: { uid: uidImage },
            //         }
            //     }
            // )
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
    else return <UploadButton onChange={onChange} />
}

export default UploadImages;