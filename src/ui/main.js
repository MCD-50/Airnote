import React, { Component, PropTypes } from 'react';
import { ListView, View, Text, Linking, Alert, TouchableOpacity } from 'react-native';

import { Toolbar, ActionButton, Card, Toast, SwipeListView } from 'react-native-material-component'
import { getData } from '../helpers/appstore.js';
import { SIDEMARGIN, UPDOWNMARGIN, FONTSIZE } from '../helpers/constant.js';
import { Page } from '../enums/page.js';
import Container from './container.js';
import SettingPage from './setting.js';
import DatabaseHelper from '../helpers/database.js';
import Communications from 'react-native-communications';
import styles from '../helpers/styles.js';
import { propTypes, mainPageMenuItems } from '../helpers/constant.js';

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1.id !== r2.id });

class MainPage extends Component {
	constructor(params) {
		super(params);
		this.state = {
			dataSource: ds.cloneWithRows([]),
			notes: [],
			isEmpty: false,
		}

		this.setDataToDatabase = this.setDataToDatabase.bind(this);
		this.createViewAndEditNote = this.createViewAndEditNote.bind(this);
		this.onRightElementPress = this.onRightElementPress.bind(this);
		this.deleteRow = this.deleteRow.bind(this);
		this.callback = this.callback.bind(this);

		this.renderListItem = this.renderListItem.bind(this);
		this.renderEmptyMessage = this.renderEmptyMessage.bind(this);
	}


	componentWillMount() {
		this.setDataToDatabase();
	}

	setDataToDatabase() {
		DatabaseHelper.getAllNotes((notes) => {
			this.setState({
				dataSource: (notes.length > 0) ? ds.cloneWithRows(notes) : ds.cloneWithRows([]),
				notes: notes,
				isEmpty: (notes.length > 0) ? false : true
			});
		})
	}

	callback() {
		this.setDataToDatabase();
	}

	createViewAndEditNote(item) {
		getData(FONTSIZE)
			.then((val) => {
				const page = Page.EDIT_PAGE;
				const data = {
					note: item,
					callback: this.callback,
					textSize: val ? val : 16
				};
				this.props.navigator.push({ id: page.id, name: page.name, data: data });
			});
	}

	onRightElementPress(index) {
		if (mainPageMenuItems[index] === 'Settings') {
			getData(FONTSIZE)
				.then((val) => {
					const page = Page.SETTING_PAGE;
					const data = {
						textSize: val ? val : 16
					};
					this.props.navigator.push({ id: page.id, name: page.name, data: data })
				});
		} else if (mainPageMenuItems[index] === 'Share this app') {
			Communications.email(null, null, null, null, 'http://play.google.com/store/apps/details?id=com.air.airnote');
		} else if (mainPageMenuItems[index] === 'Rate this app') {
			Linking.openURL('market://details?id=com.air.airnote');
		}
	}

	deleteRow(secId, rowId, _rowMap) {
		const notes = this.state.notes.slice();
		const rowMap = Object.assign({}, _rowMap);
		Alert.alert(null, 'Are you sure you want to delete this note?',
			[{
				text: 'OK',
				onPress: () => {
					DatabaseHelper.removeNoteById(notes[rowId].id, result => {
						rowMap[`${secId}${rowId}`].closeRow();
						notes.splice(rowId, 1);
						this.setState({
							dataSource: (notes.length > 0) ? ds.cloneWithRows(notes) : ds.cloneWithRows([]),
							notes: notes,
							isEmpty: (notes.length > 0) ? false : true
						});
						Toast.show('Note deleted.');
					});
				}
			},
			{
				text: 'CANCEL',
				onPress: () => {

				}
			}]);
	}

	renderEmptyMessage() {
		if (this.state.isEmpty)
			return (
				<Text style={[styles.main_page_description_text, { fontSize: 15, marginLeft: 10, marginRight: 10, marginTop: 5, marginBottom: 5 }]}>
					Its empty here. Add a few notes to get started.
				</Text>
			);
		return null;
	}

	renderListItem(item) {
		const title = item.title.replace(/(<([^>]+)>)/g, "_%_").split("_%_").join(' ').trim();
		const description = item.description.replace(/(<([^>]+)>)/g, "_%_").split("_%_").join(' ').trim();
		return (
			<Card style={{ minHeight: 50, justifyContent: 'center' }} fullWidth="1" onPress={() => this.createViewAndEditNote(item)}>
				<View style={styles.main_page_list_item_container}>
					<Text style={styles.main_page_header_text}>
						{title}
					</Text>
					<Text style={styles.main_page_description_text}>
						{description.substring(0, 50) + '...'}
					</Text>
					<Text style={styles.main_page_footer_text}>
						{item.createdOn}
					</Text>
				</View>
			</Card>
		);
	}

	render() {
		return (
			<Container>
				<Toolbar
					centerElement={this.props.route.name}
					rightElement={{ menu: { labels: mainPageMenuItems } }}
					onRightElementPress={(action) => this.onRightElementPress(action.index)} />

				{this.renderEmptyMessage()}

				<SwipeListView
					dataSource={this.state.dataSource}
					keyboardShouldPersistTaps='always'
					keyboardDismissMode='interactive'
					enableEmptySections={true}
					renderRow={(item) => this.renderListItem(item)}
					renderHiddenRow={(data, secId, rowId, rowMap) => (
						<View style={styles.row_back_swipe_list_view}>
							<TouchableOpacity style={[styles.back_right_holder_swipe_list_view, styles.back_right_button_swipe_list_view]} onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
								<Text style={[styles.text_with_margin_bottom_and_font_size_14, { margin: 0, fontSize: 16 }]}>Delete</Text>
							</TouchableOpacity>
						</View>
					)}
					leftOpenValue={0}
					rightOpenValue={-120} />

				<ActionButton icon='add' onPress={() => this.createViewAndEditNote(null)} />
			</Container>
		)
	}

}

MainPage.propTypes = propTypes;
export default MainPage;
