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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const navigation = useNavigation();

  const handleSignup = async () => {
    setIsLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { userName, email });
      navigation.navigate("TodoList", { userName });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email");
      } else if (error.code === "auth/weak-password") {
        setError("Weak password");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="items-center justify-center flex-1 p-4">
      <View className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <Text className="text-2xl font-bold text-center">Sign Up</Text>
        <TextInput
          placeholder="Username"
          value={userName}
          onChangeText={setUserName}
          className="w-full px-3 py-2 mt-1 border rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
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
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Button title="Sign Up" onPress={handleSignup} />
        )}
        <Text
          onPress={() => navigation.navigate("Login" as never)}
          className="mt-4 text-base font-medium"
        >
          Already have an account?
          <Text className="text-lg font-medium text-blue-500">Login</Text>
        </Text>
      </View>
    </View>
  );
};

export default Signup;
