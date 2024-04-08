import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NameInputScreen from "./app/screens/NameInputScreen";
import TaskListScreen from "./app/screens/TaskListScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import AddTaskScreen from "./app/screens/AddTaskScreen";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({});

  const findUser = async () => {
    const result = await AsyncStorage.getItem("user");
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
      <>
        <NavigationContainer>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="TaskList" component={TaskListScreen} />
              <Stack.Screen name="AddTask" component={AddTaskScreen} />
            </Stack.Navigator>
            <Toast />
          </GestureHandlerRootView>
        </NavigationContainer>
      </>
    );
  }
  return <NameInputScreen onFinish={findUser} />;
}
