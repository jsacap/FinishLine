import { StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import colors from "../../config/colors";
import AppText from "./AppText";

export default function TimeButton({ time, onPress }) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    Keyboard.dismiss();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <AppText style={styles.plus}>+</AppText>
      <AppText style={styles.time}>{time}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    flexDirection: "row",
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    backgroundColor: colors.white,
  },
  innerContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.medium,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  text: {
    color: colors.black,
    fontWeight: "bold",
  },
  time: {
    fontSize: 18,
    fontWeight: "bold",
  },
  plus: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
