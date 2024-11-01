import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Pressable,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, auth } from "../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  DocumentData,
} from "firebase/firestore";
import Header from "../components/Header";
import TodoItem from "../components/TodoItem";
import { RootStackParamList } from "../types/NavigationTypes";
import { StackNavigationProp } from "@react-navigation/stack";

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}
type TodoListScreenProp = StackNavigationProp<RootStackParamList, "TodoList">;

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const navigation = useNavigation();

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

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id: string) => {
    try {
      setIsActionLoading(true);
      const user = auth.currentUser;
      if (user) {
        const todoRef = doc(db, "users", user.uid, "todos", id);
        await deleteDoc(todoRef);
        fetchTodos();
      } else {
        console.error("User not authenticated");
      }
      setIsActionLoading(false);
    } catch (error) {
      console.error("Error deleting todo:", error);
      setIsActionLoading(false);
    }
  };

  const toggleComplete = async (id: string) => {
    try {
      setIsActionLoading(true);
      const user = auth.currentUser;
      if (user) {
        const todo = todos.find((todo) => todo.id === id);
        if (todo) {
          const todoRef = doc(db, "users", user.uid, "todos", id);
          await updateDoc(todoRef, { completed: !todo.completed });
          fetchTodos();
        }
      } else {
        console.error("User not authenticated");
      }
      setIsActionLoading(false);
    } catch (error) {
      console.error("Error updating todo:", error);
      setIsActionLoading(false);
    }
  };

  const renderFooter = () => (
    <View className="relative max-w-md p-4 pt-1 mx-auto pb- bottom-20">
      <Pressable
        className="w-16 p-4 bg-blue-400 rounded-full shadow-lg"
        onPress={() => navigation.navigate("AddTodo", { fetchTodos })}
      >
        <Text className="pl-2 text-2xl text-white">+</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
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
        <>
          <FlatList
            data={todos}
            ListHeaderComponent={<Header />}
            ListFooterComponent={renderFooter}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <TodoItem
                  id={item.id}
                  task={item.task}
                  completed={item.completed}
                  onDelete={deleteTodo}
                  onUpdate={fetchTodos}
                  onToggleComplete={toggleComplete}
                />
              </View>
            )}
          />
          {isActionLoading && (
            <View
              style={{
                position: "absolute",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                top: "50%",
                left: "50%",
                transform: [{ translateX: -5 }, { translateY: -5 }],
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default TodoList;
