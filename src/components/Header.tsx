import { View, Text, Pressable, Alert } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebaseConfig";
import { useRoute, useNavigation } from "@react-navigation/native";

const Header: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userName } = route.params as { userName: string };

  const handleLogout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem("userToken");
    navigation.navigate("LogIn");
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

  return (
    <View className="p-4">
      <View className="flex flex-row justify-between">
        <View className="pl-5">
          <Text className="mb-1 font-medium text-md">Today</Text>
          <Text className="mb-4 text-xl font-bold">{getCurrentDate()}</Text>
        </View>
        <View>
          <Pressable
            onPress={() => {
              Alert.alert(
                "Alert",
                "You are trying to log out, would you like to continue?",
                [
                  { text: "Cancel", onPress: () => null },
                  { text: "Ok", onPress: () => handleLogout() },
                ]
              );
            }}
          >
            <Text>LogOut</Text>
          </Pressable>
        </View>
      </View>
      <View className="h-32 p-4 pl-5 mt-3 bg-blue-400 rounded-xl">
        <Text className="mb-2 text-xl font-bold text-white">
          Welcome, {userName}!
        </Text>
        <Text className="text-base font-semibold text-white">
          Keep it up!! Complete your tasks. You almost there!
        </Text>
      </View>
    </View>
  );
};

export default Header;
