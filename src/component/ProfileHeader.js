import React, { useRef, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Image, Animated, TouchableOpacity } from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import { profile_icon, back_icon, gallery_icon } from '../utility/ImageConstant'
import { CLR_BLACK, CLR_PRIMARY, CLR_LIGHT_GRAY, CLR_SECOND_PRIMARY } from '../utility/Colors';

export default function Header(props) {
    console.log('get header value-----', props);
    return (
        <View style={styles.container}>
            <View style={styles.headerTitleContainer}>
                <View style={{ width: hp(5), height: '100%' }}>
                    <TouchableOpacity style={{ width: hp(4.4), height: '90%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 6 }}
                        onPress={() => props.onPressBack()} >
                        <Image style={{ width: '55%', height: '55%', resizeMode: 'contain' }} source={back_icon} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: wp(90) - hp(10), height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.textTitle}>{props.title}</Text>
                </View>
                <TouchableOpacity style={{ width: hp(5), height: '100%', alignItems: 'center', flexDirection: 'row' }}>
                    <Image style={{ width: '100%', height: '100%', borderColor: 'white', borderWidth: 2, borderRadius: hp(2.75) }} source={props.imageUri !== '' ? { uri: props.imageUri } : profile_icon} />
                </TouchableOpacity>
            </View>
            <View style={{ width: hp(10), height: hp(10), alignItems: 'center',}}>
                <Image style={{ width: hp(10), height: '100%', borderColor: 'white', borderWidth: 2, borderRadius: hp(5) }} source={props.imageUri !== '' ? { uri: props.imageUri } : profile_icon} />
                <TouchableOpacity style={{ position: 'absolute', right: 0, bottom: 0, backgroundColor: 'white', width: hp(3.8), height: hp(3.8), borderRadius: hp(1.9), justifyContent: 'center', alignItems: 'center' }} onPress={() => props.onPressCamera()} >
                    <Image style={{ width: hp(2.3), height: hp(2.3), tintColor: CLR_PRIMARY }} source={gallery_icon} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp(100),
        height: Platform.OS === 'ios' ? hp(22) : hp(20.5),
        alignItems: 'center',
        paddingLeft: wp(5),
        paddingRight: wp(5),
        backgroundColor: CLR_PRIMARY,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        shadowColor: CLR_BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 15,
    },
    headerTitleContainer: {
        width: wp(90),
        height: hp(5),
        marginTop: Platform.OS === 'ios' ? hp(5) : hp(2.8),
        marginBottom:  hp(.6),
        flexDirection: 'row',
    },
    searchContainerView: {
        borderRadius: 8,
        flexDirection: 'row',
        backgroundColor: '#00000040',
        height: wp(12),
        marginTop: hp(4),
        borderRadius: wp(6),
        justifyContent: 'center',
    },
    textTitle: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontSize: wp(4.5),
    },
    headerTitle: {
        color: 'black',
        fontSize: wp('5%')
    }
})
