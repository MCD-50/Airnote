import React, { Component, PropTypes } from "react";
import { BackAndroid, View, Text, TouchableOpacity, KeyboardAvoidingView, Alert } from "react-native";

import { Toolbar, ActionButton, Avatar } from "react-native-material-component";
import { UPDOWNMARGIN, SIDEMARGIN } from "../helpers/constant.js";
import { Note } from "../models/note.js";
import { Type } from '../enums/type';
import { getCreatedOn } from "../helpers/collectionutils.js";
import { PRICOLOR, TEXTGRAYSECCOLOR } from "../helpers/constant.js";
import { RichTextEditor, RichTextToolbar, actions } from "react-native-zss-rich-text-editor";

import Container from "./container.js";
import DatabaseHelper from "../helpers/database.js";
import KeyboardSpacer from "react-native-keyboard-spacer";
import styles from '../helpers/styles.js';

import DateTimePicker from 'react-native-modal-datetime-picker';

import { propTypes, _actions } from '../helpers/constant.js';

const _customCSS =
	`#zss_editor_content {
				padding-left: 0px;
				padding-right: 0px;
			}

			#zss_editor_title {
				padding-left: 0px;
				padding-right: 0px;
			}
			
			[placeholder]:empty:before {
				content: attr(placeholder);
				color: #757575;
			}

			[placeholder]:empty:focus:before {
				content: attr(placeholder);
				color: #757575;
			}
			#separatorContainer {
				-webkit-user-select: none;
				padding-left: 0px;
				padding-right: 0px;
			}`;

class EditPage extends Component {
	constructor(params) {
		super(params);

		_customCSS +=
			`body {
				padding-top: 0px;
				padding-bottom: 0px;
				padding-left:0px;
				padding-right:0px;
				font-size: ${this.props.route.data.textSize}px;
				overflow-y: scroll;
				-webkit-overflow-scrolling: touch;
				height: 100%;
			}`;


		this.state = {
			note: "",
			editText: "",
			title: "",
			endsOn: "",
			isDateTimePickerVisible: false,
			showKeyboardSpacer: this.props.appState === 'initial',
			icons: {
				bold: "all-inclusive",
				unorderedList: "crop-din",
				INST_LINK: "insert-link",
				ends: 'event',
			},
		};




		this.addBackEvent = this.addBackEvent.bind(this);
		this.removeBackEvent = this.removeBackEvent.bind(this);

		this.handleDatePicked = this.handleDatePicked.bind(this);
		this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
		this.showDateTimePicker = this.showDateTimePicker.bind(this);

		this.updateNote = this.updateNote.bind(this);
		this.deleteNote = this.deleteNote.bind(this);
		this.getHTML = this.getHTML.bind(this);
		this.renderAction = this.renderAction.bind(this);
	}

