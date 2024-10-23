import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import TodoList from '../screens/TodoList';
import EditTodo from '../components/EditTodo';

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  TodoList: { userName: string };
  EditTodo: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="TodoList" component={TodoList} />
      <Stack.Screen name="EditTodo" component={EditTodo} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
