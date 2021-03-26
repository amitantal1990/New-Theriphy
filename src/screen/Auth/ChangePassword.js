import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { bg_icon } from '../../utility/ImageConstant'
import { CLR_PRIMARY, CLR_LIGHT_LIGHT_GRAY, CLR_LIGHT_GRAY, CLR_GRAY, CLR_PLACEHOLDER } from '../../utility/Colors'
import Loader from '../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../utility/API';
import { SUCCESS_STATUS, API_CHANGE_PASSWORD } from '../../utility/APIConstant'
import { Content } from 'native-base'
import Header from '../../component/Header'
import { hint_old_password, hint_valid_old_password, hint_password, hint_password_confirm, hint_password_length } from '../../utility/Constant'
import { wp, hp } from '../../utility'

export default class ChangePassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            old_password: '',
            new_password: '',
            confirm_password: '',
        }
    }

    render() {
        const { loading, old_password, new_password, confirm_password } = this.state
        return (
            <View style={{ flex: 1, paddingTop: hp(13.3) }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Loader loading={loading} />
                    <Content>
                        <View style={styles.inputContainerView}>
                            <Text style={styles.inputLable}>Old Password</Text>
                            <View style={styles.inputTextView}>
                                <TextInput style={styles.inputView}
                                    autoCorrect={false}
                                    keyboardType={'default'}
                                    autoCapitalize= 'none'
                                    placeholder={'Old Password'}
                                    placeholderTextColor={CLR_PLACEHOLDER}
                                    maxLength={15}
                                    secureTextEntry={true}
                                    onChangeText={(text) => this.setState({ old_password: text })}
                                    value={old_password}
                                    onEndEditing={() => { Keyboard.dismiss }}
                                />
                            </View>

                            <Text style={styles.inputLable}>New password</Text>
                            <View style={styles.inputTextView}>
                                <TextInput style={styles.inputView}
                                    autoCorrect={false}
                                    keyboardType={'default'}
                                    autoCapitalize='none'
                                    placeholder={'New Password'}
                                    placeholderTextColor={CLR_PLACEHOLDER}
                                    maxLength={15}
                                    onChangeText={(text) => this.setState({ new_password: text })}
                                    value={new_password}
                                    secureTextEntry={true}
                                    onEndEditing={() => { Keyboard.dismiss }}
                                />
                            </View>

                            <Text style={styles.inputLable}>Confirm new password</Text>
                            <View style={styles.inputTextView}>
                                <TextInput style={styles.inputView}
                                    autoCorrect={false}
                                    keyboardType={'default'}
                                    autoCapitalize="none"
                                    placeholder={'Confirm Password'}
                                    placeholderTextColor={CLR_PLACEHOLDER}
                                    secureTextEntry={true}
                                    maxLength={15}
                                    onChangeText={(text) => this.setState({ confirm_password: text })}
                                    value={confirm_password}
                                    onEndEditing={() => { Keyboard.dismiss }}
                                />
                            </View>
                            <TouchableOpacity style={styles.saveButton}
                                onPress={() => this.changePasswordBtnAction()}>
                                <Text style={{ color: 'white', fontSize: wp(5.6) }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                </ImageBackground>
                <View style={{ position: 'absolute' }}>
                    <Header title={'Change Password'}
                        onPressAccount={() => this.props.navigation.goBack()}
                        isBack={true}
                        hideSearch={true}
                        onPressBack={() => this.props.navigation.goBack()}
                    />
                </View>
            </View>
        )
    }

    changePasswordBtnAction = () => {
        const { confirm_password, new_password, old_password } = this.state

        if (old_password.trim() === '') {
            Toast.show(hint_old_password)
        }
        else if (old_password.length < 6) {
            Toast.show(hint_valid_old_password)
        }
        else if (new_password.trim() === '') {
            Toast.show(hint_password)
        }
        else if (new_password.length < 6) {
            Toast.show(hint_password_length)
        }
        else if (confirm_password !== new_password) {
            Toast.show(hint_password_confirm)
        }
        else {
            let body = new FormData()
            body.append("current_password", old_password);
            body.append("new_password", new_password);
            body.append("confirm_password", confirm_password);
            
            console.log('get body', body);

            this.setState({ loading: true })
            API.postApi(API_CHANGE_PASSWORD, body, this.successUpdatePasswordResponse, this.failureResponse);
        }

    }

    successUpdatePasswordResponse = (response) => {
        console.log('get change password response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            setTimeout(() => {
                Toast.show(response.data.message)
                // this.props.navigation.goBack()
            }, 100)
           
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    failureResponse = (error) => {
        console.log('get error value', error.message);
        setTimeout(async () => {
            Toast.show('Getting some error')
        }, 100)
        this.setState({ loading: false })
    }



}

const styles = StyleSheet.create({

    backgroundImageView: {
        width: '100%',
        height: '100%'
    },
    inputContainerView: {
        flex: 1,
        padding: wp(4),
        // paddingTop: 0,
        marginHorizontal: wp(5),
        marginVertical: wp(6),
        backgroundColor: "#ffffff",
        borderRadius: 15,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 15,
    },
    inputView: {
        color: 'black',
        fontSize: wp(4.3),
        marginHorizontal: wp('0%'),
        height: Platform.OS === 'ios' ? '90%' : '100%',
        fontSize: Platform.OS === 'ios' ? wp('4.3%') : 16,
    },
    inputTextView: {
        height: Platform.OS === 'ios' ? hp('4.8%') : 47,
        marginHorizontal: wp('0%'),
        borderBottomColor: 'black',
        borderBottomWidth: 1.5
    },
    saveButton: {
        width: '100%',
        height: wp(14),
        backgroundColor: CLR_PRIMARY,
        borderRadius: wp(7),
        marginBottom: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: wp(5),
        elevation: 5,
        shadowColor: CLR_PRIMARY
    },
    saveText: {
        color: 'white',
        fontSize: wp('5.6%'),
    },
    inputLable: {
        color: CLR_PLACEHOLDER,
        fontSize: wp('4.5%'),
        marginTop: hp('2.5%'),
        marginHorizontal: wp('0%'),
    },
})
