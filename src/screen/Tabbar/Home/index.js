import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, FlatList, Linking, TouchableOpacity, Image, Platform, RefreshControl } from 'react-native'
import Wrapper from '../../../component/Wrapper'
import Header from '../../../component/Header'
import { bg_icon, play_icon, calendar_icon, web_icon, doc_icon, video_icon, image_icon, complete_icon, un_complete_icon, delete_icon } from '../../../utility/ImageConstant'
import Loader from '../../../component/Loader'
import moment from 'moment'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, retrieveData } from '../../../utility'
import { SUCCESS_STATUS, API_GET_HOME_DATA, API_MARK_COMPLETE_DATA } from '../../../utility/APIConstant'
import { Content } from 'native-base';
import SegmentedControl from '@react-native-community/segmented-control'
import { CLR_PRIMARY, CLR_SECOND_PRIMARY, CLR_DARKGREY, CLR_PLACEHOLDER } from '../../../utility/Colors'
// import Segment from '../../../component/SegmentView'
import YoutubePlayer from '../../../component/YoutubePlayer'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            homeList: [],
            historyList: [],
            selectedIndex: 0,
            searchText: '',
            isFetching: false,
            youtubeVideoId: ''
        }
    }
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({ searchText: '' })
            this.getHomeWorkData()
            this.getHistryData('')
        })
        this.setState({ loading: true })
        this.getHomeWorkData()
        this.getHistryData('')
    }
    componentWillUnmount() {
        this._unsubscribe();
        // this.setState({youtubeVideoId: ''})
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
            this.props.navigation.navigate('HomeDetail', { data: item })
        }
    }

    onRefresh = () => {
        this.setState({ isFetching: true, searchText: '' }, () => {
            this.state.selectedIndex == 0 ? this.getHomeWorkData()
                : this.getHistryData('')
        });
    }
    render() {

        const { selectedIndex, homeList, loading, searchText, historyList, isFetching, youtubeVideoId } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Homework'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        // searchBtnAction={(text) => console.log('get image')}
                        searchBtnAction={(text) => this.searchBtnAction(text)}
                        searchText={searchText}
                    />
                    <SegmentedControl
                        style={{ height: wp(14), marginHorizontal: wp(4), marginTop: wp(6), marginBottom: wp(4) }}
                        values={['Current', 'History']}
                        containerStyle={{ marginVertical: 20 }}
                        selectedIndex={selectedIndex}
                        //  { ...Platform.OS !== 'ios' ? fontStyle = {color: CLR_PRIMARY } : null}
                       // fontStyle={{ color: CLR_PRIMARY }}
                        activeFontStyle={{ color: 'white', fontSize: wp(4.4) }}
                        // backgroundColor= '#ffff'
                        appearance='light'
                        // appearance="dark"
                        tintColor={CLR_PRIMARY}
                        onChange={(event) => {
                            this.setState({ selectedIndex: event.nativeEvent.selectedSegmentIndex });
                        }}
                    />

                    {/* <View style={styles.listContainer}> */}
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            // style={{margin: wp(3)}}
                            style={styles.listContainer}
                            data={selectedIndex == 0 ? homeList : historyList}
                            // data={[]}
                            renderItem={this.renderHomeItems}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isFetching}
                                    onRefresh={() => this.onRefresh()}
                                />
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                    {/* </View> */}
                    <Loader loading={loading} />
                    {youtubeVideoId !== '' &&
                        <View style={{ width: wp(100), position: 'absolute', top: hp(23)}}>
                            <YoutubePlayer
                                videoId={youtubeVideoId}
                            />
                            <TouchableOpacity style={{ width: 30, height: 30, position: 'absolute', right: wp(4) - 15, top: -15, alignItems: 'center', }}
                                onPress={() => this.setState({ youtubeVideoId: '' })}
                            >
                                <Image source={delete_icon} style={{ width: 30, height: 30, resizeMode: 'contain', tintColor: CLR_PRIMARY }} />
                            </TouchableOpacity>
                        </View>
                    }
                </ImageBackground>
            </View>
        )
    }

    completeMethod = (id, indexValue) => {

        let items = this.state.selectedIndex == 0 ? [...this.state.homeList] : [...this.state.historyList]
        let item = { ...items[indexValue] };
        item.isComplete = this.state.selectedIndex == 0 ? true : false;
        items[indexValue] = item;

        let body = new FormData()
        body.append("content_id", id);
        body.append("mark_complete", this.state.selectedIndex == 0 ? '1' : '0');
        console.log('get image ---', body)
        this.state.selectedIndex == 0 ? this.setState({ loading: true, homeList: items }) : this.setState({ loading: true, historyList: items })
        API.postApi(API_MARK_COMPLETE_DATA, body, this.successMarkResponse, this.failureResponse);/*  */
    }
    renderHomeItems = (item) => {
        console.log('------->>>>--------', item)
        const { file_type } = item.item
        let images = ''
        if (file_type === ('jpg' || 'png' || 'jpeg')) {
            images = require('../../../assets/image.png')
        } else if (file_type === ('text' || 'txt')) {
            images = require('../../../assets/doc.png')
        } else if (file_type === ("docx" || "xlsx")) {
            images = require('../../../assets/text.png')
        } else if (file_type === "pdf") {
            images = require('../../../assets/pdf-icon.png')
        } else if (file_type === "links") {
            images = require('../../../assets/web.png')
        } else {
            images = require('../../../assets/doc.png')
        }
        return (
            <TouchableOpacity style={{ width: '100%', height: 110, borderBottomColor: CLR_PLACEHOLDER, borderBottomWidth: 1, flexDirection: 'row',}}
                onPress={() => this.tabbedItemView(item.item)}>

                <Image source={item.item.icon_file_path === '' ? images : { uri: item.item.icon_file_path }} style={styles.topicImage} />
                <View style={{ width: wp('90') - 86, height: 110 }}>
                    <View style={{ flexDirection: 'row', marginTop: 22, marginBottom: 6, justifyContent: 'space-between' }}>
                        <Text style={{ width: wp('90') - 180, color: CLR_DARKGREY, fontSize: wp(4.5) }} numberOfLines={1}>{item.item.title}</Text>
                        <View style={{ flexDirection: 'row', width: 95, justifyContent: 'flex-end' }}>
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: CLR_PRIMARY }} source={calendar_icon} />
                            <Text style={{ color: CLR_PRIMARY, fontSize: wp(3) }}> {moment(item.item.created_at).fromNow()}</Text>
                            {/* <Text style={{ color: CLR_PRIMARY }}> {moment(item.item.created_at).format('MM/DD/YYYY')}</Text> */}
                        </View>
                    </View>
                    <Text numberOfLines={2} style={{ color: CLR_DARKGREY }}>{item.item.tags}</Text>
                    <TouchableOpacity style={{ width: 24, height: 30, position: 'absolute', right: 0, bottom: 0 }}
                        onPress={() => this.completeMethod(item.item.id, item.index)} >
                        <Image style={{ width: 24, height: 24, resizeMode: 'contain', tintColor: CLR_PRIMARY, marginTop: 3 }} source={item.item.isComplete ? complete_icon : un_complete_icon} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }
    //////////////////// Search Section //////////////////
    searchBtnAction = (text) => {
        console.log('g========', text)
        if (text.length > 0) {
            if (this.state.selectedIndex == 0) {
                let url = 'https://theriphy.myfileshosting.com/api/get-homework-content?search_title=' + text
                this.setState({ searchText: text })
                API.getApi(url, this.successHomeWorkResponse, this.failureResponse);
            } else {
                // this.setState({ loading: true })
                this.getHistryData(text)
            }
        } else {
            this.setState({ searchText: text })
            this.getHomeWorkData()
        }
    }

    getHomeWorkData = async () => {
        let userData = await retrieveData('user_data')
        console.log('get userData', userData)
        let url = 'https://theriphy.myfileshosting.com/api/get-homework-content?therapist_id=' + userData.therapist_id
        console.log('get iamge------', url)
        API.getApi(url, this.successHomeWorkResponse, this.failureResponse);
    }
    getHistryData = (text) => {
        let url = 'https://theriphy.myfileshosting.com/api/view-mark-as-completed'
        let body = new FormData()
        body.append("search_title", text);
        this.setState({ searchText: text })
        API.postApi(url, body, this.successHistoryResponse, this.failureResponse);
    }
    successMarkResponse = (response) => {
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            this.getHomeWorkData()
            this.getHistryData('')
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    successHistoryResponse = (response) => {
        this.setState({ loading: false, isFetching: false })
        console.log('get History response-------', response);
        if (SUCCESS_STATUS == response.status) {
            let updatedArray = []
            response.data.data.map((item, index) => {
                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))
                data.isComplete = true
                // data.relaxation_audio = 'https://theriphy.myfileshosting.com/' + data.file_path + data.relaxation_audio
                // console.log('get image path=======..........>>>>>', data.file_path);

                if (data.icon_file_path.length > 4 && data.icon_file_name.length > 4) {
                    data.icon_file_path = 'https://theriphy.myfileshosting.com/public/' + data.icon_file_path + data.icon_file_name
                } else {
                    data.icon_file_path = ''
                }
                if (data.file_type === 'text' || data.file_type === 'jpg' || data.file_type === 'png' || data.file_type === 'xlsx' || data.file_type === 'txt' || data.file_type === 'pdf' || data.file_type === 'docx') {
                    data.file_path = 'https://theriphy.myfileshosting.com/public/' + data.file_path + data.file_name
                    // console.log('get image path=======', data.file_path);
                }
                updatedArray.push(data)
            })
            console.log('get history List ------ -----', updatedArray);
            this.setState({ historyList: updatedArray })
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    successHomeWorkResponse = (response) => {
        console.log('get Home response-------', response);
        this.setState({ loading: false, isFetching: false })
        if (SUCCESS_STATUS == response.status) {
            let updatedArray = []
            response.data.data.map((item, index) => {

                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))
                // data.relaxation_audio = 'https://theriphy.myfileshosting.com/' + data.file_path + data.relaxation_audio
                // console.log('get image path=======..........>>>>>', data.file_path);
                if (data.icon_file_path.length > 4 && data.icon_file_name.length > 4) {
                    data.icon_file_path = 'https://theriphy.myfileshosting.com/public/' + data.icon_file_path + data.icon_file_name
                } else {
                    data.icon_file_path = ''
                }
                data.isComplete = false
                if (data.file_type === 'text' || data.file_type === 'jpg' || data.file_type === 'png' || data.file_type === 'xlsx' || data.file_type === 'txt' || data.file_type === 'pdf' || data.file_type === 'docx') {
                    data.file_path = 'https://theriphy.myfileshosting.com/public/' + data.file_path + data.file_name
                    console.log('get image path=======', data.file_path);
                }
                updatedArray.push(data)
            })
            console.log('get mmmmmmmmm------------', updatedArray);
            this.setState({ homeList: updatedArray })

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
        alignSelf: 'center',
        paddingLeft : '3%',
        paddingRight: '3%',
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


