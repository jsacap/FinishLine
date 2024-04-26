import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

function TaskItemSwipeStatus({ onPress, status }) {
const iconName = status === 'incomplete' ? 'check' : 'undo-variant';

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onPress}>
        <MaterialCommunityIcons
          name={iconName}
          size={35}
          color={colors.white}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkGrayBlue,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
export default TaskItemSwipeStatus;
