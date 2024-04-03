import React from 'react';
import { StyleSheet, View } from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';

import colors from '../config/colors';
import AppText from './AppText/AppText'

function TaskItem({title, time}) {
    return (
        <View style={styles.taskContainer}>
            <View>

            <AppText style={styles.taskText}> 
                {title}
            </AppText>
            </View>
            <View style={styles.time}>
            <FontAwesome5 name="tasks" size={20} color="black" />
                <AppText>{time}</AppText>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    taskContainer: {
        borderRadius: 40,
        backgroundColor: '#dbb2ff',
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: 15,
        width: '80%', 
        height: 'auto',
        flexDirection: 'row',
        
    },
    taskText: {
        color: colors.white,
    },
    time: {
        alignItems: 'center', 
        justifyContent: 'center',
    }
})

export default TaskItem;