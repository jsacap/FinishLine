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
  // Add props here
  const icons = [
    "account",
    "airballoon",
    "allergy",
    "archive",
    "alarm",
    "basketball",
    "cake",
    "camera",
    "chat",
    "dog",
    "email",

    "heart",
    "ice-cream",
    "kettle",
    "lock",
    "map",
    "nail",
    "office-building",
    "pine-tree",
    "rocket",
    "school",
    "wallet",
    "washing-machine",
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
