import React from "react";
import { View, StyleSheet, TextInput, Dimensions, Text } from "react-native";
import AppText from "../components/AppText/AppText";

import colors from "../config/colors";
import IconButton from "../components/IconButton";
import { Header } from "react-native/Libraries/NewAppScreen";

function AddTaskScreen(props) {
  return (
    <View style={styles.container}>
      <AppText>Enter task block</AppText>
      <TextInput style={styles.textInput} placeholder="Task Name" />
      <AppText>Estimated Duration</AppText>
      <View style={styles.timeInputs}>
        <TextInput
          style={styles.numberLayout}
          keyboardType="numeric"
          placeholder="HH"
        />
        <Text style={styles.semicolon}>:</Text>
        <TextInput
          style={styles.numberLayout}
          keyboardType="numeric"
          placeholder="MM"
        />
      </View>

      <View style={styles.buttons}>
        <IconButton style={styles.cancelButton} iconName="arrow-left" />
        <IconButton iconName="check" />
      </View>
    </View>
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
  cancelButton: {
    backgroundColor: colors.secondary,
    marginRight: 20,
  },
  buttons: {
    flexDirection: "row",
  },
  numberLayout: {
    borderWidth: 2,
    borderColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 10,
    paddingLeft: 10,
    fontSize: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  timeInputs: {
    flexDirection: "row",
    fontSize: 50,
  },
  semicolon: {
    fontWeight: "bold",
    fontSize: 30,
    marginRight: 20,
  },
});

export default AddTaskScreen;
