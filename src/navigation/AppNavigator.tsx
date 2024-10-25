import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import TodoList from "../screens/TodoList";
import EditTodo from "../components/EditTodo";
import { auth } from "../firebaseConfig";

type RootStackParamList = {
  Home: undefined,
  LogIn: undefined;
  SignUp: undefined;
  TodoList: { userName: string };
  EditTodo: undefined;
};

declare global {
    namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        auth.onAuthStateChanged((user) => {
          if (user) {
            setInitialRoute("TodoList");
          } else {
            setInitialRoute("Home");
          }
        });
      } else {
        setInitialRoute("Home");
      }
    };

    checkUser();
  }, []);

  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute as keyof RootStackParamList}>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
        <Stack.Screen name="LogIn" component={Login} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="TodoList" component={TodoList}  />
        <Stack.Screen name="EditTodo" component={EditTodo} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppNavigator;
