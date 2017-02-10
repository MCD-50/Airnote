import React, { Component, PropTypes } from 'react';
import {
    Navigator,
    TextInput,
    StyleSheet,
    BackAndroid,
    ScrollView
} from 'react-native';


import Toolbar from './custom/toolbar.js';
import Container from './container.js';
import ActionButton from './custom/actionbutton.js';

import { UPDOWNMARGIN, SIDEMARGIN } from '../helpers/constant.js';
import DatabaseHelper from '../helpers/database.js';
import { Note } from '../model/note.js';

const MIN_COMPOSER_HEIGHT = 55;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        fontSize: 17,
        fontWeight: '400',
        color: 'black',
        paddingTop: UPDOWNMARGIN,
        paddingBottom: UPDOWNMARGIN,
        paddingRight: SIDEMARGIN,
        paddingLeft: SIDEMARGIN,
    },
});

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    text: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    placeholderTextColor: React.PropTypes.string,
    multiline: React.PropTypes.bool,
    autoFocus: React.PropTypes.bool,
};

const defaultProps = {
    text: '',
    placeholder: 'Make a note...',
    placeholderTextColor: '#b8b8b8',
    multiline: true,
    autoFocus: true,
};



class NewPage extends Component {
    constructor(params) {
        super(params);
        this.state = {
            editText: '',
            height: MIN_COMPOSER_HEIGHT,
        }

        this.createNote = this.createNote.bind(this);
        this.renderActionButton = this.renderActionButton.bind(this);
        this.renderTextInput = this.renderTextInput.bind(this);
        this.addBackEvent = this.addBackEvent.bind(this);
        this.removeBackEvent = this.removeBackEvent.bind(this);
        this.onType = this.onType.bind(this);
        this.trim = this.trim.bind(this);
    }

    addBackEvent() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
                this.props.navigator.pop();
                return true;
            }
            return false;
        });
    }

    removeBackEvent() {
        BackAndroid.removeEventListener('hardwareBackPress', () => {
            if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
                this.props.navigator.pop();
                return true;
            }
            return false;
        });
    }

    componentWillMount() {
        this.addBackEvent();
    }

    componentWillUnmount() {
        this.removeBackEvent();
    }

    renderActionButton() {
        if (this.trim(this.state.editText).length > 0) {
            return (
                <ActionButton icon='done' onPress={() => this.createNote()} />
            );
        } else {
            return null;
        }
    }

    trim(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    createNote() {
        //save new todo;
        let text = this.trim(this.state.editText);
        if (text.length > 0) {
            let title = text.length > 10 ? text.substring(0, 10) + '...' : text + '...';


            let today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            const date = yyyy + '-' + mm + '-' + dd;
            let note = new Note(title, text, date);


            DatabaseHelper.addNewNote(note, (result) => {
                this.props.route.callback(result._id, note);
                this.props.navigator.pop();
            })
        }
    }

    renderTextInput() {
        // let {height, width} = Dimensions.get('window');
        // height = height - 55;
        return (
            <ScrollView keyboardDismissMode='interactive'>
                <TextInput
                    onChange={(e) => this.onType(e)}
                    style={[styles.textInput, { height: this.state.height }]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                    multiline={this.props.multiline}
                    autoCapitalize='sentences'
                    autoFocus={this.props.autoFocus}
                    enablesReturnKeyAutomatically={true}
                    underlineColorAndroid="transparent" />
            </ScrollView>
        );
    }


    onType(e) {
        let newComposerHeight = null;
        if (e.nativeEvent && e.nativeEvent.contentSize) {
            newComposerHeight = Math.max(MIN_COMPOSER_HEIGHT, e.nativeEvent.contentSize.height);
        } else {
            newComposerHeight = MIN_COMPOSER_HEIGHT;
        }

        const newText = e.nativeEvent.text;
        this.setState((previousState) => {
            return {
                height: newComposerHeight,
                editText: newText
            };
        });
    }

    render() {
        return (
            <Container>
                <Toolbar
                    leftElement="arrow-back"
                    onLeftElementPress={() => {
                        this.props.navigator.pop();
                    }}
                    centerElement={this.props.route.name} />

                {this.renderTextInput()}


                {this.renderActionButton()}

            </Container>
        )
    }
}

NewPage.propTypes = propTypes;
NewPage.defaultProps = defaultProps;

export default NewPage;
