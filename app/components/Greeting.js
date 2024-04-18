import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import AppText from "./AppText/AppText";
import colors from "../config/colors";

function Greeting({ user }) {
  const [greet, setGreet] = useState("Evening");
  const findGreet = () => {
    const hrs = new Date().getHours();
    if (hrs === 0 || hrs < 12) return setGreet("Morning");
    if (hrs >= 12 && hrs < 17) return setGreet("Afternoon");
    setGreet("Evening");
  };
  useEffect(() => {
    findGreet();
  }, []);
  return (
    <AppText style={styles.greeting}>{`Good ${greet} ${user.name}!`}</AppText>
  );
}
const styles = StyleSheet.create({
  greeting: {
    color: colors.darkCharcoal,
    fontSize: 20,
  },
});
export default Greeting;
