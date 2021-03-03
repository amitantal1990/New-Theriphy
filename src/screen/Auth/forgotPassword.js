import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, TouchableOpacity, Keyboard, TextInput, ImageBackground } from 'react-native'
import { bg_icon, background, top_shadow_icon, app_logo, user_icon, bootom_shadow_icon, back_icon } from '../../utility/ImageConstant'
import { Content } from 'native-base'
import { emailValidation, wp, hp } from '../../utility'
import API from '../../utility/API'
import { SUCCESS_STATUS, API_FORGOT_PASSWORD } from '../../utility/APIConstant'
import Loader from '../../component/Loader'
import Toast from 'react-native-simple-toast'
import { CLR_LIGHT_GRAY, CLR_PRIMARY, CLR_DARKGREY, CLR_PLACEHOLDER } from '../../utility/Colors'
import { hint_email, hint_valid_email } from '../../utility/Constant'

export default class forgotPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            loading: false
        }
    }
    render() {
        
        return (
            <View style={{ flex: 1 }}>
                <Loader loading={this.state.loading} />
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={top_shadow_icon} style={styles.topCertainView} />
                        <Image source={app_logo} style={styles.appLogoView} />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={styles.middleViewContainer}>
                            <Text style={{ fontSize: wp(5.2), marginTop: hp(1), marginBottom: hp(0.5), color: CLR_DARKGREY }}>FORGOT PASSWORD</Text>
                            <View style={{ borderColor: CLR_LIGHT_GRAY, borderWidth: 1.5, flexDirection: 'row', marginTop: 10, width: '100%', height: Platform.OS === 'ios' ? wp(14) : wp(14) }}>
                                <View style={{ width: '13%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ width: '50%', height: '50%', resizeMode: 'contain' }} source={user_icon} />
                                </View>
                                <TextInput style={{ height: '100%', fontSize: wp(4.3), width: '86%' }}
                                    placeholder={'Email Address'}
                                    placeholderTextColor = {CLR_PLACEHOLDER}
                                    autoCapitalize={'none'}
                                    returnKeyType={"next"}
                                    onChangeText={text => this.setState({ email: text })}
                                />
                            </View>

                            <TouchableOpacity style={styles.bottomViewContainer}
                                onPress={() => this.loginBtnAction()}>
                                <Text style={{ color: 'white', fontSize: wp(5.5), textAlignVertical: 'center', marginTop: -5 }}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 3 }}>
                        <Image source={bootom_shadow_icon} style={styles.bottomCertainView} />
                    </View>
                </ImageBackground>
                <TouchableOpacity style={{ position: 'absolute', marginLeft: 15, marginTop: Platform.OS === 'ios' ? 44 : 25, padding: 10 }}
                    onPress={() => this.props.navigation.goBack()}>
                    <Image source={back_icon} style={{ width: 26, height: 26, resizeMode: 'contain' }} />
                </TouchableOpacity>

            </View>
        )
    }

    loginBtnAction = () => {
        const { email } = this.state
        if (email.trim() === '') {
            Toast.show(hint_email)
        }
        else if (!emailValidation(email)) {
            Toast.show(hint_valid_email)
        } else {
            let body = new FormData()
            body.append("email", email);
            this.setState({ loading: true })
            Keyboard.dismiss()
            API.postApiWithoutHeader(API_FORGOT_PASSWORD, body, this.successForgotPasswordResponse, this.failureResponse);
        }
    }
    successForgotPasswordResponse = (response) => {
        this.setState({ loading: false })
        console.log('get forgot response', response)
        if (response.status == SUCCESS_STATUS) {
            setTimeout(async () => {
                Toast.show(response.data.message)
                this.props.navigation.goBack()
            }, 50)
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 10)
        }
    }

    failureResponse = (error) => {
        this.setState({ loading: false })
        console.log('get error response', error.message)
        Toast.show('Getting some error')
    }
}

const styles = StyleSheet.create(
    {
        backgroundImageView: {
            width: '100%',
            height: '100%'
        },
        topViewContainer: {
            flex: 3,
            justifyContent: 'center',
            alignItems: 'center'
        },
        topCertainView: {
            position: 'absolute',
            resizeMode: 'cover',
            right: 0, top: 0,
            width: wp(35),
            height: wp(45)
        },
        appLogoView: {
            resizeMode: 'contain',
            width: wp(38),
            height: wp(38)
        },
        middleViewContainer: {
            // flex: 1,
            width: '90%',
            padding: wp(5),
            alignItems: 'center',
            shadowColor: '#000',
            borderRadius: 14,
            backgroundColor: 'white',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: wp(5),
            elevation: 5
        },
        bottomCertainView: {
            position: 'absolute',
            bottom: 0,
            resizeMode: 'cover',
            width: wp(37),
            height: wp(45)
        },
        bottomViewContainer: {
            width: '100%',
            height: wp(14),
            backgroundColor: CLR_PRIMARY,
            borderRadius: wp(8),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(3),
            marginBottom: 3,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.6,
            shadowRadius: wp(5),
            elevation: 15,
            shadowColor: CLR_PRIMARY
        },

    })
