import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screen/Auth'
import Profile from '../screen/Auth/Profile'
import ForgotPassword from '../screen/Auth/forgotPassword'

const Stack = createStackNavigator();
export default function LoginRoot() {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="Login"
                component={Login}
            />
            <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
            />
            <Stack.Screen
                name="Profile"
                component={Profile}
            />
        </Stack.Navigator>
    )
}

