import React, { useState } from "react";
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
/*
const UploadImages = () => {
    return (   
        <UploadButton mutation={UPLOADIMAGES}>
          {uploadImages => (
            <input
            type="file"
            required
            onChange={({ target: { validity, files: [file] } }) =>
              validity.valid && UploadImages({ variables: { file } })
            }
           />
          )}
        </UploadButton>
      );
}

*/
const UploadImages = () => {
    console.log('env : '+process.env.REACT_APP_API_IMG_URL);
    
    const [state, setState] = useState(
        { first: true, uploading: false, images: ['sss'] }
    );

	//if (state['first'] === true) {
        
   // }
    const onChange = e => {
        const files = Array.from(e.target.files)
        files.forEach(file => {

            //setState({ uploading: true })

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
                    console.log(image);
                    console.log(state);
                    setState({
                        uploading: false,
                        images: ['eeeee', 'eergrg']
                    })
                    console.log(state);
                })
        });
    }

    const removeImage = id => {
        setState({
            images: state.filter(image => image.public_id !== id)
        })
    }

    const { uploading, images } = state

    const content = () => {
        switch(true) {
            case uploading:
                return <UploadSpinner/>
            case images.length > 0:
                return <Images images={images} removeImage={removeImage} />
            default:
                return <UploadButton onChange={onChange} /> 
        }
    }

    return (
        <div>
            <div className='buttons'>
                {content()}
            </div>
        </div>
    )
}

export default UploadImages;

/*
export default class UploadImages extends React.Component {

    state = {
        uploading: false,
        images: []
    }

    onChange = e => {
        const files = Array.from(e.target.files)
        this.setState({ uploading: true })

        const formData = new FormData()

        files.forEach((file, i) => {
            formData.append(i, file)
        })

       fetch(`${REACT_APP_API_IMG_URL}/image-upload`, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(images => {
            this.setState({
                uploading: false,
                images
            })
        })
    }

    removeImage = id => {
        this.setState({
            images: this.state.images.filter(image => image.public_id !== id)
        })
    }

    render() {
        const { uploading, images } = this.state

        const content = () => {
            switch(true) {
                case uploading:
                    return <UploadSpinner/>
                case images.length > 0:
                    return <Images images={images} removeImage={this.removeImage} />
                default:
                    return <UploadButton onChange={this.onChange} /> 
            }
        }

        return (
            <div>
                <div className='buttons'>
                    {content()}
                </div>
            </div>
        )
    }
}
*/
//export default UploadImages;

/*
export default class UploadImages extends React.Component {

    state = {
        uploading: false,
        images: []
    }

    onChange = e => {
        const files = Array.from(e.target.files)
        this.setState({ uploading: true })

        const formData = new FormData()

        files.forEach((file, i) => {
            formData.append(i, file)
        })

        fetch(`${REACT_APP_API_IMG_URL}/image-upload`, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(images => {
                this.setState({
                    uploading: false,
                    images
                })
            })
    }

    removeImage = id => {
        this.setState({
            images: this.state.images.filter(image => image.public_id !== id)
        })
    }

    render() {
        const { uploading, images } = this.state

        const content = () => {
            switch (true) {
                case uploading:
                    return <UploadSpinner />
                case images.length > 0:
                    return <Images images={images} removeImage={this.removeImage} />
                default:
                    return <UploadButton onChange={this.onChange} />
            }
        }

        return (
            <div>
                <div className='buttons'>
                    {content()}
                </div>
            </div>
        )
    }
}
*/