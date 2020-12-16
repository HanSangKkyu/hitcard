import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';
import MyProblemSetScreen from './screens/MyProblemSetScreen';
import CategoryScreen from './screens/CategoryScreen';
import SolveScreen from './screens/SolveScreen';
import MakeScreen from './screens/MakeScreen';
import ProblemScreen from './screens/ProblemScreen';
import EditProblemScreen from './screens/EditProblemScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="MyProblemSetScreen" component={MyProblemSetScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ProblemScreen" component={ProblemScreen} />
        <Stack.Screen name="MakeScreen" component={MakeScreen} />
        <Stack.Screen name="SolveScreen" component={SolveScreen} />
        <Stack.Screen name="EditProblemScreen" component={EditProblemScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;