import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/NavigationTypes";

const AddTodo: React.FC = () => {
  const [task, setTask] = useState("");
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "AddTodo">>();
  const { fetchTodos } = route.params;

  const handleAddTodo = async () => {
    const user = auth.currentUser;
    if (user && task.trim()) {
      const userTodosRef = collection(db, "users", user.uid, "todos");
      await addDoc(userTodosRef, { task, completed: false });
      setTask("");
      fetchTodos();
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView>
      <View className="flex items-center justify-center w-full p-4">
        <TextInput
          placeholder="Add Task..."
          value={task}
          onChangeText={setTask}
          className="flex w-full h-16 pl-5 mb-10 border-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-700"
        />
        <Pressable
          className="px-[20] py-[12] rounded-lg bg-blue-400 shadow-sm w-full"
          onPress={() => {
            handleAddTodo();
          }}
        >
          <Text className="font-bold text-center text-white uppercase">
            Add
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTodo;
