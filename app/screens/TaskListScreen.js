import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import colors from "../config/colors";
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

  const snapToIndex = (index) => bottomSheetRef.current?.snapToIndex(index);

  return (
    <View style={styles.container}>
      <View style={styles.buttons}>
        <AppButton title="Add Task" onPress={handleOpenPress} />
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
            onPress={handleClosePress}
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
    justifyContent: "center",
    height: "auto",
    alignItems: "center",
    width: "100%",
    backgroundColor: "blue",
  },
});
