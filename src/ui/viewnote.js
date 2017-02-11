import React, { Component, PropTypes } from 'react';
import {
    Navigator,
    Text,
    StyleSheet,
    Linking,
    BackAndroid,
    ScrollView,
} from 'react-native';


import ParsedText from './custom/parsedtext.js';
import Communications from 'react-native-communications';
import Toolbar from './custom/toolbar.js';
import Container from './container.js';
import ActionButton from './custom/actionbutton.js';
import DatabaseHelper from '../helpers/database.js';
import { UPDOWNMARGIN, SIDEMARGIN } from '../helpers/constant.js';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 17,
        color: 'black',
        paddingTop: UPDOWNMARGIN,
        paddingBottom: UPDOWNMARGIN,
        paddingRight: SIDEMARGIN,
        paddingLeft: SIDEMARGIN,
    },
    link: {
        color: '#3f51b5',
        textDecorationLine: 'underline',
    },
});

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};

class ViewPage extends Component {
    constructor(params) {
        super(params);
        this.state = {
            note: this.props.route.data,
            text: this.props.route.data.description,
            textSize: this.props.route.textSize,
        }

        this.addBackEvent = this.addBackEvent.bind(this);
        this.removeBackEvent = this.removeBackEvent.bind(this);
        this.onUrlPress = this.onUrlPress.bind(this);
        this.onPhonePress = this.onPhonePress.bind(this);
        this.onEmailPress = this.onEmailPress.bind(this);
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

    onUrlPress(url) {
        Linking.openURL(url);
    }

    onPhonePress(phone) {
        const options = [
            'Call',
            'Text',
            'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        Communications.phonecall(phone, true);
                        break;
                    case 1:
                        Communications.text(phone);
                        break;
                }
            });
    }

    onEmailPress(email) {
        Communications.email(email, null, null, null, null);
    }


    render() {
        return (
            <Container>
                <Toolbar
                    leftElement="arrow-back"
                    onLeftElementPress={() => {
                        this.props.navigator.pop();
                    }}
                    centerElement={this.props.route.name}
                    rightElement="remove"
                    onRightElementPress={() => {
                        DatabaseHelper.removeNoteById(this.state.note.getId(), (results) => {
                            this.props.route.onDeleteCallback();
                            this.props.navigator.pop();
                        })
                    }} />


                <ScrollView keyboardDismissMode='interactive'>
                    <ParsedText
                        style={styles.text}
                        parse={[
                            { type: 'url', style: StyleSheet.flatten([styles.link]), onPress: this.onUrlPress },
                            { type: 'phone', style: StyleSheet.flatten([styles.link]), onPress: this.onPhonePress },
                            { type: 'email', style: StyleSheet.flatten([styles.link]), onPress: this.onEmailPress },
                        ]}>

                        {this.state.text}

                    </ParsedText>
                </ScrollView>

                <ActionButton icon='edit' onPress={() => this.props.navigator.replace({ id: '5', name: this.props.route.name, callback: this.props.route.callback, data: this.state.note, textSize: this.state.textSize })} />

            </Container>
        )
    }
}

ViewPage.propTypes = propTypes;

export default ViewPage;