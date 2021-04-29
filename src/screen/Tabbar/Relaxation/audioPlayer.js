

import React, { useRef, useEffect, useState } from "react";
import {
    View,
    SafeAreaView,
    Text,
    Image,
    FlatList,
    ImageBackground,
    Dimensions,
    Animated,
    StyleSheet,
    DeviceEventEmitter,

} from "react-native";
import { bg_icon } from '../../../utility/ImageConstant'
import Header from '../../../component/Header'
import { wp, hp } from '../../../utility'
import { CLR_SECOND_PRIMARY, CLR_PLACEHOLDER, CLR_PRIMARY } from '../../../utility/Colors'
import { Content } from 'native-base'
const { width, height } = Dimensions.get("window");
import Player from '../../../component/PlayerController'
import { useFocusEffect } from "@react-navigation/native"
import Loader from '../../../component/Loader'
// import Player from '../../../component/AudioPlayer'

export default function AudioPlayer(props) {
    const scrollX = useRef(new Animated.Value(0)).current;
    const slider = useRef(null);
    const [songIndex, setSongIndex] = useState(0);
    // const [songIndexCopy, setSongIndexCopy] = useState(props.route.params.index);
    const [audioData, setAudioData] = useState([])
    const [isLoader, setLoaderUpdate] = useState(false)
    const [isShowDropDown, setShowDropDown] = useState(false)

    // const [imageScroll, setImageValue] = useState(false)


    // for tranlating the album art
    const position = useRef(Animated.divide(scrollX, width)).current;

    console.log('get image url', props)
    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = updateAudio
            return () => unsubscribe();
        }, [])
    );

    function updateAudio() {
        DeviceEventEmitter.emit('stopAudio')
        // alert(isShowDropDown)
        // if (isShowDropDown) {
            DeviceEventEmitter.emit('updateUser', { data: 'dropDown' })
        // }
    }

    useEffect(() => {
        // position.addListener(({ value }) => {
        //   console.log(value);
        // });
        // AppState.addEventListener('change', this._handleAppStateChange);
        const { data, index } = props.route.params
        setTimeout(() => {
            slider.current.scrollToOffset({
                offset: (index) * width,
            });
        }, 100);

        console.log('get navigataion data', data, index)
        // console.log('get navigataion data', props.navigation.route.params)

        setAudioData(data)
        setSongIndex(index)

        scrollX.addListener(({ value }) => {
            const val = Math.round(value / width);
            setSongIndex(val);
            // little buggy
            //if previous index is not same then only update it
        });

        return () => {
            scrollX.removeAllListeners();
        };
    }, []);

    const goNext = () => {
        slider.current.scrollToOffset({
            offset: (songIndex + 1) * width,
        });

    };
    const goPrv = () => {
        slider.current.scrollToOffset({
            offset: (songIndex - 1) * width,
        })
    }

    const goPlay = () => {

    }

    const renderItem = ({ index, item }) => {
        console.log('------', item.imageSource);

        return (
            <Animated.View
                style={{
                    alignItems: "center",
                    width: width,
                    transform: [
                        {
                            translateX: Animated.multiply(
                                Animated.add(position, -index),
                                -100
                            ),
                        },
                    ],
                }}
            >
                <Animated.Image
                    source={{ uri: item.file_path }}
                    style={{ width: wp(46), height: wp(46), borderRadius: wp(23), }}
                />
            </Animated.View>
        );
    };

    return (
        <View style={{ flex: 1, paddingTop  :  hp(13.3) }}>
            <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                <Content style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center', paddingTop: wp(7) }}>
                    <SafeAreaView style={styles.container}>
                        <SafeAreaView style={{ height: wp(50) }}>
                            <Animated.FlatList
                                ref={slider}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                scrollEventThrottle={16}
                                data={audioData}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                                    { useNativeDriver: true }
                                )}
                                onScrollEndDrag={async (res) => {
                                    let newValue = await scrollX
                                    const val = Math.round(newValue._value / width);
                                    // console.log('kkkkkkkkkkk', val)
                                    // console.log('kkkkkkkkkkk songIndexCopy', songIndexCopy)
                                    // if (val !== songIndexCopy) {

                                    //     songIndexCopy(val)
                                    // }

                                }}
                            />
                        </SafeAreaView>
                        {audioData.length > 0 &&
                            <View style={{}}>
                                <Text style={styles.title} numberOfLines={1} >{audioData[songIndex].relaxation_name}</Text>
                                {/* <Text style={styles.artist} numberOfLines={1} >{audioData[songIndex].relaxation_text}</Text> */}
                            </View>
                        }
                        {audioData.length > 0 &&
                            <Player
                                audioUri={audioData[songIndex].relaxation_audio}
                                audioTime={audioData[songIndex].audio_duration}
                                audioObj={audioData[songIndex]}
                                onPressNext={() => goNext()}
                                onPressPre={() => goPrv()}
                                OnPressPlay={() => goPlay()}
                            />
                        }
                        {/* <Controller onNext={goNext} onPrv={goPrv} /> */}
                    </SafeAreaView>

                    <View style={styles.middleViewContainer}>
                        <Text style={{ color: CLR_PRIMARY, fontWeight: '700', fontSize: wp(4.5), marginBottom: 10 }}>Description</Text>
                        <Text style={styles.artistDes}>{audioData.length > 0 ? audioData[songIndex].relaxation_text : ''}</Text>
                    </View>

                </Content>


            </ImageBackground>
            <View style = {{position: 'absolute'}}>
                <Header title={'Relaxation Audio'}
                    onPressAccount={() => props.navigation.navigate('Profile')}
                    onPressLogout={() => alert('hello')}
                    isBack={true}
                    hideSearch = {true}
                    onPressBack={() => props.navigation.goBack()}
                    onOpenDrop = {(res) => setShowDropDown(res)} 
                />
            </View>

        </View>
    );

    onBuffer = (item) => {
        console.log('-------', item)

    }
    onError = (error) => {
        console.log('-------', error)
    }





}

const styles = StyleSheet.create({
    title: {
        fontSize: wp(4.5),
        marginHorizontal: 13,
        textAlign: "center",
        textTransform: "capitalize",
        color: 'black'
    },
    titleDes: {
        fontSize: wp(5),
        textAlign: "center",
        textTransform: "capitalize",
        color: 'black'
    },
    artist: {
        fontSize: wp(4.2),
        textAlign: "center",
        marginHorizontal: 13,
        textTransform: "capitalize",
        color: CLR_PLACEHOLDER
    },
    artistDes: {
        fontSize: wp(4.3),
        textAlign: "center",
        textTransform: "capitalize",
        color: CLR_PLACEHOLDER
    },
    container: {
        justifyContent: "space-evenly",
        // height: height,
        // maxHeight: 500,
    },
    backgroundImageView: {
        width: '100%',
        height: '100%',
    },
    middleViewContainer: {
        // flex: 1,
        width: '90%',
        // height: hp(22),
        margin: wp(5),
        padding: wp(5),
        alignItems: 'center',
        shadowColor: '#000',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: wp(5),
        elevation: 5
    }
});