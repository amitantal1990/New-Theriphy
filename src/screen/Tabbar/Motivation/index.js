import React, { Component } from 'react'
import { Text, StyleSheet, Alert, View, ImageBackground, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
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

export default class Motivation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            motivationList: [],
            isUploadImage: false,
            categoryList: [],
            upload_panding: 0
        }
    }
    componentDidMount() {
        // let userData = await retrieveData('user_data')
        this.getMotivationalData()
    }
    showInfo = () => {
        Alert.alert(
            //title
            'Information!',
            //body
            'Here you may upload images or create posts to share with your therapist and to remind yourself of your vision and goals. This helps you stay on track, keep your focus and support your motivation for lifelong change!',
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
        const { motivationList, isUploadImage, categoryList, loading, upload_panding } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Motivation'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        onPressInfo={() => this.showInfo()}
                        hideSearch={true}
                        onPressUpload = {() => this.uploadImageData()}
                    />
                    {/* <View style={{ width: wp(100), height: 44, justifyContent: 'center', alignItems: 'center', marginTop: wp(1.5) }}>
                        <TouchableOpacity>
                            <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.2) }}>Photo</Text>
                        </TouchableOpacity>
                    </View> */}

                    <Modal
                        isVisible={isUploadImage}
                        onBackdropPress={() => this.setState({ isUploadImage: false })}
                    >
                        <Popup
                            categoryData={categoryList}
                            max_upload={upload_panding > 10 ? 10 : upload_panding}
                            onPressCancel={() => this.setState({ isUploadImage: false })}
                            onPressUploadFile={(item, cate) => this.uploadFileOnServer(item, cate)}
                            onPressCustomFile={() => alert('hi')}
                        />
                    </Modal>
                    {/* {motivationList.length > 0 &&
                        motivationList.map((item, value) => {
                            return (
                                <ScrollView style = {{height: hp(100), width: wp(100)}}>
                                    <MasonryList
                                        images={item}
                                        backgroundColor={'transparent'}
                                        columns={2}
                                        // listContainerStyle={{ backgroundColor: 'yellow' }}
                                        listContainerStyle={{ width: wp('100%'), alignSelf: 'center', paddingLeft: wp('2%') }}
                                        onPressImage={(item, index) => console.log('get value', item)}
                                        // onPressImage = {(item, index) => this.getTappedImage(item, index)}  
                                        // imageContainerStyle={{}}
                                        imageContainerStyle={{ width: wp('46%'), margin: wp('1%'), borderRadius: 10, }}
                                    />
                                </ScrollView>
                            )

                        })
                    } */}

                    <FlatList
                        showsVerticalScrollIndicator={false}
                        // bounces={false}
                        style={{ marginTop: 10 }}
                        data={motivationList}
                        renderItem={this.renderMotivationItems}
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={isFetching}
                        //         onRefresh={() => this.onRefresh()}
                        //     />
                        // }
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Loader loading={loading} />
                    {/* <View style={{ width: wp(100), height: 60, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ flexDirection: 'row' }}
                            onPress={() => this.uploadImageData()}>
                            <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.2) }}>Upload Images</Text>
                            <Image style={{ width: 22, height: 22, tintColor: CLR_PRIMARY, marginLeft: 10, resizeMode: 'contain' }} source={gallery_icon} />
                        </TouchableOpacity>
                    </View> */}
                </ImageBackground>
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
        // console.log('hjsfhs skdf', item)
        return (
            <View style={{ width: wp(100), alignItems: 'center' }}>
                <View style={{ width: wp(94), height: 40, justifyContent: 'center', alignItems: 'center', marginTop: wp(1), marginBottom: wp(1), marginHorizontal: wp(3), borderColor: '#832D7750', borderWidth: 1, borderRadius: 8 }}>
                    <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.5), fontWeight: '700' }}>{this.state.categoryList[item.index]}</Text>
                </View>

                {/* <MasonryList
                        images={item.item}
                        backgroundColor={'transparent'}
                        columns={2}
                        // listContainerStyle={{ backgroundColor: 'yellow' }}
                        listContainerStyle={{ width: wp('100%'), alignSelf: 'center', paddingLeft: wp('2%') }}
                        onPressImage={(item, index) => console.log('get value', item)}
                        // onPressImage = {(item, index) => this.getTappedImage(item, index)}  
                        imageContainerStyle={{}}
                        imageContainerStyle={{ width: wp('46%'), margin: wp('1%'), borderRadius: 10, }}
                    /> */}

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
        // console.log('get -----', item)
        // Image.getSize(item.item.uri, (width, height) => {
        //     if (width > wp(46)) {
        //         let value = width - wp(46)
        //         let percent = value * 100 / wp(46)
        //         let newHeight = height * (100 - percent) / 100
        //         console.log('get width', value);
        //         console.log('get height-------', newHeight)

        //     } else {
        //         let value = wp(46) - width
        //         let percent = value * 100 / width
        //         let newHeight = height * (percent+ 100) / 100
        //         console.log('get width', value);
        //         console.log('get height-------', newHeight)

        //     }
        //     console.log('get width', width);
        //     console.log('get height', height);
        // })
        return (
            <View style={{ width: wp('46%'), margin: wp('1%'), borderRadius: 10, height: wp(46), backgroundColor: CLR_LIGHT_LIGHT_GRAY, overflow: 'hidden' }}>
                <TouchableOpacity style={{ width: '100%', height: '100%' }}
                    onPress={() => this.props.navigation.navigate('ImageDetail', { data: this.state.motivationList[item.item.index], selectedIndex: item.index })}
                >
                    <Image source={{ uri: item.item.uri }} style={{ width: '100%', height: '100%'}} />
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
                console.log('get myKey Value data----------------', item);
                let newObj = item.map((value, key) => {
                    console.log('get image ----', value);
                    let obj = {
                        uri: 'https://theriphy.myfileshosting.com/public/' + value.file_path + value.file_name,
                        id: value.id,
                        index
                    }
                    return obj
                })
                console.log('get item data----------------', newObj)
                //   item.file_path = 'https://theriphy.myfileshosting.com/public/' + item.file_path + item.file_name;
                // //   console.log('get item data----------------',item);
                return [...newObj];
            });
            console.log('get data Array data----------------', dataArray);
            let cat = response.data.category_list.map((item, index) => {
                return item.album_name
            })

            console.log('get image data----------------', cat);
            // let data = response.data.data.map((item, index) => {
            //     let obje = {
            //         uri: 'https://theriphy.myfileshosting.com/public/' + item.file_path + item.file_name,
            //         id: item.id
            //     }
            //     return obje
            // })
            // console.log('get image valeu------', data)

            this.setState({ motivationList: dataArray, categoryList: cat, upload_panding: response.data.pending_uploads })
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
