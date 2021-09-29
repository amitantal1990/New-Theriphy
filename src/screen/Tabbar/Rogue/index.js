import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, DeviceEventEmitter, Image, FlatList, Linking, RefreshControl, TouchableOpacity } from 'react-native'
import Wrapper from '../../../component/Wrapper'
import Header from '../../../component/Header'
import { bg_icon, calendar_icon, delete_icon } from '../../../utility/ImageConstant';
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, } from '../../../utility'
import { SUCCESS_STATUS, API_GET_RELAXATION_DATA, API_ROGUE_ACCESS_COUNT } from '../../../utility/APIConstant'
import { Content } from 'native-base';
import moment from 'moment'
import { CLR_PLACEHOLDER, CLR_DARKGREY, CLR_PRIMARY } from '../../../utility/Colors';
import YoutubePlayer from '../../../component/YoutubePlayer'
import { useFocusEffect } from "@react-navigation/native"

export default class Rogue extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            rogueList: [],
            searchText: '',
            youtubeVideoId: '',
            isShowDropDown: false,
        }
    }
    componentDidMount() {
        this.getGoRogueData('')
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.setState({ youtubeVideoId: '' })
            if (this.state.isShowDropDown) {
                DeviceEventEmitter.emit('updateUser', { data: 'dropDown' })
            }
        })
    }
    componentWillUnmount() {
        this.focusListener()
    }

    viewHeader = () => {
        return (
            <View style={{ width: wp(100), height: 50, backgroundColor: 'red' }}>

            </View>
        )
    }
    render() {
        const { rogueList, youtubeVideoId } = this.state
        return (
            <View style={{ flex: 1, paddingTop: hp(21) }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    {/* <View style={styles.listContainer}> */}
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        // style={styles.listContainer}
                        data={rogueList}
                        renderItem={this.renderRogueItems}
                        // refreshControl={
                        //     <RefreshControl
                        //         refreshing={isFetching}
                        //         onRefresh={() => this.onRefresh()}
                        //     />
                        // }
                        keyExtractor={(item, index) => index.toString()}
                    />

                    {/* </View> */}



                </ImageBackground>
                <View style={{ position: 'absolute' }}>
                    <Header title={'Go Rogue'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        searchBtnAction={(text) => this.getGoRogueData(text)}
                        onOpenDrop={(res) => this.setState({ isShowDropDown: res })}
                    />
                </View>
                {youtubeVideoId !== '' &&
                    <View style={{ width: wp(100), position: 'absolute', top: hp(23), }}>
                        <YoutubePlayer
                            videoId={youtubeVideoId}
                        />
                        <TouchableOpacity style={{ width: 30, height: 30, position: 'absolute', right: wp(6) - 15, top: -25, alignItems: 'center', padding:2 }}
                            onPress={() => this.setState({ youtubeVideoId: '' })}
                        >
                            <Image source={delete_icon} style={{ width: 30, height: 30, resizeMode: 'contain', tintColor: CLR_PRIMARY }} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }

    tabbedItemView = (item) => {
        if (item.file_type === 'links') {
            if (item.is_youtube === '1') {
                this.setState({ youtubeVideoId: item.youtube_video_id })
            } else {
                Linking.canOpenURL(item.url).then(supported => {
                    if (supported) {
                        Linking.openURL(item.url);
                    } else {
                        console.log("Don't know how to open URI: " + item.url);
                    }
                });
            }
        } else {
            this.props.navigation.navigate('RogueDetail', { data: item })
        }
        let body = new FormData()
        body.append("content_id", item.id);
        console.log('get value---------', body);
        API.postApi(API_ROGUE_ACCESS_COUNT, body, this.successUpdateResponse, this.failureResponse);
    }

    successUpdateResponse = (response) => {
        console.log('get reading response-------', response.data.data);
        this.setState({ loading: false, isFetching: false })
        if (SUCCESS_STATUS == response.status) {
            this.getGoRogueData(this.state.searchText)
        } else {

        }
    }
    // , updateRogueList = () => this.getGoRogueData(this.state.searchText)
    renderRogueItems = (item) => {
        if (item.item.file_type === 'custom') {
            return (
                <View style={{alignSelf:'center',  width: wp(86), height: 44, justifyContent: 'center', alignItems: 'center', marginTop: item.index > 0 ? wp(8) : wp(3), borderColor: '#832D77', borderWidth: 1, borderRadius: 10 }}>
                    <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.5), fontWeight: '700' }}>{item.item.title}</Text>
                </View>
            )
        }

        return (
            <TouchableOpacity style={{alignSelf:'center', width: '85%', height: 100, borderBottomColor: CLR_PLACEHOLDER, borderBottomWidth: 1, flexDirection: 'row' }}
                onPress={() => this.tabbedItemView(item.item)}>
                <Image source={item.item.icon_file_path === '' ? images : { uri: item.item.icon_file_path }} style={styles.topicImage} />
                <View style={{ width: wp('90') - 86, height: 100 }}>
                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 6, justifyContent: 'space-between' }}>
                        <Text style={{ width: wp('90') - 180, color: CLR_DARKGREY, fontSize: wp(4.5), }} numberOfLines={1}>{item.item.title}</Text>
                        <View style={{ flexDirection: 'row', width: 93, justifyContent: 'flex-end' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: CLR_PRIMARY }} source={calendar_icon} />
                            <Text style={{ color: CLR_PRIMARY, fontSize: wp(3) }}> {moment(item.item.created_at).fromNow()}</Text>
                            {/* <Text style={{ color: CLR_PRIMARY }}> {moment(item.item.created_at).format('MM/DD/YYYY')}</Text> */}
                        </View>
                    </View>
                    <Text numberOfLines={2} style={{ color: CLR_DARKGREY }}>{item.item.tags}</Text>
                    {/* <TouchableOpacity style={{ width: 24, height: 30, position: 'absolute', right: 0, bottom: 0 }}
                        onPress={() => this.completeMethod(item.item.id, item.index)} >
                        <Image style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: CLR_PRIMARY, marginTop: 3 }} source={item.item.isComplete ? complete_icon : un_complete_icon} />
                    </TouchableOpacity> */}
                </View>
            </TouchableOpacity>
        )
    }

    rendeRogueItem = () => {
        return (
            <View style={{ width: wp(96), height: hp(15) }}>
                <Text>Hello</Text>
            </View>
        )
    }
    getGoRogueData = (text) => {
        this.setState({ loading: true, searchText: text })
        let url = 'https://www.theriphy.com/api/go-rogue?search_title=' + text
        console.log('get iamge------', url)
        API.getApi(url, this.successRogueResponse, this.failureResponse);
    }

    successRogueResponse = (response) => {
        console.log('get rogue response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            let updatedArray = []
            response.data.data.map((item, index) => {

                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))

                // data.relaxation_audio = 'https://www.theriphy.com/' + data.file_path + data.relaxation_audio
                // console.log('get image path=======..........>>>>>', data.file_path);

                if (data.icon_file_path.length > 4 && data.icon_file_name.length > 4) {
                    data.icon_file_path = 'https://www.theriphy.com/public/' + data.icon_file_path + data.icon_file_name
                } else {
                    data.icon_file_path = ''
                }
                if (data.file_type === 'text' || data.file_type === 'jpg' || data.file_type === 'jpeg' || data.file_type === 'png' || data.file_type === 'xlsx' || data.file_type === 'txt' || data.file_type === 'pdf' || data.file_type === 'docx' || data.file_type === 'gif' || data.file_type === 'xls') {
                    data.file_path = 'https://www.theriphy.com/public/' + data.file_path + data.file_name
                    // console.log('get image path=======', data.file_path);
                }
                updatedArray.push(data)
            })
            let updatedPopular = []
            response.data.most_popular.map((item, index) => {

                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))

                // data.relaxation_audio = 'https://www.theriphy.com/' + data.file_path + data.relaxation_audio
                // console.log('get image path=======..........>>>>>', data.file_path);

                if (data.icon_file_path.length > 4 && data.icon_file_name.length > 4) {
                    data.icon_file_path = 'https://www.theriphy.com/public/' + data.icon_file_path + data.icon_file_name
                } else {
                    data.icon_file_path = ''
                }
                if (data.file_type === 'text' || data.file_type === 'jpg' || data.file_type === 'jpeg' || data.file_type === 'png' || data.file_type === 'xlsx' || data.file_type === 'txt' || data.file_type === 'pdf' || data.file_type === 'docx' || data.file_type === 'xls' || data.file_type === 'gif') {
                    data.file_path = 'https://www.theriphy.com/public/' + data.file_path + data.file_name
                    // console.log('get image path=======', data.file_path);
                }
                index == 0 ? updatedArray.push({ file_type: 'custom', title: 'Most Popular' }) : ''
                updatedArray.push(data)
            })
            let imageArray = updatedArray.length > 0 ? [updatedArray, updatedPopular] : [updatedPopular]
            console.log('get image---------', updatedPopular)
            this.setState({ rogueList: updatedArray })
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
    listContainer: {
        flex: 1,
        width: '92%',
        marginBottom: '4%',
        marginTop: '4%',
        alignSelf: 'center',
        padding: '3%',
        paddingTop: '0%',
        backgroundColor: 'white',
        borderRadius: 12,
        elevation: 5,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 10,
        shadowOpacity: 0.30
    },
    topicImage: {
        width: 60, height: 60,
        borderRadius: 30,
        marginTop: 20,
        marginRight: 10
    }
})
