import React from "react";
import { StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { FontAwesome5 } from "@expo/vector-icons";

import colors from "../config/colors";
import AppText from "./AppText/AppText";

function TaskItem({ title, time, remainingTime, renderRightActions }) {
  const displayTime = `${Math.floor(remainingTime / 3600)}h:${Math.floor(
    (remainingTime % 3600) / 60
  )}m`;

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={styles.taskContainer}>
        <View>
          <AppText style={styles.taskText}>{title}</AppText>
        </View>
        <View style={styles.time}>
          <FontAwesome5 name="tasks" size={20} color="black" />
          {remainingTime ? (
            <AppText style={styles.taskText}>{remainingTime}</AppText>
          ) : (
            <AppText>{time}</AppText>
          )}
        </View>
      </View>
    </Swipeable>
  );
}
const styles = StyleSheet.create({
  taskContainer: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.taskItemPrimary,
  },
  // taskContainer: {
  //   borderRadius: 40,
  //   backgroundColor: colors.taskItemPrimary,
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   padding: 15,
  //   width: "100%",
  //   height: "auto",
  //   flexDirection: "row",
  //   marginTop: 10,
  // },
  taskText: {
    color: colors.black,
    fontSize: 24,
  },
  time: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default TaskItem;
