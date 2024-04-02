import React from 'react';
import { ImageBackground, StyleSheet, View, Text, Image } from 'react-native';

function WelcomeScreen(props) {
    return (
        <ImageBackground 
        style={styles.background}
        source={require('../assets/Background.jpg')}>
            <View style={styles.logoContainer}>

            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <Text>Track Time</Text>
            </View>
            <View style={styles.loginButton}>
                <Text style={styles.start}>Start My Day</Text>
                
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
    loginButton: {
        width: '100%',
        height: 70,
        backgroundColor: 'dodgerblue',
        
    },
    start: {
        alignItems: 'center',
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