import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { useRoute, useNavigation } from '@react-navigation/native';

const EditTodo: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id, initialTask, onUpdate } = route.params as { id: string, initialTask: string, onUpdate: () => void };
  const [task, setTask] = useState(initialTask);

  const handleUpdateTodo = async () => {
    if (task.trim()) {
      await updateDoc(doc(db, 'todos', id), { task });
      onUpdate();
      navigation.goBack();
    }
  };

  return (
    <View className="items-center justify-center flex-1 p-4">
      <TextInput
        placeholder="Edit todo"
        value={task}
        onChangeText={setTask}
        className="w-full p-2 mb-4 border"
      />
      <Button title="Update" onPress={handleUpdateTodo} />
    </View>
  );
};

export default EditTodo;
