import { TouchableHighlight } from "@gorhom/bottom-sheet";
import IconPicker from "../components/IconPicker";
import { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Keyboard,
  TextInput,
  Dimensions,
} from "react-native";
import TimeButton from "../components/AppText/TimeButton";
import IconButton from "../components/IconButton";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";

const { width } = Dimensions.get("window");

export default function AddTaskScreen({ handleClosePress }) {
  const {
    taskInput,
    taskHours,
    taskMinutes,
    setTaskInput,
    setTaskHours,
    setTaskMinutes,
    addTask,
    deleteTask,
    updateTask,
    selectedTaskId,
    closeBottomSheet,
    iconName,
    setIconName,
  } = useTaskStore((state) => ({
    taskInput: state.taskInput,
    taskHours: state.taskHours,
    taskMinutes: state.taskMinutes,
    setTaskInput: state.setTaskInput,
    setTaskHours: state.setTaskHours,
    setTaskMinutes: state.setTaskMinutes,
    addTask: state.addTask,
    deleteTask: state.deleteTask,
    selectedTaskId: state.selectedTaskId,
    updateTask: state.updateTask,
    closeBottomSheet: state.closeBottomSheet,
    iconName: state.iconName,
    setIconName: state.setIconName,
  }));

  const [iconPickerVisible, setIconPickerVisible] = useState(false);

  const handleSave = () => {
    if (selectedTaskId) {
      updateTask();
    } else {
      addTask();
    }
    closeBottomSheet();
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <IconButton iconName="arrow-left" onPress={closeBottomSheet} />
        <IconButton iconName="check" onPress={handleSave} />
        {selectedTaskId && (
          <IconButton
            iconName="trash-can"
            style={styles.deleteButton}
            onPress={() => deleteTask(selectedTaskId)}
          />
        )}
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Task (50 characters max)"
        value={taskInput}
        onChangeText={setTaskInput}
        maxLength={50}
      />
      <View style={styles.timeInputs}>
        <TextInput
          keyboardType="numeric"
          style={styles.numberLayout}
          placeholder="Hours"
          value={taskHours.toString()}
          onChangeText={(text) => setTaskHours(Number(text))}
        />
        <TextInput
          keyboardType="numeric"
          style={styles.numberLayout}
          placeholder="Minutes"
          value={taskMinutes.toString()}
          onChangeText={(text) => setTaskMinutes(Number(text))}
        />
      </View>
      <IconButton
        iconName={iconName || "emoticon"}
        onPress={() => setIconPickerVisible(true)}
      />
      <IconPicker
        visible={iconPickerVisible}
        onSelect={(selectedIcon) => {
          setIconName(selectedIcon);
          setIconPickerVisible(false);
        }}
        onClose={() => setIconPickerVisible(false)}
      />
      <View style={styles.presetTimeButtons}>
        <TimeButton time={1} onPress={() => setTaskMinutes(taskMinutes + 1)} />
        <TimeButton time={5} onPress={() => setTaskMinutes(taskMinutes + 5)} />
        <TimeButton
          time={15}
          onPress={() => setTaskMinutes(taskMinutes + 15)}
        />
        <TimeButton
          time={30}
          onPress={() => setTaskMinutes(taskMinutes + 30)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "90%",
  },
  container: {
    flex: 1,
    backgroundColor: colors.platinumWhite,
    justifyContent: "space-evenly",
    width: "90%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: colors.danger,
  },
  numberLayout: {
    borderWidth: 1,
    textAlign: "center",
    borderColor: colors.primary,
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: 10,
    fontSize: 14,
    marginRight: 20,
    marginBottom: 5,
  },
  presetTimeButtons: {
    flexDirection: "row",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.primary,
    textAlign: "center",
    width: "90%",
    height: width * 0.1,
    borderRadius: 10,
    alignItems: "center",
    fontSize: 12,
  },
  timeInputs: {
    flexDirection: "row",
  },
});
