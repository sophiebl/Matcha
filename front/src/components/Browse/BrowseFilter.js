import React, { useState } from 'react';

import Slider, { Range } from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import './Browse.scss'

import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const BrowseFilter = () => {
    const wrapperStyle = { width: '80%', margin: 30 };
    const Handle = Slider.Handle;

    const [state, setState] = useState({
		first: true,
		bio: null,
		gender: null,
		tags: [],
		prefOrientation: null,
		prefAgeMin: 18,
		prefAgeMax: 25,
		prefDistance: 25,
		prefPop: 25,
		chips: [],
		lat: null,
		long: null,
		location: null,
	});

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

    const popularityHandle = (props) => {
		const { value, dragging, index, ...restProps } = props;
		return (
			<Tooltip
				prefixCls="rc-slider-tooltip"
				overlay={`${value} pts`}
				visible={true}
				placement="bottom"
				key={index}
			>
				<Handle value={value} {...restProps} />
			</Tooltip>
		);
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

    const onSliderPopChange = value => {
		setState({
			...state,
			prefPop: value,
		});
	};

    return <form id="form-browse">
        <div>
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
        </div>
        <div>
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
        </div>
        <div>
            <div style={wrapperStyle}>
				<p className="txt-left f-m">Popularité</p>
				<Slider min={5} max={200} defaultValue={state['prefPop']} handle={popularityHandle} step={5} onChange={onSliderPopChange}
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
        </div>
        <div>
            <label>Popularité</label>
            <input></input>
        </div>
        <div>
            <label>Tag</label>
            <input></input>
        </div>
    </form>
}

export default BrowseFilter;