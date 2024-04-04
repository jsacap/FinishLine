import React from 'react';
import { View, StyleSheet, TextInput, Dimensions } from 'react-native';
import AppText from '../components/AppText/AppText';

import colors from '../config/colors';
import IconButton from '../components/IconButton';

function AddTaskScreen(props) {

    return (
        <View style={styles.container}>
            <AppText>Enter task block</AppText>
            <TextInput
            style={styles.textInput}            
            placeholder='Task Name'
            />
            <IconButton iconName="plus" />
        </View>
    );
}
const width = Dimensions.get('window') .width- 50

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',        
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

export default AddTaskScreen;