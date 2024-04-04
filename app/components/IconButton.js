import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';

import { StyleSheet } from 'react-native';

import colors from '../config/colors';

function IconButton({ iconName, size, color, style }) {
    return (
        <FontAwesome5 
        name={iconName} 
        size={size || 24} 
        color={color || colors.white} 
        style={[styles.icon, {...style}]}
        />
    );
}

const styles = StyleSheet.create({
    icon: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 20,
        marginTop: 10
    }
})

export default IconButton;