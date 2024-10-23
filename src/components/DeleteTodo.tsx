import React from "react";
import { Button } from "react-native";
import { db } from "../firebaseConfig";
import { deleteDoc, doc } from "firebase/firestore";

const DeleteTodo: React.FC<{ id: string; onDelete: () => void }> = ({
  id,
  onDelete
}) => {
  const handleDeleteTodo = async () => {
  try {
    await deleteDoc(doc(db, "todos", id));
    onDelete();
  } catch (error) {
    console.error('Error deleting todo:', error);
  }

  };

  return <Button title="Delete" onPress={handleDeleteTodo} />;
};

export default DeleteTodo;
