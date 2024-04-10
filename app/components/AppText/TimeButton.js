import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../config/colors";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import AppText from "./AppText";

export default function TimeButton({ time, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <AppText style={styles.plus}>+</AppText>
      <AppText style={styles.time}>{time}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    flexDirection: "row",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: colors.white,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.medium,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    color: colors.black,
    fontWeight: "bold",
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
  },
  plus: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
