import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
const logo = require("../../assets/file-splash.png");

const Home = () => {
  const navigation = useNavigation();
  return (
    <View className="flex-1 p-4 -mt-40 w-full max-w-md bg-white items-center justify-center">
      <View className="mb-0">
        <View className="-mt-40 -mb-20">
          <Image source={logo} className="h-[500]" />
        </View>
        <View className=" items-center -mt-20">
          <Text className="text-2xl font-bold">Welcome to Todo Task</Text>
        </View>
      </View>

      <View className="flex-row gap-5 bottom-14 absolute">
        <View className="">
          <Pressable className="bg-blue-500 w-32 h-10 p-1 rounded-lg">
            <Text className="text-center text-lg font-bold text-white" onPress={() => navigation.navigate("LogIn")}>
              Log In
            </Text>
          </Pressable>
        </View>
        <View className="">
          <Pressable className="bg-amber-600 w-32 h-10 p-1 rounded-lg">
            <Text
              className="text-center text-lg font-bold text-white"
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Home;
