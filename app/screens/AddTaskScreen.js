import { TouchableHighlight } from "@gorhom/bottom-sheet";
import { StyleSheet, View, Keyboard } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import TimeButton from "../components/AppText/TimeButton";
import IconButton from "../components/IconButton";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";

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
  }));

  const handleSave = () => {
    Keyboard.dismiss();
    if (selectedTaskId) {
      updateTask();
    } else {
      addTask();
    }
    // closeBottomSheet();
  };

  const incrementTime = (minutes) => {
    Keyboard.dismiss();
    const totalMinutes = taskMinutes + minutes;
    setTaskMinutes(totalMinutes);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <IconButton iconName="check" onPress={handleSave} />
        {selectedTaskId && (
          <IconButton
            iconName="trash-alt"
            style={styles.deleteButton}
            onPress={() => deleteTask(selectedTaskId)}
          />
        )}
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Task"
        value={taskInput}
        onChangeText={setTaskInput}
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
      <View style={styles.presetTimeButtons}>
        <TimeButton time={1} onPress={() => incrementTime(1)} />
        <TimeButton time={5} onPress={() => incrementTime(5)} />
        <TimeButton time={15} onPress={() => incrementTime(15)} />
        <TimeButton time={30} onPress={() => incrementTime(30)} />
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
    justifyContent: "space-evenly",
    width: "90%",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: colors.danger,
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
