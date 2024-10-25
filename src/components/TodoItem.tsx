import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";

interface TodoItemProps {
  id: string;
  task: string;
  completed: boolean;
  onDelete: (id: string) => void;
  onUpdate: () => void;
  onToggleComplete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  task,
  completed,
  onDelete,
  onUpdate,
  onToggleComplete,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View className="flex-row items-center justify-between w-full p-2 mt-3 border rounded-lg">
      <View className="flex-row gap-1 p-1">
        <Pressable onPress={() => onToggleComplete(id)} className="pt-[2]">
          <Icon
            name={completed ? "check-circle" : "circle-o"}
            size={24}
            color={completed ? "green" : "gray"}
          />
        </Pressable>
        <Text
          style={{ textDecorationLine: completed ? "line-through" : "none" }}
          className="p-1 pl-1 text-sm font-medium"
        >
          {task}
        </Text>
      </View>
      <View className="flex-row gap-2">
        <Pressable
          onPress={() =>
            navigation.navigate("EditTodo", {
              id,
              initialTask: task,
              onUpdate,
            } as never)
          }
          className="pt-[2]"
        >
          <Icon name="edit" size={24} color="blue" />
        </Pressable>
        
        <Pressable onPress={() => {
          Alert.alert(
            'Alert',
            'You are trying to delete this todo, Would you like to continue?',
            [
              { text: 'Cancel', onPress: () => null },
              { text: 'Delete', onPress: () => onDelete(id)}
            ]
          );
          }}>
          <Icon name="trash" size={24} color="red" />
        </Pressable>
      </View>
    </View>
  );
};

export default TodoItem;
