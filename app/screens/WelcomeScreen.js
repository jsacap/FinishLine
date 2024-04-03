import React from 'react';
import { ImageBackground, StyleSheet, View, Text, Image } from 'react-native';

import colors from '../config/colors';
import AppText from '../components/AppText';

function WelcomeScreen(props) {
    return (
        <ImageBackground         
        style={styles.background}
        source={require('../assets/Background.jpg')}>
            <View style={styles.logoContainer}>

            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <AppText>Track Time</AppText>
            </View>
            <View style={styles.startButton}>
                <Text style={styles.startText}>Start My Day</Text>
                
            </View>            
            
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    startButton: {
        width: '100%',
        height: 70,
        backgroundColor: colors.primary,
        
        
    },
    startText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    logo: {
        width: 100,
        height: 100,
    },
    logoContainer: {
        position: 'absolute',
        top: 70,
        alignItems: 'center'

    }
})

export default WelcomeScreen;