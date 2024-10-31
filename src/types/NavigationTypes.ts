export type RootStackParamList = {
    TodoList: undefined;
    AddTodo: { fetchTodos: () => Promise<void> };
  };
