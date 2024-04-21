import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import ActiveTaskScreen from "./app/screens/ActiveTaskScreen";
import AddTaskScreen from "./app/screens/AddTaskScreen";
import NameInputScreen from "./app/screens/NameInputScreen";
import TaskListScreen from "./app/screens/TaskListScreen";
import SandBox from "./app/screens/SandBox";
import WelcomeScreen from "./app/screens/WelcomeScreen";

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
              <Stack.Screen name="ActiveTask" component={ActiveTaskScreen} />
              <Stack.Screen name="SandBox" component={SandBox} />
            </Stack.Navigator>
            <Toast />
          </GestureHandlerRootView>
        </NavigationContainer>
      </>
    );
  }
  return <NameInputScreen onFinish={findUser} />;
}
