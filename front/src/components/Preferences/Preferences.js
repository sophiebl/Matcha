import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Chips from 'react-chips';
//import Avatar from '@material-ui/core/Avatar';
//import Chip from '@material-ui/core/Chip';
//import { withStyles } from "@material-ui/core/styles";
//import Button from "@material-ui/core/Button";
import './Preferences.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const ME_AND_TAGS = gql`
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

			Tag {
				uid
				name
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

const ADD_TAG = gql`
	mutation AddUserTags($from: _UserInput!, $to: _TagInput!) {
		AddUserTags(from: $from, to: $to) {
			from {
				tags {
					uid
					name
				}
			}
		}
	}
`;

const REMOVE_TAG = gql`
	mutation RemoveUserTags($from: _UserInput!, $to: _TagInput!) {
		RemoveUserTags(from: $from, to: $to) {
			from {
				tags {
					uid
					name
				}
			}
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

	const onError = data => console.log(data);

	const [editPreferences] = useMutation(EDIT_PREFERENCES, {
		onCompleted: data => {
			alert('Profil sauvegarde !');
		},
		onError,
	});

	const [addTag] = useMutation(ADD_TAG, {
		onError,
	});

	const [removeTag] = useMutation(REMOVE_TAG, {
		onError,
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

	const onSliderChange = value => {
		setState({
			...state,
			prefDistance: value,
		});
	};

	const onRangerChange = values => {
		setState({
			...state,
			prefAgeMin: values[0],
			prefAgeMax: values[1],
		});
	}

	const onTextareaChange = event => {
		setState({
			...state,
			bio: event.target.value,
		});	
	}

	const { loading, error, data } = useQuery(ME_AND_TAGS);
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
			tags: data.Tag,
			chips: tags,
			prefOrientation: data.me.prefOrientation,
			prefAgeMin: data.me.prefAgeMin,
			prefAgeMax: data.me.prefAgeMax,
			prefDistance: data.me.prefDistance,
		});
	}

	const onChipsChange = chips => {
		const added = chips.filter(x => !state['chips'].includes(x))[0];	
		const removed = state['chips'].filter(x => !chips.includes(x))[0];	

		const changedTag = state['tags'].filter(tag => tag['name'].toLowerCase() === (added || removed).toLowerCase())[0];
		if (changedTag === undefined)
			return;

		const payload = {
			variables: {
				from: { uid: data.me.uid },
				to: { uid: changedTag.uid },
			}
		}

		if (added !== undefined)
			addTag(payload);
		if (removed !== undefined)
			removeTag(payload);

		setState({
			...state,
			chips: chips
		});
	}

	return (
		<div className="settings">
			<Link to="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></Link>
			<h2>Preferences</h2>

			<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} className="valign-50">
				<div>
					<h4>Vous etes</h4>
					<Radio id={1} name="gender" label="Homme">Homme</Radio>
					<Radio id={2} name="gender" label="Femme">Femme</Radio>
					<Radio id={3} name="gender" label="Non binaire">Non binaire</Radio>
				</div>
				<div>
					<h4>Vous cherchez</h4>
					<Radio id={4} name="prefOrientation" label="Homme">Homme</Radio>
					<Radio id={5} name="prefOrientation" label="Femme">Femme</Radio>
					<Radio id={6} name="prefOrientation" label="Non binaire">Non binaire</Radio>
				</div>
			</div>

			<div style={wrapperStyle}>
				<p className="txt-left f-m">Distance</p>
				<Slider min={5} max={200} defaultValue={state['prefDistance']} handle={distanceHandle} step={5} onChange={onSliderChange}
					railStyle={{
						height: 10,
					}}
					handleStyle={[
						{
						backgroundColor: "#03DAC6",
						width: "20px",
						height: "20px",
						border: "1px solid #03DAC6",
						marginLeft: -6,
						marginTop: -5
						}
					]}
					trackStyle={[
						{
						marginTop: 0,
						height: 10,
						borderRadius: 15,
						background:
							"linear-gradient(to right, #03DAC6 0%, #03DAC6 100%)"
						}
					]}
				/>
			</div>
			<div style={wrapperStyle}>
				<p className="txt-left f-m">Age</p>
				<Range min={18} max={80} defaultValue={[state['prefAgeMin'], state['prefAgeMax']]} pushable={1} handle={ageHandle} onChange={onRangerChange}
					railStyle={{
						height: 10,
					}}
					handleStyle={[
						{
						backgroundColor: "#03DAC6",
						width: "20px",
						height: "20px",
						border: "1px solid #03DAC6",
						marginLeft: -6,
						marginTop: -5
						}
					]}
					trackStyle={[
						{
						marginTop: 0,
						height: 10,
						borderRadius: 15,
						background:
							"linear-gradient(to right, #03DAC6 0%, #03DAC6 100%)"
						}
					]}
				/>
			</div>

			<div>
				<p className="txt-left f-m bio-title">Bio</p>
				<textarea className="bio-area" placeholder="Decrivez vous en quelques mots !" rows="4" cols="35" onChange={onTextareaChange} value={state['bio']}/>
			</div>		

			<Chips
				value={state['chips']}
				onChange={onChipsChange}
				suggestions={state['tags'].map(tag => tag.name.charAt(0).toUpperCase() + tag.name.slice(1))}
			/>
			
			<button className="pref" onClick={() => editPreferences({
				variables: {
					uid: data.me.uid,
					bio: state['bio'],
					gender: state['gender'],
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
