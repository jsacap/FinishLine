import React from 'react';
import { ImageBackground, SafeAreaView, StyleSheet, View, Platform, StatusBar } from 'react-native';
import TaskItem from '../components/TaskItem';
import TimeCompletion from '../components/TimeCompletion';

function TaskListScreen(props) {
    return (
        <ImageBackground 
        style={styles.background}
        source={require('../assets/Background2.jpg')}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.taskList}>

            <TaskItem title='Task 1' time='30:00'/>            
            <TaskItem title='Task 2' time='20:00'/>
            <TaskItem title='Task 3' time='10:00'/>
            <TaskItem title='Task 4' time='15:00'/>
            <TaskItem title='Task 5' time='5:00'/>
            <TaskItem title='Task 6' time='4:00'/>
                </View>
                <View style={styles.time}>

                <TimeCompletion />
                </View>

                </SafeAreaView>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        
        alignItems: 'center',        
    },
    safeArea: {
        flex: 1, 
        width: '100%', // Ensure it takes the full width
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        justifyContent: 'space-between',

    },
    taskList: {
        marginBottom: 20,
    }
})

export default TaskListScreen;