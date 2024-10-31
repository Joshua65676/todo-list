// Footer.js
import React from "react";
import { View, Pressable, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';

interface FooterProps {
    fetchTodos: () => void;
}

const Footer: React.FC<FooterProps> = ({ fetchTodos }) => {
  const navigation = useNavigation();

  return (
    <View>
      <View className="max-w-md p-4 pt-1 pb-8 mx-auto">
        <Pressable
          className="w-16 p-4 bg-blue-400 rounded-full shadow-lg "
          onPress={() => navigation.navigate('AddTodo', { fetchTodos })}
        >
          <Text className="pl-2 text-2xl text-white">+</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Footer;
