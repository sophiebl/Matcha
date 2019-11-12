import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { gql } from "apollo-boost";
import { useMutation } from '@apollo/react-hooks';
import UploadSpinner from './UploadSpinner';
import Images from './Images';
import UploadButton from './UploadButton';

const UPLOADIMAGES = gql`
    mutation uploadImages($file: Upload!) {
            uploadImages(file: $file) {
                filename
        }
    }
`;

const UploadImages = (avatar) => {
    avatar = avatar.location.state.avatar; 

    const [upload, setUpload] = useState(false);
    const [images, setImages] = useState([{avatar}]);

    const onChange = e => {
        // if (e.size < 1000000) {

            const files = Array.from(e.target.files)
            files.forEach(file => {

                setUpload(true)

                const formData = new FormData()
                formData.append('upload_preset', 'dzhukajo');
                formData.append('file', file);
                formData.append('cloud_name', 'dtfunbpou');

                files.forEach((file, i) => {
                    formData.append(i, file)
                })

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
                        setImages(newImgs);
                        setUpload(false);
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