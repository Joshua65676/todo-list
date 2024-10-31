import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, deleteDoc, updateDoc, doc, DocumentData } from 'firebase/firestore';
import Header from '../components/Header';
import TodoItem from '../components/TodoItem';
import { RootStackParamList } from "../types/NavigationTypes";
import { StackNavigationProp } from '@react-navigation/stack';

interface Todo {
  id: string;
  task: string;
  completed: boolean;
}
type TodoListScreenProp = StackNavigationProp<RootStackParamList, 'TodoList'>;

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

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

  useEffect(() => {
    fetchTodos();
  }, []);

  const deleteTodo = async (id: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const todoRef = doc(db, 'users', user.uid, 'todos', id);
        await deleteDoc(todoRef);
        fetchTodos();
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
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
      console.error('User not authenticated');
    }
  };

  const renderFooter = () => (
    <View className="relative max-w-md p-4 pt-1 mx-auto pb- bottom-20">
      <Pressable
        className="w-16 p-4 bg-blue-400 rounded-full shadow-lg"
        onPress={() => navigation.navigate('AddTodo', { fetchTodos })}
      >
        <Text className="pl-2 text-2xl text-white">+</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
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
      )}
    </View>
  );
};

export default TodoList;
