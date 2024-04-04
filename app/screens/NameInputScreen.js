import React, { useState } from 'react';
import { View, StyleSheet, TextInput, StatusBar, Dimensions } from 'react-native';
import AppText from '../components/AppText/AppText';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../config/colors';
import IconButton from '../components/IconButton';


function NameInputScreen(props) {
    const [name, setName] = useState('');
    const handleOnChangeText = (text) => {
        setName(text)

    }

    const handleSubmit = async () => {
        const user = { name: name }
        await AsyncStorage.setItem('user', JSON.stringify(user))

    }
    

    return (
        <>
        <StatusBar hidden />
        <View style={styles.container}>
            <AppText>Welcome!</AppText>
            <TextInput 
            value={name}
            onChangeText={handleOnChangeText}
            placeholder='Enter Your Name...' 
            style={styles.textInput}
            />
            {name.trim().length >= 3 ? <IconButton iconName="arrow-right" onPress={handleSubmit} /> : null}
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
        marginBottom: 10
    }
})

export default NameInputScreen;