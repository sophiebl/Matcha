import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Chips from 'react-chips';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const ME = gql`
		{
			me {
				uid
				bio
				gender
				tags {
					uid
					name
				}
				prefAgeMin
				prefAgeMax
				prefDistance
				prefOrientation
			}
		}
`;

const EDIT_PREFERENCES = gql`
	mutation UpdateUser($uid: ID!, $bio: String!, $gender: String!, $prefAgeMin: Int!, $prefAgeMax: Int!, $prefOrientation: String!, $prefDistance: Int!) {
		UpdateUser(uid: $uid, bio: $bio, gender: $gender, prefAgeMin: $prefAgeMin, prefAgeMax: $prefAgeMax, prefOrientation: $prefOrientation, prefDistance: $prefDistance) {
			uid
			bio
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

	const [state, setState] = useState({
		first: true,
		bio: null,
		gender: null,
		tagsNames: [],
		tags: [],
		prefOrientation: null,
		prefAgeMin: 18,
		prefAgeMax: 25,
		prefDistance: 25,
		chips: [],
	});

	const [editPreferences] = useMutation(EDIT_PREFERENCES, {
		onCompleted: (data) => {
			console.log("complete " + data);
			console.log(data.tags);
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
					checked={state[name] === label.toLowerCase().replace(' ', '-')}
					onChange={() => setState({ ...state, [name]: label.toLowerCase().replace(' ', '-') })}
				/>
				{label}
			</label>
		</div>
	);

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

	const onTextareaChange = (event) => {
		setState({
			...state,
			bio: event.target.value,
		});	
	}

	const { loading, error, data } = useQuery(ME);
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error </p>;

	if (state['first'] === true) {
		let tags = [];
		for (const v of data.me.tags.values())  //eslint-disable-line no-unused-vars
			tags.push(v.name.charAt(0).toUpperCase() + v.name.slice(1));
		setState({
			...state,
			first: false,
			bio: data.me.bio,
			gender: data.me.gender,
			tagsNames: tags,
			//tags: data.me.tags,
			prefOrientation: data.me.prefOrientation,
			prefAgeMin: data.me.prefAgeMin,
			prefAgeMax: data.me.prefAgeMax,
			prefDistance: data.me.prefDistance,
		});
	}

	return (
		<div className="settings">
			<Link to="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="3x" icon="times" /></Link>
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
					<Radio id={4} name="prefOrientation" label="Homme">Homme</Radio>
					<Radio id={5} name="prefOrientation" label="Femme">Femme</Radio>
					<Radio id={6} name="prefOrientation" label="Non binaire">Non binaire</Radio>
				</div>
			</div>

			<div style={wrapperStyle}>
				<p>Distance</p>
				<Slider min={5} max={200} defaultValue={state['prefDistance']} handle={distanceHandle} step={5} onChange={onSliderChange}/>
			</div>
			<div style={wrapperStyle}>
				<p>Age</p>
				<Range min={18} max={80} defaultValue={[state['prefAgeMin'], state['prefAgeMax']]} pushable={1} handle={ageHandle} onChange={onRangerChange}/>
			</div>

			<label>Bio</label>
			<br/>
			<textarea placeholder="Decrivez vous en quelques mots !" rows="4" cols="35" onChange={onTextareaChange} value={state['bio']}/>

			<Chips
				value={state['tagsNames']}
				onChange={(chips) => setState({ ...state, tagsNames: chips })}
				suggestions={["Sport", "Musique", "Dessin", "Art", "Nature", "Cinema", "Technologie", "Cosplay", "Science-fiction"]}
			/>

			<button onClick={() => editPreferences({
				variables: {
					uid: data.me.uid,
					bio: state['bio'],
					gender: state['gender'],
					tags: state['tags'],
					prefAgeMin: state['prefAgeMin'],
					prefAgeMax: state['prefAgeMax'],
					prefOrientation: state['prefOrientation'],
					prefDistance: state['prefDistance'],
				}
			})}>Enregistrer</button>

			</div>
	);
}

export default Preferences;