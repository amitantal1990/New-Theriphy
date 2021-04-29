import React, { Component } from 'react'
import { Text, StyleSheet, View, TextInput, ImageBackground, Platform, TouchableOpacity, DeviceEventEmitter } from 'react-native'
import Header from '../../component/ProfileHeader'
import { bg_icon, user_icon, key_icon, edit_icon } from '../../utility/ImageConstant'
import { wp, hp, showCameraImagePicker, showGalleryImagePicker, storeData, retrieveData } from '../../utility'
import InputView from '../../component/ProfileInput'
import ActionSheet from '../../component/ActionSheet'
import Modal from 'react-native-modal'
import { CLR_PRIMARY, CLR_LIGHT_LIGHT_GRAY, CLR_LIGHT_GRAY } from '../../utility/Colors'
import Loader from '../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../utility/API';
import { API_UPDATE_PROFILE, SUCCESS_STATUS, API_GET_USER_DATA, API_UPLOAD_MOTIVATION_IMAGE, BASE_URL } from '../../utility/APIConstant'
import { Content } from 'native-base'
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker'
import moment from 'moment'
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const UPLOAD_OPTIONS = [
    { title: "Open Camera", color: CLR_PRIMARY },
    { title: "Choose from Gallery", color: CLR_PRIMARY }]
const UPLOAD_GENDER_OPTIONS = [
    { title: "Male", color: CLR_PRIMARY },
    { title: "Female", color: CLR_PRIMARY },
    { title: "Others", color: CLR_PRIMARY }
]

