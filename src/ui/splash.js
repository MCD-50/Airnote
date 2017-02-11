import React, { Component, PropTypes, } from 'react';
import { View, 
    StyleSheet, 
    Image, 
    StatusBar
} from 'react-native';

const background = require('../res/splash.png');

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
});

const propTypes = {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
};

class SplashPage extends Component {

    constructor(params){
        super(params);
    }
    
    componentDidMount() {
        var navigator = this.props.navigator;
        setTimeout(() => {
            navigator.replace({ id: '2', name: 'Airnote'});
        }, 4000);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor='black' barStyle='light-content' />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black', }}>
                    <Image source={background} style={{ width: 150, height: 150, alignItems: 'center', justifyContent: 'center' }} resizeMode="contain" />
                </View>
            </View>
        );
    }
}

SplashPage.propTypes = propTypes;
export default SplashPage;