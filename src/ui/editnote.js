import React, { Component, PropTypes } from 'react';
import {
    Navigator,
    TextInput,
    StyleSheet,
    BackAndroid,
    ScrollView,
    Dimensions,
} from 'react-native';



import Toolbar from './custom/toolbar.js';
import Container from './container.js';
import ActionButton from './custom/actionbutton.js';
import { UPDOWNMARGIN, SIDEMARGIN } from '../helpers/constant.js';
import DatabaseHelper from '../helpers/database.js';
import { Note } from '../model/note.js';
import { getCreatedOn } from '../helpers/collectionutils.js';

const {height, width} = Dimensions.get('window');

const MIN_COMPOSER_HEIGHT = 600;

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
    placeholder: 'Edit a note...',
    placeholderTextColor: '#b8b8b8',
    multiline: true,
    autoFocus: true,
};


class EditPage extends Component {

    constructor(params) {
        super(params);
        this.state = {
            note: this.props.route.data,
            editText: this.props.route.data.description,
            height: height - 55,
            textSize: this.props.route.textSize,
        }

        this.updateNote = this.updateNote.bind(this);
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


    updateNote() {

        let text = this.trim(this.state.editText);
        if (text.length > 0) {
            let title = text.length > 10 ? text.substring(0, 10) + '...' : text + '...';

            let today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth(); //January is 0!
            var yyyy = today.getFullYear();
            const date = getCreatedOn(yyyy + '-' + mm + '-' + dd);
            let note = this.state.note;
            note.setDescription(text.trim());
            note.setTitle(title.trim());
            note.setCreatedOn(date);

            DatabaseHelper.updateNote(note.getId(), note, (result) => {
                this.props.route.callback();
                this.props.navigator.pop();
            })
        }
    }

    renderActionButton() {
        if (this.trim(this.state.editText).length > 0) {
            return (
                <ActionButton icon='done' onPress={() => this.updateNote()} />
            );
        } else {
            return null;
        }
    }

    trim(str) {
        return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
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


    renderTextInput() {
        return (
            <ScrollView keyboardDismissMode='interactive'>
                <TextInput
                    onChange={(e) => this.onType(e)}
                    style={[styles.textInput, { height: this.state.height, fontSize: parseInt(this.state.textSize), textAlignVertical: 'top' }]}
                    placeholder={this.props.placeholder}
                    placeholderTextColor={this.props.placeholderTextColor}
                    multiline={this.props.multiline}
                    autoFocus={this.props.autoFocus}
                    value={this.state.editText}
                    enablesReturnKeyAutomatically={true}
                    underlineColorAndroid="transparent" />
            </ScrollView>
        );
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

EditPage.propTypes = propTypes;
EditPage.defaultProps = defaultProps;

export default EditPage;