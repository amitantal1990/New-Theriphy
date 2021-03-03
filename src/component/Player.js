import React, { useState, useRef } from 'react';

// import all the components we are going to use
import { SafeAreaView, StyleSheet, Text, View , TouchableOpacity, Image} from 'react-native';
import { hp, wp } from '../utility'
//Import React Native Video to play video
import Video from 'react-native-video';
import { back_icon } from '../utility/ImageConstant'

//Media Controls to control Play/Pause/Seek and full screen
import
MediaControls, { PLAYER_STATES }
    from 'react-native-media-controls';
import { CLR_PRIMARY } from '../utility/Colors';

const Player = (props) => {
    const videoPlayer = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paused, setPaused] = useState(false);
    const [
        playerState, setPlayerState
    ] = useState(PLAYER_STATES.PLAYING);
    const [screenType, setScreenType] = useState('contain');

    const onSeek = (seek) => {
        //Handler for change in seekbar
        videoPlayer.current.seek(seek);
    };

    const onPaused = (playerState) => {
        //Handler for Video Pause
        setPaused(!paused);
        setPlayerState(playerState);
    };

    const onReplay = () => {
        //Handler for Replay
        setPlayerState(PLAYER_STATES.PLAYING);
        videoPlayer.current.seek(0);
    };

    const onProgress = (data) => {
        // Video Player will progress continue even if it ends
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            setCurrentTime(data.currentTime);
        }
    };

    const onLoad = (data) => {
        setDuration(data.duration);
        setIsLoading(false);
    };

    const onLoadStart = (data) => setIsLoading(true);

    const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

    const onError = () => alert('Oh! ', error);

    const exitFullScreen = () => {
        alert('Exit full screen');
    };

    const enterFullScreen = () => { };

    const onFullScreen = () => {
        setIsFullScreen(isFullScreen);
        if (screenType == 'contain') setScreenType('cover');
        else setScreenType('contain');
    }
    const renderToolbar = () => (
        <View>
            <Text style={styles.toolbar}> toolbar </Text>
        </View>
    )
    const onSeeking = (currentTime) => setCurrentTime(currentTime);
    return (
        <View style={styles.container }>
              <Video
                onEnd={onEnd}
                paused={paused}
                ref={videoPlayer}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                source={{uri: 'https://zaleyadocuments.s3.amazonaws.com/public_video/3247321705_20210113094418463.aac'}}
                style={styles.mediaPlayer}
                volume={10}
                onSeek ={onSeek}
            />
            {/* <Video
                onEnd={onEnd}
                onLoad={onLoad}
                onLoadStart={onLoadStart}
                onProgress={onProgress}
                paused={paused}
                ref={videoPlayer}
                resizeMode={screenType}
                onFullScreen={isFullScreen}
                source={{uri: props.videoUri}}
                style={styles.mediaPlayer}
                volume={10}
            /> */}
            <MediaControls
                duration={duration}
                isLoading={isLoading}
                mainColor= {CLR_PRIMARY}
                onFullScreen={onFullScreen}
                onPaused={onPaused}
                onReplay={onReplay}
                onSeek={onSeek}
                onSeeking={onSeeking}
                playerState={playerState}
                progress={currentTime}
                toolbar={renderToolbar()}
            /> 
            <TouchableOpacity style={styles.cancelContainerView}
                onPress={() => props.onPress()}>
                <Image source={back_icon} style={{ width: 30, height: 30, tintColor: 'white' }} />
            </TouchableOpacity>
        </View>
    );
};

export default Player;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: wp('100%'),
        marginLeft: wp(5),
        // backgroundColor: 'yellow'
    },
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    mediaPlayer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        transform: [{ rotate: '90deg' }],
    },
    cancelContainerView: {
        position: 'absolute',
        top: 60,
        width: 40, height: 40,
        right: 30, borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});