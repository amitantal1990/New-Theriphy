import React, { Component } from 'react'
import { StyleSheet, View, DeviceEventEmitter } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginRoot from './navigationRoot/LoginRoot'
import TabRoot from './navigationRoot/TabRoot'
import RNBootSplash from 'react-native-bootsplash'
import { retrieveData } from './utility'

const Stack = createStackNavigator();
export default class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: null
        }
    }
    async componentDidMount() {
        RNBootSplash.hide({ fade: true });
        let userLogin = await retrieveData('isLogin')
        // console.log('5555 5555 5555 5555', userLogin);
        this.setState({ isLogin: userLogin === null ? false : userLogin })
        DeviceEventEmitter.addListener('updateStack', async () => {
            let userLogin = await retrieveData('isLogin')
            // console.log('5555 5555 5555 5555', userLogin);
            this.setState({ isLogin: userLogin === null ? false : userLogin })
        })
    }
    render() {
        const { isLogin } = this.state
        // console.log('5555 5555 5555 5555', isLogin);
        if (isLogin === null) {
            return (<View></View>)
        }

        return (
            <NavigationContainer headerMode="none">
                { !this.state.isLogin ?
                    <Stack.Navigator screenOptions={{
                        headerShown: false,
                    }}>
                        <Stack.Screen name="LoginRoot" component={LoginRoot} />
                    </Stack.Navigator> :
                    <Stack.Navigator screenOptions={{
                        headerShown: false,
                    }}>
                        <Stack.Screen name="TabRoot" component={TabRoot} />
                    </Stack.Navigator>
                }
            </NavigationContainer>

            // <View style= {{flex: 1, backgroundColor: 'red'}}>
            //     <Text> textInComponent </Text>
            // </View>

        )
    }
}

const styles = StyleSheet.create({})
