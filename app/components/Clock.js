import React, { useState, useEffect } from "react";
import colors from "../config/colors";
import { Text, View, StyleSheet } from "react-native";

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{currentTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkTransparent,
    borderRadius: 20,
  },
  timeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.platinumWhite,
  },
});

export default Clock;
