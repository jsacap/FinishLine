import { View, Text, StyleSheet } from "react-native";
import colors from "../config/colors";
import React, { useCallback, useRef } from "react";
import AppText from "../components/AppText/AppText";
import { TextInput } from "react-native-gesture-handler";
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
  TouchableHighlight,
} from "@gorhom/bottom-sheet";
import TimeButton from "../components/AppText/TimeButton";
import IconButton from "../components/IconButton";

export default function AddTaskScreen() {
  return (
    <View style={styles.container}>
      <TouchableHighlight onPress={() => console.log("Added")}>
        <IconButton iconName="check" onPress={() => console.log("pressed")} />
      </TouchableHighlight>
      <TextInput style={styles.textInput} placeholder="Task" keyb />
      <View style={styles.timeInputs}>
        <TextInput
          keyboardType="numeric"
          style={styles.numberLayout}
          placeholder="Hours"
        />
        <TextInput
          keyboardType="numeric"
          style={styles.numberLayout}
          placeholder="Minutes"
        />
      </View>
      <View style={styles.presetTimeButtons}>
        <TimeButton time={1} />
        <TimeButton time={5} />
        <TimeButton time={15} />
        <TimeButton time={30} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-evenly",
    width: "90%",
    alignItems: "center",
  },
  numberLayout: {
    borderWidth: 2,
    textAlign: "center",
    borderColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 10,
    fontSize: 14,
    marginRight: 20,
    marginBottom: 10,
  },
  presetTimeButtons: {
    flexDirection: "row",
  },
  textInput: {
    borderWidth: 2,
    borderColor: colors.black,
    textAlign: "center",
    width: "90%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    fontSize: 20,
  },
  timeInputs: {
    flexDirection: "row",
  },
});
