import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import DynamicDrawerNavigation from './DynamicDrawerNavigation';

const PublicRoute = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="DynamicDrawer" component={DynamicDrawerNavigation} />
    </Stack.Navigator>
  );
};

export default PublicRoute;