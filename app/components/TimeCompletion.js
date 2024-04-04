import React from 'react';
import { View } from 'react-native';
import AppText from './AppText/AppText';
import Clock from './Clock';
import Header from './Header';

function TimeCompletion(props) {
    return (
        <View>
            <Header>End Time</Header>
            <Clock>

            </Clock>
            
        </View>
    );
}

export default TimeCompletion;