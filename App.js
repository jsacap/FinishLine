import { useEffect, useState } from 'react';
import { View } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import TaskListScreen from './app/screens/TaskListScreen';
import NameInputScreen from './app/screens/NameInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppText from './app/components/AppText/AppText';
import AddTaskScreen from './app/screens/AddTaskScreen';

export default function App() {
  

  return (
    <TaskListScreen />
    // <NameInputScreen />
  );
}