import React, { Component } from 'react'
import { Text, StyleSheet, View, Linking, ImageBackground, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native'
import Header from '../../../component/Header'
import { bg_icon, book_icon } from '../../../utility/ImageConstant'
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, retrieveData } from '../../../utility'
import { SUCCESS_STATUS, API_GET_READING_DATA } from '../../../utility/APIConstant'
import { Content } from 'native-base';

export default class Reading extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            readingList: [],
            searchText: '',
            isFetching: false,
        }
    }
    componentDidMount() {

        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.setState({searchText: ''})
            this.getReadingData()
        });
        this.setState({loading: true })
        this.getReadingData()
    }

    componentWillUnmount() {
        this._unsubscribe();
    }
    onRefresh = () => {
        this.setState({ isFetching: true, searchText: '' }, () => {
            this.getReadingData()
        });
    }
    render() {
        const { readingList, loading, searchText, isFetching } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Reading'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        searchBtnAction={(text) => this.searchBtnAction(text)}
                        searchText={searchText}
                    />
                    <Loader loading={loading} />
                    {/* <Content style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}> */}
                    <FlatList
                        style={{}}
                        // bounces={false}
                        numColumns={2}
                        data={readingList}
                        refreshControl={
                            <RefreshControl
                                refreshing={isFetching}
                                onRefresh={() => this.onRefresh()}
                            />
                        }
                        renderItem={this.renderReadingItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    {/* </Content> */}
                </ImageBackground>
            </View>
        )
    }

    tabbedItemView = (item) => {
        if (item.file_type === 'links') {
            Linking.canOpenURL(item.url).then(supported => {
                if (supported) {
                    Linking.openURL(item.url);
                } else {
                    console.log("Don't know how to open URI: " + item.url);
                }
            });
        } else {
            this.props.navigation.navigate('ReadingDetail', { data: item })
        }

    }

    renderReadingItem = (item) => {
        // console.log('get item value', item.item.file_type);
        const { file_type } = item.item
        let images = ''
        if (file_type === 'png' || file_type === 'jpeg' || file_type === 'jpg') {
            images = require('../../../assets/image.png')
        } else if (file_type === ('text' || 'txt')) {
            images = require('../../../assets/doc.png')
        } else if (file_type === "docx" || file_type === "xlsx") {
            images = require('../../../assets/text.png')
        } else if (file_type === "pdf") {
            images = require('../../../assets/pdf-icon.png')
        }
        else if (file_type === "links") {
            images = require('../../../assets/web.png')
        }
        else {
            images = require('../../../assets/doc.png')
        }

        return (
            <View style={{ width: wp(50), minHeight: wp(44), paddingLeft: wp(4), paddingRight: wp(4), paddingTop: wp(4) }}>
                {/* <View style={{ width: wp(50), height: wp(44) + 45, padding: wp(4) }}> */}
                <TouchableOpacity style={styles.renderContainer}
                    onPress={() => this.tabbedItemView(item.item)}
                >
                    <Image source={images} style={{ width: '60%', height: '60%', resizeMode: 'contain' }} />
                    <Text style={{ textAlign: 'center', marginTop: 8, fontSize: wp(3.4), color: 'black' }} numberOfLines={2} >{item.item.tags}</Text>
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', marginTop: 8, fontSize: wp(4.2), color: 'black' }} >{item.item.title}</Text>
            </View>
        )
    }

    //////////////////// Search Section //////////////////
    searchBtnAction = async (text) => {
        console.log('g========', text)
        if (text.length > 0) {
            let body = new FormData()
            let userData = await retrieveData('user_data')
            body.append("search", text);
            body.append("therapist_id", userData.therapist_id)
            console.log('g========', body)
            this.setState({ searchText: text })
            API.postApi(API_GET_READING_DATA, body, this.successSearchResponse, this.failureResponse);
        } else {
            this.setState({ searchText: text})
            this.getReadingData()
        }
    }
    getReadingData = async () => {
        let userData = await retrieveData('user_data')
        console.log('get userData', userData)
        let body = new FormData()
        body.append("therapist_id", userData.therapist_id);
        API.postApi(API_GET_READING_DATA, body, this.successReadingResponse, this.failureResponse);
    }
    successSearchResponse = (response) => {
        console.log('get Search response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            let updatedArray = []
            response.data.data.map((item, index) => {
                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))
                if (data.file_type === 'text' || data.file_type === 'jpg' || data.file_type === 'png' || data.file_type === 'xlsx' || data.file_type === 'txt' || data.file_type === 'pdf' || data.file_type === 'docx') {
                    data.file_path = 'https://theriphy.myfileshosting.com/public/' + data.file_path + data.file_name
                    // console.log('get image path=======', data.file_path);
                }
                updatedArray.push(data)
            })
            // console.log('get con------------', updatedArray);
            this.setState({ readingList: updatedArray })
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    successReadingResponse = (response) => {
        console.log('get reading response-------', response.data.data);
        this.setState({ loading: false, isFetching: false })
        if (SUCCESS_STATUS == response.status) {
            let updatedArray = []
            response.data.data.map((item, index) => {
                // file_type: "text"
                // file_type: "jpg"
                // file_type: "links"
                // file_type: "docx"
                // file_type: "pdf"
                // file_type: "txt"
                // file_type: "xlsx"
                // file_type: "png"
                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))
                // data.relaxation_audio = 'https://theriphy.myfileshosting.com/' + data.file_path + data.relaxation_audio
                // console.log('get image path=======..........>>>>>', data.file_path);
                if (data.file_type === 'text' || data.file_type === 'jpg' || data.file_type === 'png' || data.file_type === 'xlsx' || data.file_type === 'txt' || data.file_type === 'pdf' || data.file_type === 'docx') {
                    data.file_path = 'https://theriphy.myfileshosting.com/public/' + data.file_path + data.file_name
                    // console.log('get image path=======', data.file_path);
                }
                updatedArray.push(data)
            })
            console.log('get con------------', updatedArray);
            this.setState({ readingList: updatedArray })
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
    renderContainer: {
        backgroundColor: 'white',
        width: '100%',
        height: wp(44),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 5,
        paddingBottom: 0,
        shadowColor: '#000',
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: wp(5),
        elevation: 5
    }

})
