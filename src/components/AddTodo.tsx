import React, { useState } from "react";
import { View, TextInput, Text, Pressable, KeyboardAvoidingView } from "react-native";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const AddTodo: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const [task, setTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleAddTodo = async () => {
    console.log("handleAddTodo called");
    const user = auth.currentUser;
    if (user && task.trim()) {
      const userTodosRef = collection(db, "users", user.uid, "todos");
      await addDoc(userTodosRef, { task, completed: false });
      setTask("");
      onAdd();
    }
  };

  return (
    <KeyboardAvoidingView>
      <View className="flex flex-col w-full gap-2 mb-4">
        <TextInput
          placeholder="Add Task..."
          value={task}
          onChangeText={setTask}
          className="flex w-full h-16 pl-5 mb-10 border-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-700"
        />
        <Pressable
          className="px-[20] py-[12] rounded-lg bg-blue-400 shadow-sm w-full"
          onPress={() => {
            console.log("Pressable clicked");
            handleAddTodo();
          }}
        >
          <Text className="font-bold text-center text-white uppercase">
            Create
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTodo;
