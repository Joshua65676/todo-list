import React, { useState } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

const AddTodo: React.FC<{ onAdd: () => void }> = ({ onAdd }) => {
  const [task, setTask] = useState("");

  const handleAddTodo = async () => {
    const user = auth.currentUser;
    if (user && task.trim()) {
      const userTodosRef = collection(db, "users", user.uid, "todos");
      await addDoc(userTodosRef, { task, completed: false });
      setTask("");
      onAdd();
    }
  };

  return (
    <View className="flex flex-row gap-2 p-4 mb-4">
      <TextInput
        placeholder="New Task"
        value={task}
        onChangeText={setTask}
        className="flex w-64 h-12.5 pl-5 border-2 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-700"
      />
      <Pressable className="px-[20] py-[12] rounded bg-blue-600 shadow-sm" onPress={handleAddTodo}>
        <Text className="font-bold text-white">Add</Text>
      </Pressable>
    </View>
  );
};

export default AddTodo;
