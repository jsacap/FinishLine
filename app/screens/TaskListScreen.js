import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from "react-native";
import TaskItem from "../components/TaskItem";
import TimeCompletion from "../components/TimeCompletion";
import AppText from "../components/AppText/AppText";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useFindUser from "../hooks/useFindUser";
import IconButton from "../components/IconButton";

import { useNavigation } from "@react-navigation/native";

function TaskListScreen() {
  const user = useFindUser();
  const navigation = useNavigation();
  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/Background2.jpg")}
    >
      <IconButton
        iconName="plus"
        onPress={() => navigation.navigate("AddTask")}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.taskList}></View>
        <View style={styles.time}>
          <TimeCompletion />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,

    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    width: "100%", // Ensure it takes the full width
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    justifyContent: "space-between",
  },
  name: {
    justifyContent: "flex-start",
  },
  taskList: {
    marginBottom: 20,
  },
  addButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default TaskListScreen;
