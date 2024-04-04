import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NameInputScreen from './app/screens/NameInputScreen';
import TaskListScreen from './app/screens/TaskListScreen';
import WelcomeScreen from './app/screens/WelcomeScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({});

  const findUser = async () => {
    const result = await AsyncStorage.getItem('user');
    if (result !== null) { 
      setUser(JSON.parse(result));
    }
  };

  useEffect(() => {
    findUser();
    // AsyncStorage.clear();
  }, []);

  // if (!user.name) {
  //   return <NameInputScreen onFinish={findUser} />;
  // }
  if (user.name) {
    return (
    
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="TaskList" component={TaskListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    
    );
  }
  return <NameInputScreen onFinish={findUser} />;
  
}
