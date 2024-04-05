import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Button,
  Image,
  Text,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import colors from "../config/colors";
import AppButton from "../components/AppButton";
import Clock from "../components/Clock";
import AppText from "../components/AppText/AppText";
import Greeting from "../components/Greeting";
import useFindUser from "../hooks/useFindUser";

function WelcomeScreen() {
  const user = useFindUser();
  console.log(user);
  const navigation = useNavigation();
  return (
    <ImageBackground
      blurRadius={2}
      style={styles.background}
      source={require("../assets/Background.jpg")}
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={styles.tagLine}>Finish Line</Text>
      </View>
      <View style={styles.clock}>
        <Greeting user={user} />
        <Clock />
      </View>

      <AppButton
        title="START"
        onPress={() => {
          navigation.navigate("TaskList");
        }}
      />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagLine: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 20,
  },
  clock: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default WelcomeScreen;
