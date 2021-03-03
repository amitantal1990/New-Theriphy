import React, { Component } from 'react'
import { Text, StyleSheet, View, FlatList, ImageBackground, TouchableOpacity, Image, RefreshControl } from 'react-native'
import Header from '../../../component/Header'
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, } from '../../../utility'
import { SUCCESS_STATUS, API_GET_RELAXATION_DATA, API_SEARCH_LIST } from '../../../utility/APIConstant'
import { Content } from 'native-base';
import Utils from '../../../utility/API'
import { bg_icon, play_icon } from '../../../utility/ImageConstant';
import { CLR_DARKGREY, CLR_PRIMARY, CLR_SECOND_PRIMARY } from '../../../utility/Colors';


export default class Relaxation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            relaxationList: [],
            isFetching: false,
            searchText: ''
        }
    }
    componentDidMount() {
        this.setState({ loading: true })
        this.getRelaxationData()
    }
    onRefresh = () => {
        this.setState({ isFetching: true, searchText: '' }, () => {
            this.getRelaxationData()
        });
    }

    render() {
        const { loading, relaxationList, isFetching, searchText } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Relaxation'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        searchBtnAction={(text) => this.searchBtnAction(text)}
                        searchText = {searchText}
                    />
                    <Loader loading={loading} />
                    {/* <Content style={{ flex: 1 }}> */}
                    <FlatList
                        style={{ marginTop: wp(2), alignSelf: 'center' }}
                        data={relaxationList}
                        renderItem={this.renderRelaxationItem}
                        refreshControl={
                            <RefreshControl
                                refreshing={isFetching}
                                onRefresh={() => this.onRefresh()}
                            />
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                    {/* </Content> */}
                </ImageBackground>
            </View>
        )
    }

    //////////////////// Search Section //////////////////
    searchBtnAction = (text) => {
        console.log('g========', text)
        if (text.length > 0) {
            let body = new FormData()
            body.append("relaxation_name", text);
            // console.log('g========', body)
            this.setState({ searchText: text })
            API.postApi(API_SEARCH_LIST, body, this.successSearchResponse, this.failureResponse);
        } else {
            this.setState({ searchText: text, loading: true })
            this.getRelaxationData()
        }
    }

    renderRelaxationItem = (item) => {
        // console.log('get item', item.item.id)
        return (
            <TouchableOpacity style={{ width: wp(94), height: wp(42), marginTop: wp(3), borderRadius: wp(3), overflow: 'hidden', borderColor: item.index % 2 == 0 ? CLR_PRIMARY : CLR_SECOND_PRIMARY, borderWidth: 3.5 }}
                onPress={() => this.props.navigation.navigate('AudioPlayer', { data: this.state.relaxationList, index: item.index })}
            >
                <ImageBackground style={{}} source={{ uri: item.item.file_path }} >
                    <View style={{ width: '50%', height: '50%', paddingLeft: wp(4), paddingTop: wp(2) }}>
                        <Text style={{ fontWeight: '700', fontSize: wp(4.5), color: 'white' }} numberOfLines={2} >{item.item.relaxation_name}</Text>
                        <Text style={{ fontSize: wp(4.2), color: 'white' }} numberOfLines={2}>{item.item.relaxation_text}</Text>
                    </View>
                    <View style={{ width: '50%', height: '50%', paddingLeft: wp(4), alignItems: 'center', flexDirection: 'row' }}>
                        <Image source={play_icon} style={{ width: wp(12), height: wp(12), tintColor: 'white' }} />
                        <Text style={{ fontSize: wp(4.2), color: 'white', marginLeft: 10 }} numberOfLines={2}>{item.item.audio_duration} Minutes</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }

    getRelaxationData = () => {
        API.getApi(API_GET_RELAXATION_DATA, this.successRelaxResponse, this.failureResponse);
    }
    successRelaxResponse = (response) => {
        console.log('get relax response-------', response);
        this.setState({ loading: false, isFetching: false })
        if (SUCCESS_STATUS == response.status) {
            let updatedArray = []
            response.data.relaxations.map((item, index) => {
                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))
                data.relaxation_audio = 'https://theriphy.myfileshosting.com/' + data.file_path + data.relaxation_audio
                data.file_path = 'https://theriphy.myfileshosting.com/' + data.file_path + data.file_name
                updatedArray.push(data)
            })
            console.log('get response-----', updatedArray)
            this.setState({ relaxationList: updatedArray })
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    successSearchResponse = (response) => {
        console.log('get Search response-------', response);
        this.setState({ loading: false, isFetching: false })
        if (SUCCESS_STATUS == response.status) {
            let updatedArray = []
            response.data.search_data.map((item, index) => {
                const data = JSON.parse(JSON.stringify(item).replace(/\:null/gi, "\:\"\""))
                data.relaxation_audio = 'https://theriphy.myfileshosting.com/' + data.file_path + data.relaxation_audio
                data.file_path = 'https://theriphy.myfileshosting.com/' + data.file_path + data.file_name
                updatedArray.push(data)
            })
            this.setState({ relaxationList: updatedArray })
        } else {
            setTimeout(() => {
                Toast.show(response.data.message)
            }, 100)
        }
    }
    failureResponse = (error) => {
        console.log('get error value', error.message);
        console.log('get error value', error.response);
        this.setState({ loading: false })
    }
}

const styles = StyleSheet.create({
    backgroundImageView: {
        width: '100%',
        height: '100%'
    },
})




const audioBookPlaylist = [
    {
        relaxation_text: 'Hamlet - Act I',
        relaxation_name: 'William Shakespeare',
        source: 'Librivox',
        audio_duration: 4,
        relaxation_audio:
            'http://www.samisite.com/sound/cropShadesofGrayMonkees.mp3',
        file_path: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
    },
    {
        relaxation_text: 'Hamlet - Act II',
        relaxation_name: 'William Shakespeare',
        source: 'Librivox',
        audio_duration: 4,
        relaxation_audio:
            'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3',
        file_path: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
    },
    {
        relaxation_text: 'Hamlet - Act III',
        relaxation_name: 'William Shakespeare',
        source: 'Librivox',
        audio_duration: 4,
        relaxation_audio: 'http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3',
        file_path: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
    },
    {
        relaxation_text: 'Hamlet - Act IV',
        relaxation_name: 'William Shakespeare',
        source: 'Librivox',
        audio_duration: 4,
        relaxation_audio:
            'https://dl.espressif.com/dl/audio/ff-16b-1c-44100hz.mp3',
        file_path: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
    },
    {
        relaxation_text: 'Hamlet - Act V',
        relaxation_name: 'William Shakespeare',
        source: 'Librivox',
        audio_duration: 4,
        relaxation_audio:
            'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        file_path: 'http://www.archive.org/download/LibrivoxCdCoverArt8/hamlet_1104.jpg'
    }
]