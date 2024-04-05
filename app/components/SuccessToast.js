import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";
import colors from "../config/colors";

// Function name matches what you register
export default function CustomToast({ text1, text2, props }) {
  return (
    <View style={styles.container}>
      {" "}
      {/* Corrected to style */}
      <Text style={styles.text1}>{text1}</Text>
      <Text style={styles.text2}>{text2}</Text>{" "}
      {/* Corrected the closing bracket and the name */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
  },
  text1: {
    fontSize: 24,
    color: colors.black,
  },
  text2: {
    fontSize: 16,
    color: colors.black,
  },
});

// Ensure the function name here matches your component
Toast.registerCustomToast("SuccessToast", CustomToast);
