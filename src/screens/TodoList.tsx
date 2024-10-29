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
import Header from "../components/Header";
import AddTodo from "../components/AddTodo";
import TodoItem from "../components/TodoItem";

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

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
        const todoRef = doc(db, "users", user.uid, "todos", id);
        await updateDoc(todoRef, { completed: !todo.completed });
        fetchTodos();
      }
    } else {
      console.error("User not authenticated");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const renderFooter = () => (
      <View className="max-w-md p-4 pt-1 pb-8 mx-auto">
        <Pressable
          className="w-16 p-4 bg-blue-400 rounded-full shadow-lg "
          onPress={() => setModalVisible(true)}
        >
          <Text className="pl-2 text-2xl text-white">+</Text>
        </Pressable>
        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle="pageSheet"
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="items-center justify-center flex-1">
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
  );

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
          <FlatList
            data={todos}
            ListHeaderComponent={<Header />}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
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
              </View>
            )}
            ListFooterComponent={renderFooter}
          />
      )}
    </View>
  );
};

export default TodoList;
