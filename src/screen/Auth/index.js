import React, { Component } from 'react'
import { Text, StyleSheet, Keyboard, TextInput, View, StatusBar, ImageBackground, Image, TouchableOpacity, Platform, DeviceEventEmitter, ScrollView } from 'react-native'
import { bg_icon, app_logo, background, key_icon, user_icon, bootom_shadow_icon, top_shadow_icon } from '../../utility/ImageConstant'

import { CLR_PRIMARY, CLR_GRAY, CLR_DARKGREY, CLR_LIGHT_GRAY, CLR_BLACK, CLR_PLACEHOLDER } from '../../utility/Colors';
import InputView from '../../component/InputView'
import Loader from '../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../utility/API';
import { API_LOGIN, SUCCESS_STATUS, API_GET_USER_DATA , BASE_URL} from '../../utility/APIConstant';
import { emailValidation, wp, hp, storeData } from '../../utility';
import { hint_email, hint_password_length, hint_password, hint_valid_email } from '../../utility/Constant';
// _youTubeRef = React.createRef();
// netqom_patient100@mailinator.com
// maxgel@yopmail.com
// justdoit@100
var login = 0
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_name: '',
            password: '',
            loading: false,
            isNext: false,
            scrollMar: 0,
        }
    }
    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            scrollMar: 40
        });
    }

    _keyboardDidHide = () => {
        this.setState({
            scrollMar: 0
        })
    }

    render() {
        const { loading, isNext, scrollMar } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flex: 1 }} bounces={false} keyboardShouldPersistTaps={'handled'} >
                    {/* <StatusBar barStyle = "dark-content" translucent = {false} /> */}
                    <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', marginTop: -scrollMar }}>
                            <Image source={top_shadow_icon} style={styles.topCertainView} />
                            <Image source={app_logo} style={styles.appLogoView} />
                        </View>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: -scrollMar }}>
                            <View style={styles.middleViewContainer}>
                                <Text style={{ fontSize: wp(5.2), marginTop: hp(1), marginBottom: hp(0.5), color: CLR_DARKGREY }}>LOGIN</Text>
                                {/* <TextInput style={{ width: '100%', height: Platform.OS === 'ios' ? wp(14) : wp(14) }} source={user_icon}
                                    placeholder={'Email Address'}
                                    autoCapitalize={'none'}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => alert('hello')}
                                    onChangeText={text => this.setState({ user_name: text })}
                                /> */}
                               
                                <View style={{ borderColor: CLR_LIGHT_GRAY, borderWidth: 1.5, flexDirection: 'row', marginTop: 10, width: '100%', height: Platform.OS === 'ios' ? wp(14) : wp(14) }}>
                                    <View style={{ width: '13%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image style={{ width: '50%', height: '50%', resizeMode: 'contain' }} source={user_icon} />
                                    </View>
                                    <TextInput style={{ height: '100%', fontSize: wp(4.3), width: '86%' }}
                                        placeholder={'Email Address'}
                                        autoCapitalize={'none'}
                                        returnKeyType={"next"}
                                        placeholderTextColor={CLR_PLACEHOLDER}
                                        onSubmitEditing={() => { this.secondTextInput.focus() }}
                                        onChangeText={text => this.setState({ user_name: text })}
                                    />
                                </View>
                                <View style={{ borderColor: CLR_LIGHT_GRAY, borderWidth: 1.5, flexDirection: 'row', marginTop: 10, width: '100%', height: Platform.OS === 'ios' ? wp(14) : wp(14) }}>
                                    <View style={{ width: '13%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image style={{ width: '50%', height: '50%', resizeMode: 'contain' }} source={key_icon} />
                                    </View>
                                    <TextInput style={{ height: '100%', fontSize: wp(4.3), width: '86%' }}
                                        placeholder={'Enter Password'}
                                        secureTextEntry={true}
                                        autoCapitalize={'none'}
                                        placeholderTextColor={CLR_PLACEHOLDER}
                                        ref={(input) => { this.secondTextInput = input; }}
                                        returnKeyType={"done"}
                                        onChangeText={text => this.setState({ password: text })}
                                    />
                                </View>
                                {/* <TextInput style={{ width: '100%', height: Platform.OS === 'ios' ? wp(14) : wp(14) }} source={key_icon}
                                    placeholder={'Enter Code'}
                                    secureTextEntry={true}
                                    autoCapitalize={'none'}
                                    returnKeyType={"done"}
                                    onChangeText={text => this.setState({ password: text })}
                                /> */}
                                <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: hp(2) }}
                                    onPress={() => this.forgotButtonAction()}>
                                    <Text style={{ color: CLR_DARKGREY, fontSize: wp(5), textAlignVertical: 'center', marginTop: -5 }}>Forgot Password?</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.bottomViewContainer}
                                    onPress={() => this.loginBtnAction()}>
                                    <Text style={{ color: 'white', fontSize: wp(5.5), textAlignVertical: 'center', marginTop: -5 }}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flex: 3 }}>
                            <Image source={bootom_shadow_icon} style={styles.bottomCertainView} />
                        </View>
                        <Loader loading={loading} />
                    </ImageBackground>
                </ScrollView>
            </View>
        )
    }
    forgotButtonAction = () => {
        this.props.navigation.navigate('ForgotPassword')
    }
    loginBtnAction = () => {
        // this.props.navigation.navigate('Profile')
        // return
        const { password, user_name } = this.state
        if (user_name.trim() === '') {
            Toast.show(hint_email)
        }
        else if (!emailValidation(user_name)) {
            Toast.show(hint_valid_email)
        }
        else if (password === '') {
            Toast.show(hint_password)
        }
        else if (password.length < 6) {
            Toast.show(hint_password_length)
        } else {
            let body = new FormData()
            body.append("email", user_name);
            body.append("password", password);
            this.setState({ loading: true })
            API.postApiWithoutHeader(API_LOGIN, body, this.successLoginResponse, this.failureResponse);
        }
    }

    successLoginResponse = (response) => {
        console.log('get login response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.data.status_code) {
            let data = JSON.parse(JSON.stringify(response.data.data).replace(/\:null/gi, "\:\"\""))
            console.log('get data from', data)
            let imageUrl = data.image !== "" ? BASE_URL + data.image_path + '/' + data.image : ''
            let obje = {
                imageUri: imageUrl,
                user_name: data.first_name,
                phone_number: data.phone_no,
                email_address: data.email,
                date_birth: data.dob,
                gender: data.gender, 
                id: data.id,
                therapist_id: data.therapist_id
            }
            console.log('get data /////// from', imageUrl)
            setTimeout(async () => {
                await storeData('isLogin', true)
                await storeData('token', response.data.access_token)
                await storeData('user_data', obje)
                DeviceEventEmitter.emit('updateStack')
            }, 100)
        } else {
            setTimeout(async () => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    failureResponse = (error) => {
        this.setState({ loading: false })
        console.log('get error value', error.message);
        setTimeout(async () => {
            Toast.show('Getting some error')
        }, 100)
    }
}

const styles = StyleSheet.create({
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
        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.6,
        shadowRadius: wp(5),
        elevation: 15,
        shadowColor: CLR_PRIMARY
    },

})
