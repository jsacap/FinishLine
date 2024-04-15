import React, { useCallback, useMemo, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import useTaskStore from "../store/TaskStore";

const TaskListScreen = () => {
  const { isBottomSheetVisible, toggleBottomSheetVisibility } = useTaskStore(
    (state) => ({
      isBottomSheetVisible: state.isBottomSheetVisible,
      toggleBottomSheetVisibility: state.toggleBottomSheetVisibility,
    })
  );

  const bottomSheetModalRef = useRef(null);

  const snapPoints = useMemo(() => ["25%", "50%"], []);

  // Effect to auto-present or close bottom sheet based on state
  useEffect(() => {
    if (isBottomSheetVisible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.close();
    }
  }, [isBottomSheetVisible]);

  const handleSheetChanges = useCallback(
    (index) => {
      console.log("handleSheetChanges", index);
      // Optional: update the visibility state when the bottom sheet is dismissed
      if (index === -1) {
        toggleBottomSheetVisibility();
      }
    },
    [toggleBottomSheetVisibility]
  );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Button
          onPress={toggleBottomSheetVisibility}
          title="Toggle Bottom Sheet"
          color="black"
        />
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>Awesome 🎉</Text>
            {/* You can place any child component here */}
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default TaskListScreen;
