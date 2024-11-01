import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { useRoute, useNavigation } from "@react-navigation/native";

const EditTodo: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { id, initialTask, onUpdate } = route.params as {
    id: string;
    initialTask: string;
    onUpdate: () => void;
  };
  const [task, setTask] = useState(initialTask);

  const handleUpdateTodo = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user && task.trim()) {
      const todoRef = doc(db, "users", user.uid, "todos", id);
      await updateDoc(todoRef, { task });
      onUpdate();
      setIsLoading(false);
      navigation.goBack();
    } else {
      setIsLoading(false);
    }
  };

  return (
    <View className="items-center justify-center flex-1 w-full p-4">
      <TextInput
        placeholder="Edit Task..."
        value={task}
        onChangeText={setTask}
        className="flex w-full h-16 pl-5 mb-10 border-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-700"
      />
      <Pressable
        className="px-[20] py-[12] rounded-lg bg-blue-400 shadow-sm w-full"
        onPress={() => {
          handleUpdateTodo();
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Text className="font-bold text-center text-white uppercase">
            Update
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default EditTodo;
