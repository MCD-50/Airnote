import React, { Component, PropTypes } from 'react';
import {
    Navigator,
    Text,
    StyleSheet,
    BackAndroid,
} from 'react-native';



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
};




class ViewPage extends Component {
    constructor(params) {
        super(params);
        this.state = {
            note: this.props.route.data,
            text: this.props.route.data.description,
        }

        this.addBackEvent = this.addBackEvent.bind(this);
        this.removeBackEvent = this.removeBackEvent.bind(this);
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
                            this.props.route.onDeleteCallback(this.state.note);
                            this.props.navigator.pop();
                        })
                    }} />

                <Text style={styles.text} >
                    {this.state.text}
                </Text>

                <ActionButton icon='edit' onPress={() => this.props.navigator.replace({ id: '5', name: this.props.route.name, callback: this.props.route.callback, data: this.state.note })} />

            </Container>
        )
    }
}

ViewPage.propTypes = propTypes;

export default ViewPage;