import React, { Component } from 'react';
import {
	Navigator,
} from 'react-native';

import ThemeProvider from './src/ui/custom/utils/themeprovider.js';

import MainPage from './src/ui/main.js';
import SplashPage from './src/ui/splash.js';
import EditPage from './src/ui/editnote.js';
import SettingPage from './src/ui/setting.js';


const uiTheme = {
	toolbar: {
		container: {
			height: 55,
		},
	},
};

class Airnote extends Component {
	constructor(params) {
		super(params);
	}

	renderScene(route, navigator) {
		let routeId = route.id;

		if (routeId == 1) {
			return (<SplashPage navigator={navigator} route={route} />);
		}
		else if (routeId == 2) {
			return (<MainPage navigator={navigator} route={route} />);
		}
		else if (routeId == 3) {
			return (
				<EditPage navigator={navigator} route={route} />
			);
		} else if (routeId == 4) {
			return (
				<SettingPage navigator={navigator} route={route} />
			);
		}
	}


	render() {
		return (
			<ThemeProvider uiTheme={uiTheme}>
				<Navigator initialRoute={{ id: '1', name: 'Splash' }}
					renderScene={this.renderScene.bind(this)}
					configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottomAndroid} />
			</ThemeProvider>
		)
	}

}

export default Airnote;