import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import BackgroundTimer from "react-native-background-timer";

export default function SandBox() {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    // Start a background timer
    const timerId = BackgroundTimer.runBackgroundTimer(() => {
      setSeconds((secs) => {
        if (secs > 0) return secs - 1;
        BackgroundTimer.stopBackgroundTimer();
        return 0;
      });
    }, 1000);

    return () => {
      // Cleanup the timer on component unmount
      BackgroundTimer.stopBackgroundTimer();
      BackgroundTimer.clearInterval(timerId);
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Sandbox - Timer</Text>
      <Text>{seconds} seconds remaining</Text>
    </View>
  );
}
