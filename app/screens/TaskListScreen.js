import BottomSheet from "@gorhom/bottom-sheet";
import Constants from "expo-constants";
import { useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import IconButton from "../components/IconButton";
import IncompleteTaskList from "../components/IncompleteTaskList";
import colors from "../config/colors";
import useTaskStore from "../store/TaskStore";
import AddTaskScreen from "./AddTaskScreen";

export default function TaskListScreen() {
  const { loadTasks, isBottomSheetVisible, openBottomSheet, closeBottomSheet } =
    useTaskStore((state) => ({
      loadTasks: state.loadTasks,
      isBottomSheetVisible: state.isBottomSheetVisible,
      openBottomSheet: state.openBottomSheet,
      closeBottomSheet: state.closeBottomSheet,
    }));

  const snapPoints = useMemo(() => ["25%", "50%", "70%"]);
  const bottomSheetRef = useRef(null);

  const snapToIndex = (index) => bottomSheetRef.current?.snapToIndex(index);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    if (isBottomSheetVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isBottomSheetVisible]);

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <AppButton title="Add Task" onPress={openBottomSheet} />
      </View>
      <View style={styles.incompleteList}>
        <Text>ASD</Text>
        <IncompleteTaskList />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        keyboardBehavior="extend"
        snapPoints={snapPoints}
        enablePanDownToClose={true}
      >
        <View style={styles.contentContainer}>
          <IconButton
            iconName="arrow-down"
            style={styles.closeBottomSheet}
            onPress={closeBottomSheet}
            color={colors.black}
          />
          <AddTaskScreen />
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    padding: 20,
  },
  closeBottomSheet: {
    backgroundColor: colors.medium,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
    color: "#fff",
  },
  incompleteList: {
    flex: 1,
    justifyContent: "center",

    alignItems: "center",
    width: "100%",
  },
});
