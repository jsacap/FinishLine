import React, { useState } from 'react';
import { View, StyleSheet, TextInput, StatusBar, Dimensions } from 'react-native';
import AppText from '../components/AppText/AppText';

import colors from '../config/colors';
import IconButton from '../components/IconButton';

function NameInputScreen(props) {
    const [user, setUser] = useState();
    const handleOnChangeText = (text) => {
        setUser(text)

    }
    console.log(user)
    return (
        <>
        <StatusBar hidden />
        <View style={styles.container}>
            <AppText>Welcome!</AppText>
            <TextInput 
            value={user}
            onChangeText={handleOnChangeText}
            placeholder='Enter Your Name...' 
            style={styles.textInput}
            />
            <IconButton iconName="arrow-right" />
        </View>
        </>
    );
}

const width = Dimensions.get('window') .width- 50
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'    
    },
    textInput: {
        borderWidth: 2,
        borderColor: colors.primary,
        width,
        height: 50,
        borderRadius: 10,
        paddingLeft: 10,
        fontSize: 20,
        marginTop: 5
    }
})

export default NameInputScreen;