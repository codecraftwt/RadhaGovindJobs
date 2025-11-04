import React from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screens/Authentication/Login';
import Splash from '../Screens/Common/Splash';

export default function AuthStack() {
    const Stack = createNativeStackNavigator();

    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    );
  };


const styles = StyleSheet.create({})