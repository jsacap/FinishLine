import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { ScreenStackHeaderBackButtonImage } from "react-native-screens";
import colors from "../config/colors";

const screenHeight = Dimensions.get("window").height;

export default function BottomSheet({ isVisible, children, onClose }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, screenHeight * 0.5],
  });

  useEffect(() => {
    if (isVisible) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={StyleSheet.overlay}>
        <Animated.View
          style={[styles.container, { transform: [{ translateY }] }]}
        >
          {children}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    height: screenHeight * 0.5,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
});
