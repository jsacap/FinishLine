import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Image, Text } from 'react-native';

import colors from '../config/colors';
import AppButton from '../components/AppButton';

function WelcomeScreen(props) {
    return (
        <ImageBackground 
        blurRadius={2}
        style={styles.background}
        source={require('../assets/Background.jpg')}>
            <View style={styles.logoContainer}>

            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <Text style={styles.tagLine} >Finish Line</Text>
            </View>

            <AppButton title='START' onPress={() => {console.log('Press')}} />          
            
            
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    
    logo: {
        width: 100,
        height: 100,
    },
    logoContainer: {
        position: 'absolute',
        top: 70,
        alignItems: 'center'

    },
    tagLine: {
        fontSize: 25,
        fontWeight: '600',
        paddingVertical: 20
    }
    
})

export default WelcomeScreen;