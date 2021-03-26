import React, { useRef, useState, useEffect, } from 'react'
import { StyleSheet, Text, StatusBar, View, Platform, TextInput, Image, Animated, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import { wp, hp, storeData, retrieveData } from '../utility';

import { profile_icon, info_icon, search_icon, drop_down, user_icon, forword_arrow, logout, back_icon, gallery_icon } from '../../src/utility/ImageConstant'
import { CLR_BLACK, CLR_PRIMARY, CLR_LIGHT_GRAY, CLR_SECOND_PRIMARY } from '../utility/Colors';
import LogoutView from './LogoutPopup'
import Toast from 'react-native-simple-toast';
import Modal from "react-native-modal";
import API from '../utility/API'
import Loader from './Loader'
import { API_LOGOUT, SUCCESS_STATUS } from '../utility/APIConstant'

export default function Header(props) {
    const dropDownRef = useRef()
    const [active, setDropDown] = useState(false)
    const [isLogout, setLogout] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [profileImage, setProfile] = useState('')
    const [searchText, setSearchText] = useState(props.searchText)
    const [animation, setstate] = useState(new Animated.Value(0))
    const getUserData = async () => {
        let userData = await retrieveData('user_data')
        setProfile(userData.imageUri)
    }
    useEffect(() => {
        getUserData()
        DeviceEventEmitter.addListener('updateUser', (data) => {
            console.log('-----------xxxxxxx----------------', data.data.imageUri);
            const image = data.data.imageUri
            // console.log('image data------->>', image)
            // if(image.lenght > 10){
            setProfile(image)
            // }

        })
    }, [profileImage, isLogout])
    const startAnimation = () => {
        if (!active) {
            setDropDown(!active)
            Animated.timing(animation, {
                toValue: 90,
                duration: 500,
            }).start(() => { });

        } else {
            Animated.timing(animation, {
                toValue: 0,
                duration: 500,
            }).start(() => { });
            setTimeout(() => {
                setDropDown(!active)
            }, 200);
        }
    }
    const transformStyle = {
        transform: [
            {
                translateY: animation,
            },
        ],
    };
    const clickLogoutOption = () => {
        setLogout(true)
        startAnimation()
    }
    const clickProfileOption = () => {
        props.onPressAccount()
        startAnimation()
    }
    const userLogoutAction = () => {
        setLoading(true)
        setLogout(false)
        let body = {}
        API.postApi(API_LOGOUT, body, successLogoutResponse, failureResponse);
    }
    const successLogoutResponse = (response) => {
        console.log('get logout response-------', response);
        setLoading(false)
        if (SUCCESS_STATUS == response.data.status_code) {
            setTimeout(async () => {
                // props.onPressLogout()
                console.log('response.data', response.data)
                await storeData('isLogin', false)
                DeviceEventEmitter.emit('updateStack')
            }, 100)
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    const failureResponse = (error) => {
        setLoading(false)
        console.log('get error value', error);
    }

    return (
        <View style={{ width: wp(100), height: hp(21) }}>
            <View style={[styles.container, { height: Platform.OS === 'ios' ? props.isBack ? hp(13.3) : hp(21) : props.isBack ? hp(13.5) : hp(20.5) }]}>
                <StatusBar barStyle="dark-content" backgroundColor={CLR_PRIMARY} />
                <View style={styles.headerTitleContainer}>
                    <View style={{ width: hp(8), height: '100%', justifyContent: 'center' }}>
                        {props.isBack &&
                            <TouchableOpacity style={{ width: hp(4.3), height: hp(4.5), alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: 6 }}
                                onPress={() => props.onPressBack()} >
                                <Image style={{ width: hp(2.5), height: hp(2.5), resizeMode: 'contain' }} source={back_icon} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={{ width: wp(90) - hp(16), height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.textTitle}>{props.title}</Text>
                    </View>
                    <TouchableOpacity style={{ width: hp(8), height: '100%', alignItems: 'center', flexDirection: 'row' }} onPress={() => startAnimation()}>
                        <Image style={{ width: hp(5.5), height: hp(5.5), borderColor: 'white', borderWidth: 2, borderRadius: hp(2.75) }} source={profileImage === '' ? profile_icon : { uri: profileImage }} />
                        <Image style={{ marginLeft: 5, width: hp(2), height: hp(2), tintColor: 'white', }} source={drop_down} />
                    </TouchableOpacity>
                </View>
                {!props.hideSearch &&
                    <View style={styles.searchContainerView}>
                        <TextInput
                            style={styles.inputViewStyle}
                            placeholder="Search..."
                            placeholderTextColor={'#ffffff'}
                            onChangeText={(text) => props.searchBtnAction(text)}
                            defaultValue={props.searchText}
                        />
                        <Image source={search_icon} style={styles.searchImage} />
                    </View>
                }
                {props.title === 'Motivation' &&
                    <View style={styles.uploadImageContainerView}>
                        <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 9, borderColor: 'white', borderWidth: 1.2, justifyContent: 'center', width: wp(80), height: '100%', alignItems: 'center' }}
                            onPress={() => props.onPressUpload()}>
                            <Text style={{ color: 'white', fontSize: wp(4.3) }}>Upload Images</Text>
                            <Image style={{ width: 25, height: 25, tintColor: 'white', marginLeft: 10, resizeMode: 'contain' }} source={gallery_icon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: wp(7), height: wp(7), }} onPress={() => props.onPressInfo()}>
                            <Image style={{ width: '100%', height: '100%', tintColor: 'white' }} source={info_icon} />
                        </TouchableOpacity>
                    </View>
                }

                {/* {props.isBack &&
                    <View style={{ width: wp(100), height: hp(17), backgroundColor: 'red' }}></View>
                } */}




                <Modal
                    isVisible={isLogout}
                // backdropColor = {'red'}
                // onBackdropPress={() => setLogout(false)}
                // onBackButtonPress ={() => setLogout(false)}
                >
                    <LogoutView
                        title='Are you sure you want to logout?'
                        buttonTitle='Logout'
                        cancelTitle='Cancel'
                        onPressCancel={() => setLogout(false)}
                        onPress={() => userLogoutAction()}
                    />
                </Modal>
                <Loader loading={isLoading} />
            </View>

            {active &&
                <Animated.View style={[styles.animatedBox, transformStyle]}>
                    <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: '50%', alignItems: 'center', borderBottomColor: CLR_LIGHT_GRAY, borderBottomWidth: 1 }}
                        onPress={() => clickProfileOption()} >
                        <Image style={{ resizeMode: 'contain', width: 20, height: 20, marginLeft: 8, marginRight: 10, }}
                            source={user_icon} />
                        <Text style={{ color: CLR_BLACK }}>My Account</Text>
                        <Image style={{ resizeMode: 'contain', tintColor: CLR_PRIMARY, width: 20, height: 20, position: 'absolute', right: 8, }}
                            source={forword_arrow} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', width: '100%', height: '50%', alignItems: 'center' }}
                        onPress={() => clickLogoutOption()}
                    >
                        <Image style={{ resizeMode: 'contain', width: 20, height: 20, marginLeft: 8, marginRight: 10, tintColor: CLR_SECOND_PRIMARY }}
                            source={logout} />
                        <Text style={{ color: CLR_BLACK }}>Logout</Text>
                        <Image style={{ resizeMode: 'contain', tintColor: CLR_PRIMARY, width: 20, height: 20, position: 'absolute', right: 8, }}
                            source={forword_arrow} />
                    </TouchableOpacity>
                </Animated.View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: wp(100),
        // height: hp(50),
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
        height: hp(8),
        marginTop: Platform.OS === 'ios' ? hp(4) : hp(1.9),
        flexDirection: 'row',
        // backgroundColor: 'red'
    },
    dropDownView: {
        position: 'absolute',
        right: 0,
        width: 40,
        height: 40,
    },
    searchContainerView: {
        borderRadius: 8,
        flexDirection: 'row',
        backgroundColor: '#00000040',
        height: wp(12),
        marginTop: Platform.OS === 'ios' ? hp(1.4) : hp(2),
        borderRadius: wp(6),
        justifyContent: 'center',
    },
    uploadImageContainerView: {
        borderRadius: 8,
        flexDirection: 'row',
        height: wp(12),
        width: '100%',
        marginTop: Platform.OS === 'ios' ? hp(1.4) : hp(2),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputViewStyle: {
        justifyContent: 'center',
        height: 45,
        width: wp('88%') - 55,
        marginLeft: 10,
        color: 'white'
    },
    textTitle: {
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontSize: wp(4.5),
    },
    searchImage: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        // resizeMode: 'contain',
    },
    backButtonView: {
        // marginTop: hp(6),
        // width: 50,
        // height: 50,
        // backgroundColor: 'green'
    }, formField: {
        borderWidth: 1,
        padding: 12,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
        borderColor: '#888888',
        fontSize: 18,
        height: 50,
        width: wp(90)
    },

    animatedBox: {
        position: "absolute",
        alignItems: "center",
        width: wp("60%"),
        marginTop: hp(14) - 120,
        height: 100,
        marginLeft: wp("35%"),
        backgroundColor: "#ffffff",
        borderRadius: 12,
        shadowColor: CLR_BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 15,
    },
    headerView: {
        height: hp('9%'),
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginBottom: 20,
        // backgroundColor: 'red'
    },
    headerTitle: {
        color: 'black',
        // fontFamily: 'Metropolis-Bold',
        fontSize: wp('5%')
    },
    backButtonViewContainer: {
        width: 40,
        height: 40,
        position: 'absolute',
        left: wp('5%'),
        justifyContent: 'flex-end',
        bottom: 4
    },
    editButtonViewContainer: {
        width: 40,
        height: 40,
        position: 'absolute',
        right: wp('5%'),
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    backImageView: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    forwordImageView: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
        tintColor: 'white'
    },
    editImageView: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
})
