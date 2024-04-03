import React from 'react';
import { StyleSheet, View } from 'react-native';

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
            <View>
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
        color: colors.white
    }
})

export default TaskItem;