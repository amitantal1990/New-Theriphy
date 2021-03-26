import React, { Component } from 'react'
import { StyleSheet, Platform, Text, View, TouchableOpacity, Image, DeviceEventEmitter, AppState } from 'react-native'
import SoundPlayer from 'react-native-sound-player'
import Slider from '@react-native-community/slider';
import { wp, retrieveData } from '../utility';
import { back_audio, next_icon, play_icon, pause } from '../utility/ImageConstant'
import { CLR_SECOND_PRIMARY } from '../utility/Colors';
import Sound from 'react-native-sound';
import API from '../utility/API';
import { API_RELAXATION_ACCESS, SUCCESS_STATUS } from '../utility/APIConstant'
import Loader from './Loader'

var whoosh = undefined
export default class PlayerController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sliderValue: 0,
            audioDuration: 0.0,
            isPlay: false,
            isInitialize: true,
            totalTimer: this.getTimeValue(this.props.audioTime),
            updateTimer: '00:00',
            appState: AppState.currentState,
            currentIndex: {},
            loading: false
            // audioUrl: audioUrlArray[1],
        }
    }

    _handleAppStateChange = (nextAppState) => {
        // console.log('leler', );
        // if (whoosh !== undefined) {
        //     this.setState({ isInitialize: true, sliderValue: 0, totalTimer: '00:00', updateTimer: '00:00', isPlay: false })
        //     clearInterval(this.timeInterval)
        //     Platform.OS === 'ios' ? whoosh.stop() : whoosh.reset()
        // }
    }
    componentDidMount() {

        // this.setState({totalTimer: timer})
        AppState.addEventListener('change', this._handleAppStateChange);
        DeviceEventEmitter.addListener('stopAudio', () => {
            console.log('addListener -----', whoosh)
            if (whoosh !== undefined) {
                this.setState({ isInitialize: true, sliderValue: 0, totalTimer: '00:00', updateTimer: '00:00', isPlay: false })
                clearInterval(this.timeInterval)
                Platform.OS === 'ios' ? whoosh.stop() : whoosh.reset()
            }
        })
    }
    componentWillReceiveProps(props) {
        console.log('get props value', props);
        if (props.audioObj !== this.state.currentIndex) {
            console.log('get props value ========', props);
            console.log('componentWillReceiveProps -----', whoosh)
            this.setState({ 
                totalTimer: this.getTimeValue(props.audioTime), 
                currentIndex: props.audioObj, 
                isPlay: false ,
                isInitialize: true,
                sliderValue: 0,
                updateTimer: '00:00',
            })
            if (whoosh !== undefined) {
                clearInterval(this.timeInterval)
               Platform.OS === 'ios' ? whoosh.stop() : whoosh.reset()
            } 
        }
    }
    componentWillUpdate() {
        // console.log('get props  dfgdg  value',this.props.audioTime);
    }

    componentWillUnmount() {

        AppState.removeEventListener('change', this._handleAppStateChange);
        console.log('componentWillUnmount -----', whoosh)
        if (whoosh !== undefined) {
            clearInterval(this.timeInterval)
            Platform.OS === 'ios' ? whoosh.stop() : whoosh.reset()
        }
    }

    playAudioFile = () => {

        const { isPlay, isInitialize, sliderValue, audioUrl, } = this.state
        // Enable playback in silence mode
        Sound.setCategory('Playback');
        //alert(this.props.audioUri)
        if (isInitialize) {
             //alert(this.props.audioUri)
             const audioUrl = encodeURI(this.props.audioUri)
             this.setState({loading: true})
             console.log('get sudio ----', audioUrl)
            whoosh = new Sound(audioUrl, null, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
               
                // loaded successfully
                console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
                const min = this.changeValue(Math.floor(whoosh.getDuration() / 60).toFixed(0))
                const sec = this.changeValue((whoosh.getDuration() % 60).toFixed(0))
                const latestValue = min + ':' + sec
                console.log('get value', latestValue);
                this.props.OnPressPlay()
                this.setState({loading: false, isPlay: true, isInitialize: false, audioDuration: whoosh.getDuration(), totalTimer: latestValue })
                this.updateRelaxationCount()
                // Play the sound with an onEnd callback
                whoosh.play((success) => {
                    if (success) {
                        this.setState({ isInitialize: true, sliderValue: 0, updateTimer: '00:00', isPlay: false })
                        clearInterval(this.timeInterval)
                        whoosh.reset()
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
                this.timeInterval = setInterval(() => {
                    whoosh.getCurrentTime((time, playing) => {
                        console.log('get timer value', time, 'is--', playing)
                        if (playing) {
                            const min = this.changeValue(Math.floor(time / 60).toFixed(0))
                            const sec = this.changeValue((time % 60).toFixed(0))
                            const timer = min + ':' + sec
                            this.setState({ sliderValue: time, updateTimer: timer })
                        } else {
                            // console.log('get iamge vlue', this.state.audioDuration)
                            // console.log('get iamge vlue', time)
                            if (time > this.state.audioDuration - 1) {
                                this.setState({ isInitialize: true, sliderValue: 0, updateTimer: '00:00', isPlay: false })
                                clearInterval(this.timeInterval)
                            }
                        }
                    })
                }, 500);
            });
        } else {
            // // Pause the sound
            isPlay ? whoosh.pause() : whoosh.play()
            this.setState({ isPlay: !isPlay })
        }
    }


    onNxtPress = () => {
        // if (Platform.OS === 'ios') {
        //     this.setState({ isInitialize: true, sliderValue: 0, totalTimer: '00:00', updateTimer: '00:00', isPlay: false })
        //     clearInterval(this.timeInterval)
        //     whoosh.stop()
        //     // if (whoosh !== undefined) {
        //     //     whoosh.reset()
        //     // }
        // }
        this.props.onPressNext()
    }
    onPrePress = () => {
        // if (Platform.OS === 'ios') {
        //     this.setState({ isInitialize: true, sliderValue: 0, totalTimer: '00:00', updateTimer: '00:00', isPlay: false })
        //     clearInterval(this.timeInterval)
        //     whoosh.stop()
        //     // if (whoosh !== undefined) {
        //     //     whoosh.reset()
        //     // }
        // }
        this.props.onPressPre()
    }
    changeValue = (n) => {
        return n > 9 ? "" + n : "0" + n;
    }

    render() {
        const { sliderValue, audioDuration, updateTimer, totalTimer, isPlay, loading } = this.state

        return (
            <View style={{ width: wp(100), alignItems: 'center', }}>
                <View style={{ width: Platform.OS === 'ios' ? '94%' : '88%', flexDirection: 'row', marginTop: 5, marginBottom: Platform.OS === 'ios' ? 8 : 0 }}>
                    <Text>{updateTimer}</Text>
                    <Text style={{ position: 'absolute', right: 0 }}>{totalTimer}</Text>
                </View>
                <Slider
                    style={{ width: '94%', height: 40, marginTop: -8 }}
                    minimumValue={0}
                    maximumValue={audioDuration}
                    value={sliderValue}
                    minimumTrackTintColor={'black'}
                    thumbTintColor={'black'}
                    maximumTrackTintColor={'#3C3C3C'}
                    onValueChange={value => this.updateAudioTime(value)}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '50%', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.onPrePress()}>
                        <Image source={back_audio} style={{ width: wp(5), height: wp(5), resizeMode: 'contain' }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.playAudioFile()}>
                        <Image source={isPlay ? pause : play_icon} style={{ width: wp(12), height: wp(12), resizeMode: 'contain', tintColor: CLR_SECOND_PRIMARY }} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.onNxtPress()}>
                        <Image source={next_icon} style={{ width: wp(5), height: wp(5), resizeMode: 'contain' }} />
                    </TouchableOpacity>
                </View>
                <Loader loading = {loading}/>
            </View>
        )
    }


    getTimeValue = (time) => {
        const min = this.changeValue(time)
        const sec = ':00'
        const timer = min + sec
        return timer
    }

    updateAudioTime = (value) => {
        console.log('get value', value)
        whoosh.setCurrentTime(value)
        const min = this.changeValue(Math.floor(value / 60).toFixed(0))
        const sec = this.changeValue((value % 60).toFixed(0))
        const timer = min + ':' + sec
        this.setState({ updateTimer: timer })
    }

    // playingStartAudio = async () => {
    //     const { isPlay, isInitialize, sliderValue } = this.state
    //     try {
    //         // console.log('getInfo', SoundPlayer.getInfo())
    //         // const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
    //         // console.log('getInfo', sliderValue, 'player', SoundPlayer, 'hh', isInitialize)
    //         // if (isInitialize) {
    //         //     isPlay ? SoundPlayer.pause() : SoundPlayer.play()
    //         //     this.setState({ isPlay: !isPlay })
    //         // } else {
    //         SoundPlayer.playUrl('http://www.hubharp.com/web_sound/BachGavotteShort.mp3')
    //         // SoundPlayer.playUrl(encodeURI(this.props.audioUri))
    //         //     this.setState({ isPlay: !isPlay, isInitialize: true })
    //         // }

    //         // if (SoundPlayer !== null) {
    //         //     // SoundPlayer.playUrl('https://theriphy.myfileshosting.com/public/images/admin/Chithiyaan%20%20Official%20Remix%20-(Mr-Jatt.com).mp3')
    //         //     SoundPlayer.playUrl(encodeURI(props.audioUri))
    //         //     setPlayerState(!isPlay)
    //         // }
    //     } catch (e) {
    //         alert('Cannot play the file')
    //         console.log('cannot play the song file', e)
    //     }
    // }

    updateRelaxationCount = async () => {
        // user_data
        let userData = await retrieveData('user_data')
        console.log('get userData', userData)
        console.log('get userData ------', this.state.currentIndex)
        let body = new FormData()
        body.append("user_id", userData.id);
        body.append("relaxation_id", this.state.currentIndex.id);
        console.log('get body', body)
        API.postApi(API_RELAXATION_ACCESS, body, this.successRelaxCheckResponse, this.failureResponse);
    }
    successRelaxCheckResponse = (response) => {
        console.log('get relax response-------', response);
        this.setState({ loading: false, isFetching: false })
        if (SUCCESS_STATUS == response.status) {

        } else {
            // setTimeout(() => {
            //     Toast.show(response.data.message)
            // }, 100)
        }
    }
    failureResponse = (error) => {
        console.log('get error value', error.message);
        console.log('get error value', error.response);
        // this.setState({ loading: false })
    }
}

const styles = StyleSheet.create({})
