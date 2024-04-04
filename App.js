import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NameInputScreen from './app/screens/NameInputScreen';
import WelcomeScreen from './app/screens/WelcomeScreen';

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

  if (!user.name) {
    return <NameInputScreen onFinish={findUser} />;
  }
  return <WelcomeScreen user={user} />;
}
