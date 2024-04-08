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
  const openHeight = screenHeight / 2;

  const translateY = useRef(new Animated.Value(screenHeight)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(translateY, {
        toValue: screenHeight - openHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, translateY, screenHeight, openHeight]);
  if (!isVisible) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
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
