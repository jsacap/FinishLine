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

function NameInputScreen({ navigation }) {
  const [name, setName] = useState("");

  const handleOnChangeText = (text) => {
    setName(text);
  };

  const handleSubmit = async () => {
    const capitalizeWords = (str) =>
      str.replace(/\b\w/g, (char) => char.toUpperCase());

    const capitalizedName = capitalizeWords(name);
    const user = { name: capitalizedName };

    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await requestPermissions();
      console.log("Navigating to Welcome screen");
      navigation.navigate("Welcome"); // Navigate to WelcomeScreen
    } catch (error) {
      Alert.alert("Error", "Failed to save user or navigate.");
      console.error(error);
    }
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

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Text>Welcome!</Text>
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
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#007bff",
    width,
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  explanationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  explanationText: {
    fontSize: 14,
    color: "#343a40",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default NameInputScreen;