	addBackEvent() {
		BackAndroid.addEventListener("hardwareBackPress", () => {
			if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
				this.updateNote();
				return true;
			}
			return false;
		});
	}

	removeBackEvent() {
		BackAndroid.removeEventListener("hardwareBackPress", () => {
			if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
				this.updateNote();
				return true;
			}
			return false;
		});
	}

	componentDidMount() {
		let data = this.props.route.data.note;
		if (data) {
			let _icons = this.state.icons;
			_icons["delete"] = "delete"
			this.setState({
				note: data,
				title: data.createdOn,
				editText: data.description,
				endsOn: data.endsOn,
				icons: _icons
			});
		} else {
			this.setState({
				note: null,
				title: this.getDate(),
				editText: "",
				endsOn: ""
			});
		}
		this.addBackEvent();
	}

	componentWillUnmount() {
		this.removeBackEvent();
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.props != nextProps) {
			setTimeout(() => this.setState({ showKeyboardSpacer: nextProps.appState === 'initial' }), 10);
		}
		return this.state != nextState;
	}

	showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

	hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

	getCustomCss(size) {
		return
	}

	handleDatePicked = (date) => {
		date = date.toString().split(' ');
		if (date.length > 0) {
			const selected_date = `${date[1]}, ${date[2]} ${date[3]}`;
			this.setState({ endsOn: 'End by ' + selected_date });
		}
		this.hideDateTimePicker();
	};

	getDate() {
		let today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth(); //January is 0!
		var yyyy = today.getFullYear();
		return getCreatedOn(yyyy + "-" + mm + "-" + dd);
	}

	updateNote() {
		this.getHTML()
			.then(text => {
				if (this.state.note && this.state.note.description === text && this.state.note.endsOn === this.state.endsOn) {
					this.props.navigator.pop();
				} else {
					let endsOn;
					if (this.state.endsOn) {
						endsOn = this.state.endsOn
					} else {
						endsOn = "Task deadline is not specified.";
					}
					if (text.length > 0) {
						const date = this.getDate();
						let note;
						if (this.state.note) {
							note = this.state.note;
							note.setDescription(text.trim());
							note.setCreatedOn(date);
							note.setEndsOn(endsOn);
							DatabaseHelper.updateNote(note.getId(), note, result => {
								this.props.route.data.callback();
								this.props.navigator.pop();
							});
						} else {
							note = new Note(text.trim(), date, endsOn);
							DatabaseHelper.addNewNote(note, result => {
								this.props.route.data.callback();
								this.props.navigator.pop();
							});
						}
					} else {
						this.props.navigator.pop();
					}
				}
			});
	}

	deleteNote(note) {
		Alert.alert(null, 'Are you sure you want to delete this note?',
			[{
				text: 'OK',
				onPress: () => {
					DatabaseHelper.removeNoteById(note.getId(), result => {
						this.removeBackEvent();
						this.props.route.data.callback();
						this.props.navigator.pop();
					});
				}
			},
			{
				text: 'CANCEL',
				onPress: () => {

				}
			}]);

	}


	async getHTML() {
		return await this.richtext.getContentHtml();
	}

	renderAction(action, selected) {
		const icon = this.state.icons[action];
		const _color = selected ? PRICOLOR : TEXTGRAYSECCOLOR;
		const _size = selected ? (action == actions.insertBulletsList ? 24 : 28) : action == actions.insertBulletsList ? 20
			: action == actions.insertLink ? 26 : action == 'ends' ? 21 : 22;
		return (
			<TouchableOpacity style={styles.edit_page_touchable_opacity}
				onPress={() => {
					const editor = this.richtext;
					if (action === actions.setBold || action === actions.insertBulletsList) {
						editor._sendAction(action);
					} else if (action === "delete" && this.state.note) {
						this.deleteNote(this.state.note);
					} else if (action === "ends" && this.state.note) {
						this.showDateTimePicker();
					} else if (action === actions.insertLink) {
						editor.prepareInsert();
						editor.getSelectedText().then(selectedText => {
							editor.showLinkDialog(selectedText);
						});
					}
				}}>
				<Avatar icon={icon} iconColor={_color} iconSize={_size} bgcolor="transparent" />
			</TouchableOpacity>
		);
	}

	render() {
		return (
			<Container>
				<Toolbar
					leftElement="arrow-back"
					onLeftElementPress={() => this.updateNote()}
					centerElement={this.state.title} />

				<RichTextEditor
					style={styles.edit_page_rich_text_editor}
					contentPlaceholder="Make a new note"
					ref={r => this.richtext = r}
					initialContentHTML={this.state.editText}
					hiddenTitle={true}
					customCSS={_customCSS} />

				<RichTextToolbar
					getEditor={() => this.richtext}
					style={styles.edit_page_rich_text_toolbar}
					actions={_actions}
					renderAction={(action, selected) => this.renderAction(action, selected)} />

				<DateTimePicker
					isVisible={this.state.isDateTimePickerVisible}
					onConfirm={this.handleDatePicked}
					onCancel={this.hideDateTimePicker}
					mode="date"
					titleIOS="Select deadline" />


				{this.state.showKeyboardSpacer && <KeyboardSpacer />}
			</Container>
		);
	}
}

EditPage.propTypes = propTypes;

export default EditPage;
