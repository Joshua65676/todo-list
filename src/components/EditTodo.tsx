import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Pressable } from 'react-native';

const EditTodo: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, initialTask, onUpdate } = route.params as { id: string, initialTask: string, onUpdate: () => void };
  const [task, setTask] = useState(initialTask);

  const handleUpdateTodo = async () => {
    const user = auth.currentUser;
    if (user && task.trim()) {
      const todoRef = doc(db, 'users', user.uid, 'todos', id);
      await updateDoc(todoRef, { task });
      onUpdate();
      navigation.goBack();
    }
  };

  return (
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
            handleUpdateTodo();
          }}
        >
          <Text className="font-bold text-center text-white uppercase">
            Add Edit
          </Text>
        </Pressable>
      </View>
  );
};

export default EditTodo;
