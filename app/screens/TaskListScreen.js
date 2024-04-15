import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";

import React, { useRef, useMemo } from "react";
import AppButton from "../components/AppButton";
import AddTaskScreen from "./AddTaskScreen";
import IncompleteTaskList from "../components/IncompleteTaskList";
import Constants from "expo-constants";
import IconButton from "../components/IconButton";
import Clock from "../components/Clock";

export default function TaskListScreen() {
  const snapPoints = useMemo(() => ["25%", "50%", "70%"]);
  const bottomSheetRef = useRef(null);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();

  const snapToIndex = (index: number) =>
    bottomSheetRef.current?.snapToIndex(index);

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <AppButton title="Add Task" onPress={handleOpenPress} />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        // backgroundStyle={{ backgroundColor: "#1d0f4e" }}
      >
        <View style={styles.contentContainer}>
          <IconButton iconName="arrow-down" onPress={handleClosePress} />
          <AddTaskScreen />
        </View>
      </BottomSheet>
      <View style={styles.incompleteList}>
        <IncompleteTaskList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 20,
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
    backgroundColor: "blue",
  },
});
