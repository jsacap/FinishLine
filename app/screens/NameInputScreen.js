import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  Text,
  Dimensions,
} from "react-native";
import AppText from "../components/AppText/AppText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addNotificationsDroppedListener } from "expo-notifications";
import * as Notifications from "expo-notifications";

import colors from "../config/colors";
import IconButton from "../components/IconButton";

function NameInputScreen({ onFinish }) {
  const [name, setName] = useState("");

  const handleOnChangeText = (text) => {
    setName(text);
  };

  const handleSubmit = async () => {
    const user = { name: name };
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await requestPermissions();
    if (onFinish) onFinish();
  };

  async function requestPermissions() {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert(
        "Notification permissions are required to notify you of task updates."
      );
    }
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Complete!",
        body: "Your task has been completed.",
      },
      trigger: { seconds: 2 },
    });
  }

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <AppText>Welcome!</AppText>
        <TextInput
          value={name}
          onChangeText={handleOnChangeText}
          placeholder="Enter Your Name..."
          style={styles.textInput}
        />
        {name.trim().length >= 3 && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>
              We use notifications to keep you updated on your tasks' progress
              and alert you when a task is due. Please enable notifications to
              get the most out of our app.
            </Text>
            <IconButton iconName="arrow-right" onPress={handleSubmit} />
          </View>
        )}
      </View>
    </>
  );
}

const width = Dimensions.get("window").width - 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.primary,
    width,
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 20,
    marginBottom: 10,
  },
  explanationContainer: {
    marginTop: 20,
  },
  explanationText: {
    fontSize: 12,
    color: colors.dark,
    textAlign: "center",
    marginBottom: 10,
    padding: 5,
  },
});

export default NameInputScreen;
