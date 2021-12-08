
import React, { Component } from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { read_icon, meditation_icon, home_icon, motivation_icon, rogue_icon } from '../utility/ImageConstant'
import { CLR_SECOND_PRIMARY, CLR_PRIMARY } from '../utility/Colors';

const imageArray = [read_icon, meditation_icon, home_icon, motivation_icon, rogue_icon]
function CustomTabBar({ state, descriptors, navigation }) {
    console.log(' state, descriptors, navigation ', state, descriptors, navigation)

    const focusedOptions = descriptors[state.routes[state.index].key].options;

    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    return (
        <View style={{

            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            height: hp('10%'),
            width: wp('100%'),
            backgroundColor: CLR_SECOND_PRIMARY,
        }}
        >
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                const setTabImage = () => {
                    return (
                        <Image style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: CLR_PRIMARY }} source={read_icon} />
                    )
                }
                return (
                    <TouchableOpacity key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Image style={{ width: wp(6), height: wp(6), resizeMode: 'contain' }} source={imageArray[index]} />
                        <Text style={{ color: '#ffffff', textAlign: 'center', fontSize: wp(3.8), marginTop: 6 }}>
                            {label}
                        </Text>
                        <View
                            style={{
                                position: 'absolute',
                                borderBottomWidth: 4,
                                borderColor: isFocused ? CLR_PRIMARY : CLR_SECOND_PRIMARY,
                                top: 0,
                                width: wp('20%'),
                            }}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default CustomTabBar