import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import SoundPlayer from 'react-native-sound-player'
import Slider from '@react-native-community/slider';
import { wp } from '../utility';
import { back_audio, next_icon, play_icon } from '../utility/ImageConstant'
import { CLR_SECOND_PRIMARY } from '../utility/Colors';


export default function AudioPlayer(props) {
    const [isPlay, setPlayerState] = useState(false)
    const [isInitialize, setInitalState] = useState(false)
    const [sliderValue, setSliderValue] = useState(0)
    const [changeValue, setNewValue] = useState(0)
    const [audioDuration, setAudioDuration] = useState(1)
    console.log('get params--------', props);
    let timeInterval = '';

    useEffect(() => {
        const _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            console.log('finished playing', success)
            setInitalState(false)
            clearInterval(timeInterval)
        })
        const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
            console.log('finished loading', success)
        })
        const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', async ({ success, url }) => {
            console.log('finished loading url', success, url)
            const info = await SoundPlayer.getInfo()
            const min = Math.floor(info.duration / 60); //minutes
            const sec = info.duration % 60; //seconds

            console.log('getInfo', min)
            console.log('getInfo', info)
            timeInterval = setInterval(() => {
                console.log('get slider value', sliderValue);
                const update = sliderValue + 1;
                console.log('get slider updated value', update)
                console.log('get cahnge value', changeValue)
                setSliderValue(update)
                setNewValue(changeValue + 2)
            }, 100);
        })
        return () => {
            _onFinishedPlayingSubscription.remove()
            _onFinishedLoadingSubscription.remove()
            _onFinishedLoadingURLSubscription.remove()
        }
    }, []);

    const playingStartAudio = async () => {

        try {
            // console.log('getInfo', SoundPlayer.getInfo())
            // const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
            console.log('getInfo', sliderValue, 'player', SoundPlayer, 'hh', isInitialize)
            if (isInitialize) {
                isPlay ? SoundPlayer.pause() : SoundPlayer.play()
                setPlayerState(!isPlay)
            } else {
                SoundPlayer.playUrl(encodeURI(props.audioUri))
                setPlayerState(!isPlay)
                setInitalState(true)
            }

            // if (SoundPlayer !== null) {
            //     // SoundPlayer.playUrl('https://www.theriphy.com/public/images/admin/Chithiyaan%20%20Official%20Remix%20-(Mr-Jatt.com).mp3')
            //     SoundPlayer.playUrl(encodeURI(props.audioUri))
            //     setPlayerState(!isPlay)
            // }
        } catch (e) {
            alert('Cannot play the file')
            console.log('cannot play the song file', e)
        }
    }

    const playingPreAudio = () => {

    }
    const updateAudioTime = (value) => {
        console.log('get timer value', value);
        // setSliderValue(value)
        // SoundPlayer.seek(value)
    }
    const onNxtPress = () => {
        setInitalState(false)
        props.onPressNext()
    }
    const onPrePress = () => {
        setInitalState(false)
        props.onPressPre()
    }

    return (
        <View style={{ width: wp(100), alignItems: 'center', }}>
            <Slider
                style={{ width: '90%', height: 40 }}
                minimumValue={0}
                maximumValue={audioDuration}
                value={sliderValue}
                onValueChange={value => updateAudioTime(value)}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '50%', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => onPrePress()}>
                    <Image source={back_audio} style={{ width: wp(5), height: wp(5), resizeMode: 'contain' }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => playingStartAudio()}>
                    <Image source={play_icon} style={{ width: wp(12), height: wp(12), resizeMode: 'contain', tintColor: CLR_SECOND_PRIMARY }} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => onNxtPress()}>
                    <Image source={next_icon} style={{ width: wp(5), height: wp(5), resizeMode: 'contain' }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
