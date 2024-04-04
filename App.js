import { useEffect } from 'react';
import { View } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import TaskListScreen from './app/screens/TaskListScreen';
import NameInputScreen from './app/screens/NameInputScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const findUser = async () => {
    try {
      const result = await AsyncStorage.getItem('user');
      if (result !== null) {
        console.log(result);
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    findUser();
  }, []);

  return (
    <NameInputScreen />
  );
}