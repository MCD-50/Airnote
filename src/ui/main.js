import React, { Component, PropTypes } from 'react';
import {
	Navigator,
	ListView,
	StyleSheet,
	View,
	Text,
	Linking,
} from 'react-native';



const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	listItemContainer: {
		flex: 1,
		marginLeft: SIDEMARGIN,
		marginRight: SIDEMARGIN,
		padding: UPDOWNMARGIN,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},

	headerText: {
		fontSize: 17,
		fontWeight: '400',
		color: 'black',
	},

	subText: {
		marginTop: 2,
		fontSize: 14,
		fontWeight: 'normal',
		color: '#757575'
	}
});


const propTypes = {
	navigator: PropTypes.object.isRequired,
	route: PropTypes.object.isRequired,
};

const menuItems = ['Share this app', 'Rate this app', 'Settings']

import Toolbar from './custom/toolbar.js';
import Container from './container.js';
import ActionButton from './custom/actionbutton.js';
import Card from './custom/card.js';

import SettingPage from './setting.js';
import { setData, getStoredDataFromKey } from '../helpers/appstore.js';
import { SIDEMARGIN, UPDOWNMARGIN, FONTSIZE } from '../helpers/constant.js';
import DatabaseHelper from '../helpers/database.js';
import { Note } from '../model/note.js';
import Communications from 'react-native-communications';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });
let last = -1;

class MainPage extends Component {
	constructor(params) {
		super(params);
		this.state = {
			dataSource: ds.cloneWithRows([]),
			searchText: '',
			isLoading: true,
			isLoaded: false,
			isEmpty: false,
		}

		this.callback = this.callback.bind(this);
		this.onChangeText = this.onChangeText.bind(this);
		this.renderListItem = this.renderListItem.bind(this);

		this.renderEmptyMessage = this.renderEmptyMessage.bind(this);

		this.createViewAndEditNote = this.createViewAndEditNote.bind(this);
		this.setDataToDatabase = this.setDataToDatabase.bind(this);
	}


	componentWillMount() {
		this.setDataToDatabase();
	}

	setDataToDatabase() {
		DatabaseHelper.getAllNotes((notes) => {
			this.setState({
				dataSource: (notes.length > 0) ? ds.cloneWithRows(notes) : ds.cloneWithRows([]),
				isLoaded: true,
				isLoading: false,
				isEmpty: (notes.length > 0) ? false : true
			});
		})
	}

	callback() {
		this.setDataToDatabase();
	}

	renderListItem(item) {
		let searchText = this.state.searchText.toLowerCase();

		if (searchText.length > 0 && item.description.toLowerCase().indexOf(searchText) < 0) {
			return null;
		}

		return (
			<Card style={{
				minHeight: 50,
				justifyContent: 'center'}}
				onPress={() => this.createViewAndEditNote(item)}>
				<View style={styles.listItemContainer}>
					<Text style={[styles.headerText,]}>
						{item.title}
					</Text>
					<Text style={styles.subText}>
						{item.description.substring(0, 50) + '...'}
					</Text>
					<Text style={styles.subText}>
						{item.createdOn}
					</Text>
				</View>
			</Card>
		);
	}

	createViewAndEditNote(item) {
		getStoredDataFromKey(FONTSIZE).then((val) => {
			if (val)
				this.props.navigator.push({ id: '3', name: 'New Note', data: item, 'callback': this.callback, textSize: val })
			else
				this.props.navigator.push({ id: '3', name: 'New Note', data: item, 'callback': this.callback, textSize: 16 })
		})
	}

	renderEmptyMessage() {
		if (this.state.isEmpty)
			return (<Text style={[styles.subText, { fontSize: 15, marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5 }]}>Its empty here. Add a few notes to get started.</Text>)
	}

	onChangeText(newText) {
		this.setState({ searchText: newText });
	}


	render() {
		return (
			<Container>
				<Toolbar
					centerElement={this.props.route.name}
					searchable={{
						autoFocus: true,
						placeholder: 'Search note...',
						onChangeText: (value) => this.onChangeText(value),
						onSearchClosed: () => this.setState({ searchText: '' }),
					}}
					rightElement={{
						menu: { labels: menuItems },
					}}

					onRightElementPress={(action) => {
						if (menuItems[action.index] === 'Settings') {
							getStoredDataFromKey(FONTSIZE).then((val) => {
								if (val)
									this.props.navigator.push({ id: '4', name: 'Settings', textSize: val })
								else
									this.props.navigator.push({ id: '4', name: 'Settings', textSize: '16' })
							})
						} else if (menuItems[action.index] === 'Share this app') {
							Communications.email(null, null, null, null, 'http://play.google.com/store/apps/details?id=com.air.airnote');
						} else if (menuItems[action.index] === 'Rate this app') {
							Linking.openURL('market://details?id=com.air.airnote');
						}
					}} />

				{this.renderEmptyMessage()}

				<ListView
					dataSource={this.state.dataSource} //data source
					keyboardShouldPersistTaps='always'
					keyboardDismissMode='interactive'
					enableEmptySections={true}
					ref={'LISTVIEW'}
					renderRow={(item) => this.renderListItem(item)} />
				
				<ActionButton icon='add' onPress={() => this.createViewAndEditNote(null)} />

			</Container>
		)
	}

}

MainPage.propTypes = propTypes;
export default MainPage;
