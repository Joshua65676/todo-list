import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { TailwindProvider } from 'tailwindcss-react-native';

const App: React.FC = () => {
  return (
    <TailwindProvider>
      <AppNavigator />
    </TailwindProvider>
  );
};

export default App;
