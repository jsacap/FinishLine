import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";

import { StyleSheet } from "react-native";

import colors from "../config/colors";

function IconButton({ iconName, size, color, style, onPress }) {
  return (
    <FontAwesome5
      name={iconName}
      size={size || 24}
      color={color || colors.white}
      style={[styles.icon, { ...style }]}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 30,
    width: 40,
    height: 40,
    marginTop: 10,
  },
});

export default IconButton;
