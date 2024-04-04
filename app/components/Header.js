import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import colors from '../config/colors';

function Header({ children, style }) {
    return (
        <View style={styles.headerContainer}>
            <Text style={[styles.headerText, style]}>{children}</Text>
            
        </View>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'        
    },
    headerText: {
        fontSize: 24,
        color: colors.black
    }
})

export default Header;