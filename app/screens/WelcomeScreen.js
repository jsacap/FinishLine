import React from 'react';
import { ImageBackground, StyleSheet, View, Button, Image } from 'react-native';

import colors from '../config/colors';
import AppText from '../components/AppText/AppText';
import AppButton from '../components/AppButton';

function WelcomeScreen(props) {
    return (
        <ImageBackground         
        style={styles.background}
        source={require('../assets/Background.jpg')}>
            <View style={styles.logoContainer}>

            <Image style={styles.logo} source={require('../assets/logo.png')} />
            <AppText>Track Time</AppText>
            </View>
            <AppButton title='START' onPress={() => {console.log('Press')}} />          
            <Button
  onPress={() => {
    console.log('You tapped the button!');
  }}
  title="Press Me"
/>
            
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

    }
})

export default WelcomeScreen;