import React from "react";
import { Text, View, StyleSheet } from "react-native";

import colors from "../config/colors";

function Header({ children, style }) {
  return (
    <View style={styles.headerContainer}>
      <Text style={[styles.headerText, style]}>{children}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 20,
    color: colors.black,
  },
});

export default Header;
