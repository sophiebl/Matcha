import React, { useState } from 'react';

import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

/*
const GET_INFOS = gql`
    {
        me {
            uid
            firstname
            lastname
        }
    }
`;
*/

const EDIT_PREFERENCES = gql`
	mutation UpdateUser($uid: ID!, $gender: String!, $prefAgeMin: Int!, $prefAgeMax: Int!, $prefOrientation: String!, $prefDistance: Int!) {
		UpdateUser(uid: $uid, gender: $gender, prefAgeMin: $prefAgeMin, prefAgeMax: $prefAgeMax, prefOrientation: $prefOrientation, prefDistance: $prefDistance) {
			uid
			gender
			prefAgeMin
			prefAgeMax
			prefDistance
			prefOrientation
		}
	}
`;


const Preferences = () => {
    const wrapperStyle = { width: '80%', margin: 30 };
    const Handle = Slider.Handle;
    const distanceHandle = (props) => {
        const { value, dragging, index, ...restProps } = props;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={`${value} km`}
                visible={true}
                placement="bottom"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );
    };
    const ageHandle = (props) => {
        const { value, dragging, index, ...restProps } = props;
        return (
            <Tooltip
                prefixCls="rc-slider-tooltip"
                overlay={`${value} ans`}
                visible={true}
                placement="bottom"
                key={index}
            >
                <Handle value={value} {...restProps} />
            </Tooltip>
        );
    };

	const corr = {
		1: 'homme',
		2: 'femme',
		3: 'non-binaire'
	};
	const [checkeds, setCheckeds] = useState({ gender: null, orientation: null });
	const [editPreferences] = useMutation(EDIT_PREFERENCES, {
		onCompleted: (data) => {
			console.log("complete " + data);
		},
		onError: (data) => {
			console.log("error " + data);
		}
	});

	const Radio = ({ id, name, label, isSelected, onCheckboxChange }) => (
        <div>
            <label>
                <input
                    type="radio"
                    name={name}
					/*defaultChecked={isSelected}*/
					checked={checkeds[name] === id}
					onChange={() => setCheckeds({ ...checkeds, [name]: id })}
				/>
				{label}
            </label>
        </div>
    );

	const [state, setState] = useState({});
	const onSliderChange = (value) => {
		setState({
			...state,
			prefDistance: value,
		});
	};
	const onRangerChange = (values) => {
		setState({
			...state,
			prefAgeMin: values[0],
			prefAgeMax: values[1],
		});
	}
	
  return (
    <div className="settings">
        <h2>Preferences</h2>

        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <div>
                <h4>Vous etes</h4>
                <Radio id={1} name="gender" label="Homme">Homme</Radio>
                <Radio id={2} name="gender" label="Femme">Femme</Radio>
                <Radio id={3} name="gender" label="Non binaire">Non binaire</Radio>
            </div>
            <div style={{width: '15px'}}> </div>
            <div>
                <h4>Vous cherchez</h4>
                <Radio id={4} name="orientation" label="Homme">Homme</Radio>
                <Radio id={5} name="orientation" label="Femme">Femme</Radio>
                <Radio id={6} name="orientation" label="Non binaire">Non binaire</Radio>
            </div>
        </div>

        <div style={wrapperStyle}>
            <p>Distance</p>
			<Slider min={5} max={200} defaultValue={20} handle={distanceHandle} step={5} onChange={onSliderChange}/>
        </div>
        <div style={wrapperStyle}>
            <p>Age</p>
            <Range min={18} max={80} defaultValue={[25, 35]} pushable={1} handle={ageHandle} onChange={onRangerChange}/>
		</div>

		<button onClick={() => editPreferences({
			variables: {
				uid: "user-fvl84uzk16j2nsa",
				gender: corr[checkeds['gender']],
				prefAgeMin: state['prefAgeMin'],
				prefAgeMax: state['prefAgeMax'],
				prefOrientation: corr[checkeds['orientation'] - 3],
				prefDistance: state['prefDistance'],
			}
		})}>Enregistrer</button>
    </div>
  );
}

export default Preferences;
