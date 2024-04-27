import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import ActiveTaskScreen from "./app/screens/ActiveTaskScreen";
import AddTaskScreen from "./app/screens/AddTaskScreen";
import NameInputScreen from "./app/screens/NameInputScreen";
import SandBox from "./app/screens/SandBox";
import TaskListScreen from "./app/screens/TaskListScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import * as Notifications from "expo-notifications";
const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const findUser = async () => {
    const result = await AsyncStorage.getItem("user");
    if (result !== null) {
      setUser(JSON.parse(result));
    }
  };

  useEffect(() => {
    // Notification handler setup
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    // Load user data from storage
    const loadUserData = async () => {
      try {
        const result = await AsyncStorage.getItem("user");
        if (result !== null) {
          setUser(JSON.parse(result));
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error loading user data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user?.name) {
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
  return <NameInputScreen onFinish={() => setLoading(true) && findUser()} />;
}
