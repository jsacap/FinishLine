import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const { height: windowHeight } = Dimensions.get("window");

const IconPicker = ({ visible, onSelect, onClose }) => {
  const icons = [
    "home",
    "account",
    "mail",
    "run",
    "code-braces",
    "bell",
    "cart",
    "bookmark",
    "camera",
    "calendar",
    "phone",
    "map",
    "information-outline",
    "cog",
    "lock",
    "key",
    "account-box",
    "cloud",
    "alert",
    "bank",
    "basket",
    "book",
    "briefcase",
    "lightbulb",
    "car",
    "card",
    "check",
    "chevron-down",
    "chevron-left",
    "chevron-right",
    "chevron-up",
    "clipboard",
    "clock",
    "close",
    "comment",
    "download",
    "eye",
    "facebook",
    "file",
    "filter",
    "flag",
    "folder",
    "gift",
    "heart",
    "image",
    "login",
    "logout",
    "menu",
    "message",
    "plus",
    "refresh",
    "account-box-outline",
    "archive",
    "arrow-down",
    "arrow-left",
    "arrow-right",
    "arrow-up",
    "battery",
    "bike",
    "book-open",
    "border-all",
    "bread-slice",
    "bridge",
    "broom",
    "bug",
    "calculator",
    "calendar-check",
    "camera-off",
    "carrot",
    "chair-rolling",
    "chart-bar",
    "chart-pie",
    "check-circle",
    "cheese",
    "chess-king",
    "chip",
    "church",
    "clipboard-account",
    "cloud-download",
    "cloud-upload",
    "coffee",
    "compass",
    "cow",
    "credit-card",
    "crystal-ball",
    "cup",
    "database",
    "desk",
    "emoticon",
    "emoticon-happy-outline",
    "emoticon-sad-outline",
    "dna",
    "dog",
    "av-timer",
    "test-tube",
    "weight-lifter",
    "dumbbell",
    "earth",
    "email-open",
    "emoticon-happy",
    "engine",
    "file-document",
    "console",
    "food",
    "chart-areaspline",
    "film",
    "fire",
    "fish",
    "flower",
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = icons.filter((icon) =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (icon) => {
    onSelect(icon);
    setSearchQuery(""); // Clear the search query
  };

  const handleClose = () => {
    onClose();
    setSearchQuery(""); // Clear the search query
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search Icons..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredIcons}
            numColumns={4}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleSelect(item)}
              >
                <MaterialCommunityIcons
                  name={item}
                  size={36}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
            style={{ maxHeight: windowHeight * 0.5 }} // Set max height to half of the screen
          />
          <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
            <MaterialCommunityIcons
              name="close-circle"
              size={36}
              color={colors.danger}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchBar: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
  },
});

export default IconPicker;
