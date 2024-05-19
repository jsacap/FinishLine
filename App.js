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
import { Platform } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";

export default function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const BACKGROUND_FETCH_TASK = "background-fetch-task";

  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      // Reschedule notifications here if needed
      return BackgroundFetch.Result.NewData;
    } catch (err) {
      return BackgroundFetch.Result.Failed;
    }
  });

  const registerBackgroundFetchAsync = async () => {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false,
      startOnBoot: true,
    });
  };

  registerBackgroundFetchAsync().catch((err) =>
    console.error("Failed to register background fetch", err)
  );

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
        sound: true, // Ensure sound is enabled
      });
    }

    const loadUserData = async () => {
      try {
        const result = await AsyncStorage.getItem("user");
        if (result !== null) {
          setUser(JSON.parse(result));
        } else {
          console.log("No user found in AsyncStorage");
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

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user?.name ? (
            <>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="TaskList" component={TaskListScreen} />
              <Stack.Screen name="AddTask" component={AddTaskScreen} />
              <Stack.Screen name="ActiveTask" component={ActiveTaskScreen} />
              <Stack.Screen name="SandBox" component={SandBox} />
            </>
          ) : (
            <Stack.Screen name="NameInput" component={NameInputScreen} />
          )}
        </Stack.Navigator>
        <Toast />
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
