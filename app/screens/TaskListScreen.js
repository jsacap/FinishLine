import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import TaskItem from '../components/TaskItem';

function TaskListScreen(props) {
    return (
        <ImageBackground 
        style={styles.background}
        source={require('../assets/Background2.jpg')}
        >
            

            <TaskItem title='Task 1' time='30:00'/>
            
            <TaskItem title='Task 2' time='20:00'/>
            <TaskItem title='Task 3' time='10:00'/>
            <TaskItem title='Task 4' time='15:00'/>
            <TaskItem title='Task 5' time='5:00'/>
            <TaskItem title='Task 6' time='4:00'/>
            
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',        
    },
    taskList: {
        marginBottom: 20
    }
})

export default TaskListScreen;