let selectedDate = new Date()

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isActionSheet: false,
            isGender: false,
            imageUri: '',
            user_name: '',
            email_address: '',
            phone_number: '',
            date_birth: '',
            date: new Date(),
            gender: '',
            isShowPicker: false,
            loading: false
        }
    }

    componentDidMount() {
        this.getUserData()
    }
    onChange = (event, selectedDate) => {
        // const currentDate = selectedDate || date;
        // setShow(Platform.OS === 'ios');
        // setDate(currentDate);
    };

    render() {
        const { isActionSheet, imageUri, loading, user_name, email_address, phone_number, isShowPicker, date_birth, gender, isGender, date } = this.state
        // console.log('get image ==<<<<<<', imageUri);
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Profile'}
                        onPressCamera={() => this.setState({ isActionSheet: true })}
                        imageUri={imageUri}
                        onPressBack={() => this.props.navigation.goBack()}
                    />
                    <Content style={{ flex: 1 }}>
                        <View style={styles.inputContainerView}>
                            <InputView source={edit_icon}
                                inputTitle={'Name'}
                                value={user_name}
                                maxLength={24}
                                returnKeyType={"next"}
                                autoCapitalize={'words'}
                                placeholder={'Name'}
                                onChangeText={text => this.setState({ user_name: text })}
                            />
                            <InputView source={edit_icon}
                                inputTitle={'Email Address'}
                                value={email_address}
                                editable={false}

                            />
                            <InputView source={edit_icon}
                                inputTitle={'Phone Number'}
                                value={phone_number}
                                placeholder={'Phone Number'}
                                maxLength={10}
                                returnKeyType={"next"}
                                keyboardType={'number-pad'}
                                onChangeText={text => this.setState({ phone_number: text.replace(/[^0-9]/g, '') })}
                            />
                            <InputView source={edit_icon}
                                inputTitle={'Gender'}
                                isButton={true}
                                placeholder={'Gender'}
                                value={gender}
                                onPress={() => this.setState({ isGender: true })}
                            />
                            <InputView source={edit_icon}
                                inputTitle={'Date of Birth'}
                                isButton={true}
                                value={date_birth}
                                placeholder={'Date of Birth'}
                                onPress={() => this.setState({ isShowPicker: true })}
                                onChangeText={text => this.setState({ date_birth: text })}
                            />
                            <TouchableOpacity style={styles.bottomViewContainer} onPress={() => this.saveDetailAction()}>
                                <Text style={{ color: 'white', fontSize: wp(5.6) }}>Save Detail</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ ...styles.bottomViewContainer, marginTop: 12 }} onPress={() => this.props.navigation.navigate('ChangePassword')}>
                                <Text style={{ color: 'white', fontSize: wp(5.6) }}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    </Content>
                    <Loader loading={loading} />
                    <Modal
                        animationIn="slideInUp"
                        animationOut="slideOutDown"
                        isVisible={(isActionSheet || isGender)}>
                        <ActionSheet
                            sheetArray={isGender ? UPLOAD_GENDER_OPTIONS : UPLOAD_OPTIONS}
                            callRenderMethod={(text) => this.pickValueFromActionSheet(text)}
                            onPressCancel={() => this.setState({ isActionSheet: false, isGender: false })}
                        />
                    </Modal>
                    {isShowPicker && Platform.OS === 'android' &&
                        <DateTimePicker
                            // style={{ flex: 1, borderColor: 'red' }}
                            value={date}
                            mode={'date'}
                            dateFormat={'day month year'}
                            maximumDate={date}
                            onChange={(e, v) => {
                                // console.log('get value------>>', e.type)
                                // console.log('get value------XX', v)
                                e.type === 'dismissed' ? this.setState({ isShowPicker: false }) : this.setState({ date_birth: moment(v).format('MM/DD/YYYY'), isShowPicker: false })
                            }}
                        />
                    }
                    {isShowPicker && Platform.OS === 'ios' &&
                        <View style={{ width: wp(100), alignItems: 'center', backgroundColor: CLR_LIGHT_LIGHT_GRAY }}>
                            <View style={{ width: '100%', height: 50, backgroundColor: CLR_LIGHT_GRAY, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <TouchableOpacity style={{ marginRight: wp(5) }} onPress={() =>
                                    this.setState({
                                        isShowPicker: false,
                                        date_birth: moment(selectedDate).format('MM/DD/YYYY')
                                    })}>
                                    <Text style={{ color: CLR_PRIMARY, fontWeight: '600', fontSize: wp(4.5) }}>Done</Text>
                                </TouchableOpacity>
                            </View>
                            <DatePicker
                                date={date}
                                mode={'date'}
                                minimumDate={new Date("1950-01-01")}
                                maximumDate={date}
                                onDateChange={(e) => {
                                    selectedDate = e
                                    // this.setState({ date_birth: moment(e).format('YYYY/MM/DD') })
                                }}
                            />
                        </View>
                    }
                </ImageBackground>
            </View>
        )
    }

    pickValueFromActionSheet = (text) => {
        console.log('get action sheet', text);
        switch (text) {
            case "Open Camera":
                showCameraImagePicker(wp(100), wp(100), this.getPhoto, this.cancelButton)
                break;
            case "Choose from Gallery":
                showGalleryImagePicker(wp(100), wp(100), this.getPhoto, this.cancelButton)
                break;
            default:
                this.setState({ gender: text, isGender: false })
                break;
        }
    };
    getPhoto = async (res) => {
        this.setState({ isActionSheet: false })
        console.log('get image -----', res);
        this.setState({ imageUri: res })
    }
    successMotivationResponse = (response) => {
        console.log('get Motivation response-------', response);
        this.setState({ loading: false })
    }
    cancelButton = () => {
        this.setState({ isActionSheet: false })
    }

    getUserData = () => {
        this.setState({ loading: true })
        API.getApi(API_GET_USER_DATA, this.successUserDataResponse, this.failureResponse);
    }

    saveDetailAction = () => {
        const { user_name, gender, phone_number, date_birth, email_address } = this.state
        let body = new FormData()
        const { imageUri } = this.state

        if (user_name.trim() === '') {
            Toast.show("Please enter user name")
            return
        } else if (phone_number.trim() === '') {
            Toast.show("Please enter phone number")
            return
        } else if (phone_number.trim().length != 10) {
            Toast.show("Please enter only 10 digit number")
            return
        }

        if (imageUri.length > 20) {
            let imageData = {
                uri: imageUri,
                width: wp(100),
                height: wp(100),
                name: (new Date().getTime()).toString() + ".jpg",
                type: "image/jpeg"
            };
            body.append("image", imageData);
        }
        // console.log('get body', imageUri);
        body.append("first_name", user_name);
        body.append("last_name", "Ratra");
        body.append("phone_no", phone_number);
        body.append("gender", gender);
        body.append("dob", date_birth);
        console.log('get body', body);
        
        this.setState({ loading: true })
        API.postApi(API_UPDATE_PROFILE, body, this.successUpdatResponse, this.failureResponse);
    }

    successUserDataResponse = (response) => {
        console.log('get user data response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            let data = JSON.parse(JSON.stringify(response.data.data).replace(/\:null/gi, "\:\"\""))
            console.log('get data from', data)
            let imageUrl = data.image !== '' ? BASE_URL + data.image_path + '/' + data.image : ''
            let obje = {
                imageUri: imageUrl,
                user_name: data.first_name,
                phone_number: data.phone_no,
                email_address: data.email,
                date_birth: moment(data.dob).format('MM/DD/YYYY'),
                gender: data.gender,
            }
            console.log('get profile image -----', obje)
            this.setState({
                imageUri: obje.imageUri,
                user_name: obje.user_name,
                phone_number: obje.phone_number,
                email_address: obje.email_address,
                date_birth: obje.date_birth,
                gender: obje.gender
            })
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }

     successUpdatResponse = async (response) => {
        console.log('get update response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            let data = JSON.parse(JSON.stringify(response.data.data).replace(/\:null/gi, "\:\"\""))
            let imageUrl = data.image !== "" ? BASE_URL + data.image_path + '/' + data.image : ''
            let obje = {
                imageUri: imageUrl,
                user_name: data.first_name,
                phone_number: this.state.phone_number,
                email_address: this.state.email_address,
                date_birth: this.state.date_birth,
                gender: this.state.gender,
                id: data.id,
                therapist_id: data.therapist_id
            }
            console.log('get update profile image -----', obje)
            await storeData('user_data', obje)
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
            setTimeout(() => {
                DeviceEventEmitter.emit('updateUser', { data: obje })
            }, 1000)
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
        padding: wp(5),
        paddingTop: 0,
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
    bottomViewContainer: {
        width: '100%',
        height: wp(14),
        backgroundColor: CLR_PRIMARY,
        borderRadius: wp(7),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.6,
        shadowRadius: wp(5),
        elevation: 5,
        shadowColor: CLR_PRIMARY
    },
})
