import React, { Component } from 'react'
import { Text, StyleSheet, Alert, View, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList, DeviceEventEmitter } from 'react-native'
import Header from '../../../component/Header'
import { bg_icon, gallery_icon, delete_icon } from '../../../utility/ImageConstant';
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, retrieveData } from '../../../utility'
import { SUCCESS_STATUS, API_UPLOAD_MOTIVATION_IMAGE, API_VIEW_MOTIVATION, API_DELETE_MOTIVATION_IMAGE } from '../../../utility/APIConstant'
import { Content } from 'native-base';
import MasonryList from "react-native-masonry-list";
import { CLR_PRIMARY, CLR_LIGHT_LIGHT_GRAY } from '../../../utility/Colors';
import Popup from '../../../component/PopupView'
import Modal from 'react-native-modal'
import { object } from 'prop-types';

export default class Motivation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            motivationList: [],
            isUploadImage: false,
            categoryList: [],
            upload_panding: 0,
            isShowDropDown: false,
            categoryFullList: []

        }
    }
    componentDidMount() {
        // let userData = await retrieveData('user_data')
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            if (this.state.isShowDropDown) {
                DeviceEventEmitter.emit('updateUser', { data: 'dropDown' })
            }
        })
        this.getMotivationalData()
    }
    showInfo = () => {
        Alert.alert(
            //title
            'Information!',
            //body
            'Here you will display photos or create affirmations to keep your therapy on the right track. Only you and your therapist will see this so be honest about what you want in your life.',
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('No Pressed'), style: 'cancel'
                },
            ],
            { cancelable: false },
            //clicking out side of alert will not cancel
        );
    }
    render() {
        const { motivationList, isUploadImage, categoryList, loading, upload_panding, categoryFullList } = this.state

        console.log('categoryList', categoryList, categoryFullList, motivationList)
        return (
            <View style={{ flex: 1, paddingTop: hp(21) }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>

                    <Modal
                        isVisible={isUploadImage}
                        onBackdropPress={() => this.setState({ isUploadImage: false })}
                    >
                        <Popup
                            categoryData={categoryFullList.length > 0 ? categoryFullList : categoryList}
                            max_upload={upload_panding > 10 ? 10 : upload_panding}
                            onPressCancel={() => this.setState({ isUploadImage: false })}
                            onPressUploadFile={(item, cate) => this.uploadFileOnServer(item, cate)}
                            onPressCustomFile={() => alert('hi')}
                        />
                    </Modal>


                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={{ marginTop: 10 }}
                        data={motivationList}
                        renderItem={this.renderMotivationItems}

                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Loader loading={loading} />

                </ImageBackground>
                <View style={{ position: 'absolute' }}>
                    <Header title={'Motivation'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        onPressInfo={() => this.showInfo()}
                        onOpenDrop={(res) => this.setState({ isShowDropDown: res })}
                        hideSearch={true}
                        onPressUpload={() => this.uploadImageData()}
                    />
                </View>

            </View>
        )
    }

    uploadImageData = () => {
        if (this.state.upload_panding > 0) {
            this.setState({ isUploadImage: true })
        } else {
            Toast.show(' Your uploading limit has exceeded.')
        }
    }

    renderMotivationItems = (item) => {
        console.log('item----', item, item.item[0].album_name)

        return (
            <View style={{ width: wp(100), alignItems: 'center' }}>
                <View style={{ width: wp(94), height: 40, justifyContent: 'center', alignItems: 'center', marginTop: wp(1), marginBottom: wp(1), marginHorizontal: wp(3), borderColor: '#832D7750', borderWidth: 1, borderRadius: 8 }}>
                    <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.5), fontWeight: '700' }}>{item.item[0].album_name}</Text>
                </View>
                <FlatList
                    style={{ width: wp(96) }}
                    numColumns={2}
                    data={item.item}
                    renderItem={this.renderSubItems}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }

    renderSubItems = (item) => {
        console.log('renderSubItems', item, 'https://www.theriphy.com/public/' + item.item.file_path + item.item.file_name,)
        return (
            <View style={{ width: wp('46%'), margin: wp('1%'), borderRadius: 10, height: wp(46), backgroundColor: CLR_LIGHT_LIGHT_GRAY, overflow: 'hidden' }}>
                <TouchableOpacity style={{ width: '100%', height: '100%' }}
                    onPress={() => {
                        console.log('this.state.motivationList', this.state.motivationList[item.item.index], item.item.index)

                        this.props.navigation.navigate('ImageDetail', { data: this.state.motivationList[item.item.index], selectedIndex: item.index })
                    }}
                >
                    <Image source={{ uri: 'https://www.theriphy.com/public/' + item.item.file_path + item.item.file_name }} style={{ width: '100%', height: '100%' }} />
                </TouchableOpacity>
                <TouchableOpacity style={{ width: 32, height: 32, position: 'absolute', top: 0, right: 0 }}
                    onPress={() => this.deleteImage(item.item)}>
                    <Image source={delete_icon} style={{ width: '100%', height: '100%', tintColor: '#832D7750' }} />
                </TouchableOpacity>
            </View>
        )
    }

    deleteImage = (item) => {
        Alert.alert(
            //title
            'Alert!',
            //body
            'Are you sure want to delete image?',
            [
                {
                    text: 'Yes',
                    onPress: () => this.deleteMotivationalImage(item)
                },
                {
                    text: 'No',
                    onPress: () => console.log('No Pressed'), style: 'cancel'
                },
            ],
            { cancelable: false },
            //clicking out side of alert will not cancel
        );
    }

    uploadFileOnServer = (data, category) => {
        ////////
        this.setState({ isUploadImage: false })
        let body = new FormData()
        data.map((item, index) => {
            if (this.state.upload_panding > index) {
                body.append("image[]", item);
            }
            console.log('this.state.upload_panding > index', this.state.upload_panding, index)
        })
        // body.append("image[]", data);
        body.append("album_name", category);
        console.log('get userData', body)
        setTimeout(() => {
            this.setState({ loading: true })
        }, 500);

        API.postApi(API_UPLOAD_MOTIVATION_IMAGE, body, this.successUploadImageResponse, this.failureResponse);
    }
    getMotivationalData = () => {
        this.setState({ loading: true })
        let body = {}
        console.log('get body ----', body);

        API.postApi(API_VIEW_MOTIVATION, body, this.successMotivationResponse, this.failureResponse);
    }
    deleteMotivationalImage = (item) => {
        this.setState({ loading: true })
        let body = new FormData()
        body.append("motivation_id", item.id);
        console.log('get item', item)
        // return
        API.postApi(API_DELETE_MOTIVATION_IMAGE, body, this.successDeleteImageResponse, this.failureResponse);
    }
    successDeleteImageResponse = (response) => {
        console.log('delete Motivation response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            this.getMotivationalData()
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 200)
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    successUploadImageResponse = (response) => {
        console.log('upload Motivation response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            this.getMotivationalData()
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 200)
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    successMotivationResponse = (response) => {
        console.log('get Motivation response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            let myKeyValue = Object.keys(response.data.data);
            let dataArray = myKeyValue.map((key, index) => {
                let item = response.data.data[key];
                console.log('get myKey Value data----------------', item, response, Object.values(response.data.category_list));
                let newObj = item.map((value, key) => {
                    console.log('get image ----', value);
                    let obj = {
                        uri: 'https://www.theriphy.com/public/' + value.file_path + value.file_name,
                        id: value.id,
                        index
                    }
                    return obj
                })

                const newCatFullList = Object.values(response.data.category_list).map((item, index) => {
                    return item.album_name
                })

                this.setState({ categoryFullList: newCatFullList, })


                console.log('get item data----------------', newObj)
                return [...newObj];
            });
            console.log('get data Array data----------------', dataArray);
            let dataValue = [{ album_name: 'Life-cycle' }, { album_name: 'Financial Vision' }, { album_name: 'Romantic Vision' }, { album_name: 'Family Vision' }, { album_name: 'Health Vision' }]
            let cat = dataValue.map((item, index) => {
                return item.album_name
            })

            let indexofParticular = Object.values(response.data.data).map((item, index) => {

                Object.values(item).map((newItem, newIndex) => {
                    newItem.index = index
                    return { ...newItem }
                })
                // item.selected = index
                return { ...item }
            })

            console.log('checkingggg image data----------------', response, indexofParticular, Object.values(response.data.data));

            this.setState({ motivationList: Object.values(response.data.data), categoryList: cat, upload_panding: response.data.pending_uploads })
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    failureResponse = (error) => {
        console.log('get error value', error);
        this.setState({ loading: false })
    }
}

const styles = StyleSheet.create({
    backgroundImageView: {
        width: '100%',
        height: '100%'
    },
})
