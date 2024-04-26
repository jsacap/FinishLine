import React, { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const IconPicker = ({ visible, onSelect, onClose }) => {
  const icons = [
    "home",
    "account",
    "bell",
    "calendar",
    "camera",
    "cart",
    "chart-bar",
    "checkbox-marked-circle",
    "chevron-right",
    "close",
    "email",
    "file-document",
    "folder",
    "heart",
    "help-circle",
    "information",
    "lock",
    "login",
    "logout",
    "magnify",
    "map-marker",
    "menu",
    "pencil",
    "plus",
    "plus-circle",
    "star",
    "tag",
    "trash-can",
    "wallet",
    "weather-sunny",
    "android",
    "apple",
    "timer",
    "play-circle",
    "stop-circle",
    "account-multiple",
    "alert",
    "delete",
    "download",
    "upload",
    "music-note",
    "phone",
    "printer",
    "soccer",
    "table-chair",
    "tablet-android",
    "television",
    "wifi",
    "lamp",
    "robot",
    "emoticon-happy",
    "emoticon-excited",
    "emoticon-sad",
    "emoticon-angry",
    "emoticon-confused",
    "emoticon-neutral",
    "emoticon-poop",
    "emoticon-tongue",
    "emoticon-dead",
    "emoticon-cool",
    "emoticon-kiss",
    "emoticon-wink",
    "emoticon-lol",
    "emoticon",
    "face-woman",
    "weight-lifter",
    "weight",

    "face-woman-outline",
    "face-woman-profile",
    "face-man",
    "face-man-outline",
    "face-man-profile",
    "face-man-shimmer",
    "face-man-shimmer-outline",
    "face-recognition",
    "ghost",
    "ghost-off",
    "alien",
    "alien-outline",
    "skull",
    "skull-crossbones",
    "skull-outline",
    "robot",
    "robot-industrial",
    "robot-love",
    "robot-mower",
    "robot-mower-outline",
    "robot-off",
    "robot-off-outline",
    "robot-outline",
    "robot-vacuum",
    "console",
    "robot-vacuum-variant",
    "heart",
    "heart-broken",
    "heart-circle",
    "heart-flash",
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredIcons = icons.filter((icon) =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onPress={() => onSelect(item)}
              >
                <MaterialCommunityIcons
                  name={item}
                  size={36}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.iconButton} onPress={onClose}>
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
