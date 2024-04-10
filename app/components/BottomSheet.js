import React, { useEffect, useRef, useState } from "react";

import LinearGradient from "react-native-linear-gradient";
import {
  Animated,
  Dimensions,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import colors from "../config/colors";

const BottomSheet = ({ isVisible, children, onClose }) => {
  const screenHeight = Dimensions.get("window").height;
  const [bottomSheetHeight, setBottomSheetHeight] = useState(screenHeight / 2);
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const openHeight = screenHeight / 2;
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        const newHeight = screenHeight - keyboardHeight - 20;
        setBottomSheetHeight(newHeight);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setBottomSheetHeight(screenHeight / 2);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [screenHeight]);

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
    <TouchableWithoutFeedback>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              height: bottomSheetHeight,
            },
          ]}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            {children}
          </TouchableWithoutFeedback>
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
    backgroundColor: colors.white,
    height: "50%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: "hidden",
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 16,
  },
});

export default BottomSheet;
