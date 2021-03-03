import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Reading from '../screen/Tabbar/Reading'
import ReadingDetail from '../screen/Tabbar/Reading/readingDetail'
import Relax from '../screen/Tabbar/Relaxation'
import AudioPlayer from '../screen/Tabbar/Relaxation/audioPlayer'
import Home from '../screen/Tabbar/Home'
import HomeDetail from '../screen/Tabbar/Home/HomeDetail'
import Profile from '../screen/Auth/Profile'
import Motivation from '../screen/Tabbar/Motivation'
import Rogue from '../screen/Tabbar/Rogue'
import CustomTabBar from './CustomTabBar';
import { read_icon, meditation_icon, home_icon, motivation_icon, rogue_icon } from '../utility/ImageConstant'





const ReadingStack = createStackNavigator()
const ReadingPage = (props) => {
    return (
        <ReadingStack.Navigator initialRouteName="Reading">
            <ReadingStack.Screen
                name={'Reading'}
                options={{
                    headerShown: false,
                }}
                component={Reading}
            />
            <ReadingStack.Screen
                name={'ReadingDetail'}
                options={{
                    headerShown: false,
                }}
                component={ReadingDetail}
            />
        </ReadingStack.Navigator>
    )
}

const RelaxationStack = createStackNavigator()
const RelaxationPage = () => {
    return (
        <RelaxationStack.Navigator initialRouteName="Relaxation">
            <RelaxationStack.Screen
                name={'Relaxation'}
                options={{
                    headerShown: false,
                }}
                component={Relax}
            />
            <RelaxationStack.Screen
                name={'AudioPlayer'}
                options={{
                    headerShown: false,
                }}
                component={AudioPlayer}
            />
        </RelaxationStack.Navigator>
    )
}
const HomeStack = createStackNavigator()

const HomePage = () => {
    return (
        <HomeStack.Navigator initialRouteName="Homework">
            <HomeStack.Screen
                name={'Homework'}
                options={{
                    headerShown: false,
                }}
                component={Home}
            />
            <HomeStack.Screen
                name={'HomeDetail'}
                options={{
                    headerShown: false,
                }}
                component={HomeDetail}
            />
        </HomeStack.Navigator>
    )
}
const MotivationStack = createStackNavigator()

const MotivationPage = () => {
    return (
        <MotivationStack.Navigator initialRouteName="Motivation">
            <MotivationStack.Screen
                name={'Motivation'}
                options={{
                    headerShown: false,
                }}
                component={Motivation}
            />
        </MotivationStack.Navigator>
    )
}
const RogueStack = createStackNavigator()
const RoguePage = () => {
    return (
        <RogueStack.Navigator initialRouteName="Go Rogue">
            <RogueStack.Screen
                name={'Go Rogue'}
                options={{
                    headerShown: false,
                }}
                component={Rogue}
            />
            {/* <RogueStack.Screen
                name={'Profile'}
                options={{
                    headerShown: false,
                }}
                component={Profile}
            /> */}

        </RogueStack.Navigator>
    )
}

const Tab = createBottomTabNavigator();
const TabPage = () => {
return (
    <Tab.Navigator
        initialRouteName="Reading"
        tabBar={props => <CustomTabBar {...props} />}
    >
        <Tab.Screen
            name="Reading"
            component={ReadingPage} />
        <Tab.Screen
            name="Relaxation"
            component={RelaxationPage} />
        <Tab.Screen
            name="Homework"
            component={HomePage} />
        <Tab.Screen
            name="Motivation"
            component={MotivationPage} />
        <Tab.Screen
            name="Go Rogue"
            
            component={RoguePage} />
    </Tab.Navigator>
)
}
const Stack =createStackNavigator()
export default function TabRoot() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Reading" component={TabPage} options={{
                    headerShown: false,
                }}  />
            <Stack.Screen name="Profile" component={Profile} options={{
                    headerShown: false,
                }}/>
        </Stack.Navigator>
    )
}
const styles = StyleSheet.create({})

