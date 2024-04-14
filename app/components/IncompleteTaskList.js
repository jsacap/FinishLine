import { View, Text, StyleSheet } from "react-native";
import React from "react";
import useTaskStore from "../store/TaskStore";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import TaskItem from "./TaskItem";

export default function IncompleteTaskList() {
  const incompleteTasks = useTaskStore((state) => state.getIncompleteTasks());
  console.log(incompleteTasks);

  const renderItem = ({ item }) => (
    <TouchableOpacity>
      <TaskItem
        title={item.name}
        time={`${Math.floor(item.durationMinutes / 60)}h:${
          item.durationMinutes % 60
        }m`}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={incompleteTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detail: {
    fontSize: 16,
    color: "#666",
  },
  status: {
    fontSize: 14,
    color: "#2f2f2f",
  },
});
