import React, { Component, PropTypes, } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    BackAndroid,
    Switch,
    Linking,
    Picker,
} from 'react-native';

import Toolbar from './custom/toolbar.js';
import Container from './container.js';
import { Note } from '../model/note.js';
import { setData, getStoredDataFromKey } from '../helpers/appstore.js';
import { SIDEMARGIN, UPDOWNMARGIN, FONTSIZE } from '../helpers/constant.js';
import Card from './custom/card.js';
import Communications from 'react-native-communications';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: UPDOWNMARGIN,
    },

    text: {
        fontSize: 17,
        color: 'black',
        padding: UPDOWNMARGIN,
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },

    switch: {
        marginLeft: 10,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    cards: {
        minHeight: 50,
        justifyContent: 'center'
    }


});

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};


class SettingPage extends Component {

    constructor(params) {
        super(params);
        this.state = {
            textSize: this.props.route.textSize
        }

        this.addBackEvent = this.addBackEvent.bind(this);
        this.removeBackEvent = this.removeBackEvent.bind(this);
        this.onEmail = this.onEmail.bind(this);
        this.onValueChange = this.onValueChange.bind(this);

       
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

    onValueChange(size) {
        this.setState({ textSize: size })

        setData(FONTSIZE, size);
    }



    onEmail() {
        let email = 'ayush.as.shukla@gmail.com';
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
                    centerElement={this.props.route.name} />


                <ScrollView style={styles.container} keyboardDismissMode='interactive'>
                    <Card style={{
                        minHeight: 50,
                        justifyContent: 'center'
                    }}>
                        <View style={styles.innerView}>
                            <Text style={styles.text}>Accept Privacy Policy </Text>
                            <Switch style={styles.switch} value={true} disabled={true} />
                        </View>
                    </Card>

                    <Card style={{
                        minHeight: 50,
                        justifyContent: 'center'
                    }}>
                        <View style={[styles.innerView, { flexDirection: 'column' }]}>

                            <Text style={[styles.text, { fontSize: 15 }]}>Set text size of editable view</Text>
                            <View style={{ margin: UPDOWNMARGIN, height: 1, backgroundColor: '#131313' }} />

                            <Picker style={{ flex: 1 }}
                                selectedValue={this.state.textSize}
                                onValueChange={(size) => this.onValueChange(size)}>
                                <Picker.Item label="16" value="16" />
                                <Picker.Item label="18" value="18" />
                                <Picker.Item label="20" value="20" />
                            </Picker>
                        </View>
                    </Card>

                    <Card style={{
                        minHeight: 50,
                        justifyContent: 'center'
                    }}>
                        <View style={[styles.innerView, { flexDirection: 'column' }]}>
                            <Text style={[styles.text, { fontSize: 15 }]}>Airnote is simple note making app. Which is built using javaScript and react native framework.</Text>
                            <View style={{ margin: UPDOWNMARGIN, height: 1, backgroundColor: '#131313' }} />

                            <Text onPress={() => this.onEmail()} style={[styles.text, { fontSize: 15, color: '#dd2c00', padding: 1, paddingLeft: UPDOWNMARGIN, paddingRight: UPDOWNMARGIN }]}>Contact developer</Text>
                            <Text onPress={() => Linking.openURL('https://github.com/MCD-50/Airnote')} style={[styles.text, { fontSize: 15, color: '#dd2c00', padding: 1, paddingLeft: UPDOWNMARGIN, paddingRight: UPDOWNMARGIN }]}>Source code at github</Text>
                        </View>
                    </Card>

                    <Card style={{
                        minHeight: 50,
                        justifyContent: 'center'
                    }}>
                        <View style={[styles.innerView, { flexDirection: 'column' }]}>
                            <Text style={[styles.text, { fontSize: 15 }]}>Support development of airnote for android. Paypal airnote</Text>
                            <View style={{ margin: UPDOWNMARGIN, height: 1, backgroundColor: '#131313' }} />
                            <Text onPress={() => Linking.openURL('https://www.paypal.com/AyushAS')} style={[styles.text, { fontSize: 15, color: '#dd2c00', padding: 1, paddingLeft: UPDOWNMARGIN, paddingRight: UPDOWNMARGIN }]}>Buy coffee for developer</Text>
                        </View>
                    </Card>

                    <View style={[styles.innerView, { justifyContent: 'flex-end' }]}>
                        <Text style={[styles.text, { color: '#b2b2b2', padding: 0, paddingLeft: UPDOWNMARGIN, paddingRight: UPDOWNMARGIN, fontSize: 13, alignItems: 'flex-end' }]}>Airnote 1.0</Text>
                    </View>

                </ScrollView>
            </Container>
        );
    }
}

SettingPage.propTypes = propTypes;
export default SettingPage;