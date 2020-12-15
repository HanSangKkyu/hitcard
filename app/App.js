import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import MyProblemSetScreen from './screens/MyProblemSetScreen';
import CategoryScreen from './screens/CategoryScreen';
import SolveScreen from './screens/SolveScreen';
import MakeScreen from './screens/MakeScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="MakeScreen" component={MakeScreen} />
        <Stack.Screen name="SolveScreen" component={SolveScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="MyProblemSetScreen" component={MyProblemSetScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;