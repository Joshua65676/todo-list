import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
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
  const route = useRoute();
  const { userName } = route.params as { userName: string };

  const fetchTodos = async () => {
    const user = auth.currentUser;
    if (user) {
      setIsLoading(true);
      const userTodosRef = collection(db, 'users', user.uid, 'todos');
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
        const todoRef = doc(db, 'users', user.uid, 'todos', id);
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
    const todo = todos.find((todo) => todo.id === id);
    if (todo) {
      await updateDoc(doc(db, "todos", id), { completed: !todo.completed });
      fetchTodos();
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View className="max-w-md p-4 pt-10 pb-8 mx-auto mt-10 bg-white rounded-lg shadow-lg">
      <Text className="mb-4 text-lg font-bold">Welcome, {userName}!</Text>
      <AddTodo onAdd={fetchTodos} />
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
  );
};

export default TodoList;
