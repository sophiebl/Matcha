import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Chips from 'react-chips';
import './Preferences.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';

import { store } from 'react-notifications-component';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const ME_AND_TAGS = gql`
		{
			me {
				uid
				bio
				birthdate
				gender
				tags {
					uid
					name
				}
				prefAgeMin
				prefAgeMax
				prefDistance
				prefOrientation
				lat
				long
				location
			}

			Tag {
				uid
				name
			}
		}
`;

const EDIT_PREFERENCES_WITH_LOC = gql`
	mutation UpdateUser($uid: ID!, $bio: String!, $gender: String!, $prefAgeMin: Int!, $prefAgeMax: Int!, $prefOrientation: String!, $prefDistance: Int!, $lat: String!, $long: String!, $location: String!) {
		UpdateUser(uid: $uid, bio: $bio, gender: $gender, prefAgeMin: $prefAgeMin, prefAgeMax: $prefAgeMax, prefOrientation: $prefOrientation, prefDistance: $prefDistance, lat: $lat, long: $long, location: $location) {
			uid
			bio
			gender
			prefAgeMin
			prefAgeMax
			prefDistance
			prefOrientation
			lat
			long
			location
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


const Preferences = (props) => {
	const wrapperStyle = { width: '80%', margin: 30 };
	const Handle = Slider.Handle;

	useEffect(() => {
		if(props && props.location && props.location.state && props.location.state.notif) {
			if (props.location.state.notif === true && state['first'] === false){
				store.addNotification({
					title: "Votre profil est incomplet",
					message: "Veuillez remplir votre profil pour pouvoir matcher des utilisateurs",
					type: 'danger',
					container: 'bottom-left',
					animationIn: ["animated", "fadeIn"],
					animationOut: ["animated", "fadeOut"],
					dismiss: { duration: 3000 },
				});
			}
		}
	}, [ props ]);

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
		tags: [],
		prefOrientation: null,
		prefAgeMin: 18,
		prefAgeMax: 25,
		prefDistance: 25,
		chips: [],
		lat: null,
		long: null,
		location: null,
	});

	const onError = data => console.log(data);

	const [editPreferences] = useMutation(EDIT_PREFERENCES, {
		onCompleted: data => {
			alert('Profil sauvegarde !');
		},
		onError,
	});

	const [editPreferencesWithLoc] = useMutation(EDIT_PREFERENCES_WITH_LOC, {
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

	const Radio = ({ name, label }) => {
		let slabel = label.toLowerCase().replace(' ', '-');

		return (
			<div>
				<label>
					<input
						type="radio"
						name={name}
						checked={state[name] === slabel}
						onChange={() => setState({ ...state, [name]: slabel })}
					/>
					{label}
				</label>
			</div>
		)
	};

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

	const [isClicked, setClicked] = useState(false);
	const [isLocation, setLocation] = useState({
		lat: null,
		long: null,
		location: null,
	});

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
			lat: data.me.lat,
			long: data.me.long,
			location: data.me.location,
		});
	}

	const showPosition = async position => {
        const obj = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lon=${position.coords.longitude}&lat=${position.coords.latitude}`
        );
        const data = await obj.json();
        let location = '';
        if (data.address.city_district)
            location = data.address.city_district;
        else
			location = data.address.city;
		setLocation({...isLocation,
			lat: data.lat,
			long: data.lon,
			location: location,
		});
    };

    const getLocation = () => {
        if (navigator.geolocation) {
			setClicked(true);
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            //setClicked(false);
            console.log("Geolocation is not supported by this browser.");
        }
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

	const checkWithLoc = (state['bio'] === null || state['gender'] === null || state['prefAgeMin'] === null|| state['prefAgeMax'] === null|| state['prefOrientation'] === null || state['prefDistance'] === null
		|| isLocation.lat === null || isLocation.long === null || isLocation.location === null);

	const check = (state['bio'] === null || state['gender'] === null || state['prefAgeMin'] === null|| state['prefAgeMax'] === null|| state['prefOrientation'] === null || state['prefDistance'] === null);

	return (
		<div className="settings">
			<Link to="/profile" style={{color: 'black', display: 'inline-block', float: 'left'}}><FontAwesomeIcon size="2x" icon="times" /></Link>
			<h2>Preferences</h2>

			<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}} className="valign-50">
				<div>
					<h4>Vous etes</h4>
					<Radio id={1} name="gender" label="Homme" />
					<Radio id={2} name="gender" label="Femme" />
					<Radio id={3} name="gender" label="Non binaire" />
				</div>
				<div>
					<h4>Vous cherchez</h4>
					<Radio id={4} name="prefOrientation" label="Homme" />
					<Radio id={5} name="prefOrientation" label="Femme" />
					<Radio id={6} name="prefOrientation" label="Peu importe" />
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
				<textarea className="bio-area" placeholder="Decrivez vous en quelques mots !" rows="4" cols="35" onChange={onTextareaChange} value={state['bio'] || ''}/>
			</div>		

			<Chips
				value={state['chips']}
				onChange={onChipsChange}
				suggestions={state['tags'].map(tag => tag.name.charAt(0).toUpperCase() + tag.name.slice(1))}
			/>

			<div>
				<p className="localisation">Localisation: </p>
				{!isClicked && (<button className="get-loc" onClick={getLocation}>Get my location</button>)}
				{(isClicked === true) && (<span>{isLocation.location}</span>)}
			</div>		

			{(isClicked === true && (
				<button className="pref" onClick={() => !checkWithLoc ? editPreferencesWithLoc({
					variables: {
						uid: data.me.uid,
						bio: state['bio'],
						gender: state['gender'],
						prefAgeMin: state['prefAgeMin'],
						prefAgeMax: state['prefAgeMax'],
						prefOrientation: state['prefOrientation'],
						prefDistance: state['prefDistance'],
						lat: isLocation.lat,
						long: isLocation.long,
						location: isLocation.location,
					}
				}) : store.addNotification({
					title: "Votre profil est incomplet",
					message: "Veuillez remplir tous les champs",
					type: 'danger',
					container: 'bottom-left',
					animationIn: ["animated", "fadeIn"],
					animationOut: ["animated", "fadeOut"],
					dismiss: { duration: 3000 },
				})}>Enregistrer</button>
			))}

			{(!isClicked && (
				<button className="pref" onClick={() => !check ? editPreferences({
					variables: {
						uid: data.me.uid,
						bio: state['bio'],
						gender: state['gender'],
						prefAgeMin: state['prefAgeMin'],
						prefAgeMax: state['prefAgeMax'],
						prefOrientation: state['prefOrientation'],
						prefDistance: state['prefDistance'],
					}
				}) : store.addNotification({
					title: "Votre profil est incomplet",
					message: "Veuillez remplir tous les champs",
					type: 'danger',
					container: 'bottom-left',
					animationIn: ["animated", "fadeIn"],
					animationOut: ["animated", "fadeOut"],
					dismiss: { duration: 3000 },
				})}>Enregistrer</button>
			))}
		</div>
	);
}

export default Preferences;
