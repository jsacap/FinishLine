import React, { useRef } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

const BottomSheet = ({ isVisible, children, onClose }) => {
  // Adjust to control how much of the sheet is visible when opened
  const openHeight = screenHeight / 2; // Opens up to half of the screen height

  const translateY = useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: screenHeight - openHeight, // Move up to show the bottom sheet
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight, // Move down to hide the bottom sheet
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, translateY, screenHeight, openHeight]);

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              // Adjust height to match openHeight if you want a solid background color
              height: openHeight,
            },
          ]}
        >
          <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    height: "50%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0)",
    zIndex: 5,
  },
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    height: "50%", // Adjust as needed
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: "hidden",
    zIndex: 10,
  },
});

export default BottomSheet;
