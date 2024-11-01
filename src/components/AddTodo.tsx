import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/NavigationTypes";

const AddTodo: React.FC = () => {
  const [task, setTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, "AddTodo">>();
  const { fetchTodos } = route.params;

  const handleAddTodo = async () => {
    setIsLoading(true);
    const user = auth.currentUser;
    if (user && task.trim()) {
      const userTodosRef = collection(db, "users", user.uid, "todos");
      await addDoc(userTodosRef, { task, completed: false });
      setTask("");
      fetchTodos();
      setIsLoading(false);
      navigation.goBack();
    } else {
      setIsLoading(false);
    }
  };

  return (
      <View className="items-center justify-center flex-1 w-full p-4">
        <TextInput
          placeholder="Add Task..."
          value={task}
          onChangeText={setTask}
          className="flex w-full h-16 pl-5 mb-5 border-2 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-700"
        />
        <Pressable
          className="px-[20] py-[12] rounded-lg bg-blue-400 shadow-sm w-full"
          onPress={() => {
            handleAddTodo();
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
              Create
            </Text>
          )}
        </Pressable>
      </View>
  );
};

export default AddTodo;
