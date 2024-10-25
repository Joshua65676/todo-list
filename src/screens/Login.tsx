import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const userToken = await userCredential.user.getIdToken();
      await AsyncStorage.setItem("userToken", userToken);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userName = userDoc.data()?.userName;
      if (userName) {
        navigation.navigate("TodoList", { userName });
      } else {
        setError("Username not found");
      }
    } catch (error: any) {
      if (error.code === "auth/invalid-email") {
        setError("Incorrect email");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError("Login failed. Check your Gmail and Password and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="items-center justify-center flex-1 p-4">
      <View className="w-full max-w-md p-8 space-y-6">
        <Text className="text-2xl font-bold text-center">Log In</Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
        <View className="flex-row">
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            className="w-full px-3 py-2 mt-1 mb-4 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <Pressable
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="relative p-2 pt-3 -ml-10"
          >
            <Icon
              name={isPasswordVisible ? "eye" : "eye-slash"}
              size={24}
              color="gray"
            />
          </Pressable>
        </View>
        {error ? <Text className="mb-4 text-red-500">{error}</Text> : null}
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <Button title="Login" onPress={handleLogin} />
        )}
        <Text
          onPress={() => navigation.navigate("Signup" as never)}
          className="mt-4 text-base font-medium"
        >
          Don't have an account?
          <Text className="text-xl font-medium text-blue-500">Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;
