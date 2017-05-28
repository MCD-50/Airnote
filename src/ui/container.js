import React, { Component, PropTypes } from 'react';
import { View, StatusBar } from 'react-native';

import styles from './../helpers/styles.js';

const propTypes = {
	children: PropTypes.node,
	color: PropTypes.string,
};

class Container extends Component {
	getColor() {
		if (this.props.color) {
			return this.props.color;
		}
		return '#2e3c98';
	}

	render() {
		return (
			<View style={styles.container_with_flex_1}>
				<StatusBar backgroundColor={this.getColor()} barStyle='light-content' />
				{this.props.children}
			</View>
		);
	}
}

Container.propTypes = propTypes;

export default Container;