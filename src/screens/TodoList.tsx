import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Modal,
  Pressable,
} from "react-native";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import AddTodo from "../components/AddTodo";
import TodoItem from "../components/TodoItem";
import { useRoute } from "@react-navigation/native";

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute();
  const { userName } = route.params as { userName: string };

  const fetchTodos = async () => {
    const user = auth.currentUser;
    if (user) {
      setIsLoading(true);
      const userTodosRef = collection(db, "users", user.uid, "todos");
      const todosCollection = await getDocs(userTodosRef);
      const todosData = todosCollection.docs.map((doc: DocumentData) => ({
        id: doc.id,
        task: doc.data().task,
        completed: doc.data().completed,
      }));
      setTodos(todosData);
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const todoRef = doc(db, "users", user.uid, "todos", id);
        await deleteDoc(todoRef);
        fetchTodos();
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id: string) => {
    const user = auth.currentUser;
    if (user) {
      const todo = todos.find((todo) => todo.id === id);
      if (todo) {
        const todoRef = doc(db, 'users', user.uid, 'todos', id);
        await updateDoc(todoRef, { completed: !todo.completed });
        fetchTodos();
      }
    } else {
      console.error("User not authenticated");
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="max-w-md mx-auto">
      <View className="p-4">
        <View className="pl-5">
          <Text className="mb-1 font-medium text-md">Today</Text>
          <Text className="mb-4 text-xl font-bold">{getCurrentDate()}</Text>
        </View>
        <View className="h-32 p-4 pl-5 mt-3 bg-blue-400 rounded-xl">
          <Text className="mb-2 text-xl font-bold text-white">
            Welcome, {userName}!
          </Text>
          <Text className="text-base font-semibold text-white">
            Keep it up!! Complete your tasks. You almost their!
          </Text>
        </View>
      </View>
      <View className="max-w-md p-4 pt-1 pb-8 mx-auto">
        <View className="">
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TodoItem
                id={item.id}
                task={item.task}
                completed={item.completed}
                onDelete={deleteTodo}
                onUpdate={fetchTodos}
                onToggleComplete={toggleComplete}
              />
            )}
          />
        </View>
        <Pressable
          className="absolute bottom-0 w-16 p-4 bg-blue-400 rounded-full shadow-lg left-[315px]"
          onPress={() => setModalVisible(true)}
        >
          <Text className="pl-2 text-2xl text-white ">+</Text>
        </Pressable>
        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle="pageSheet"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="items-center justify-center flex-1 bg-opacity-50">
            <View className="mb-10">
              <Text className="text-2xl font-bold">New Task</Text>
            </View>
            <View className="w-full p-5 bg-white rounded-lg shadow-lg">
              <AddTodo onAdd={fetchTodos} />
              <Pressable
                className="px-[20] py-[12] rounded-lg bg-red-600 shadow-sm w-full"
                onPress={() => setModalVisible(false)}
              >
                <Text className="font-bold text-center text-white uppercase">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default TodoList;
