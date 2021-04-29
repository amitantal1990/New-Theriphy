// import React from 'react'
// import { StyleSheet, Text, View } from 'react-native'
// import YouTube from 'react-native-youtube';
// import { wp, hp, } from '../utility'

// export default function YoutubePlayer(props) {
//     return (
//         <View>
//             <YouTube
//                 videoId = {props.videoId} // The YouTube video ID
//                 apiKey="AIzaSyAhrYkV18kwp6M43GcjVWD1QpXqHItUIr4"
//                 origin={"https://www.youtube.com"}
//                 play
//                 controls={1}
//                 fullscreen
//                 // play // control playback of video with true/false
//                 // fullscreen // control whether the video should play in fullscreen or inline
//                 // loop // control whether the video should loop when ended
//                 // onReady={e => this.setState({ isReady: true })}
//                 // onChangeState={e => this.setState({ status: e.state })}
//                 // onChangeQuality={e => this.setState({ quality: e.quality })}
//                 // onError={e => this.setState({ error: e.error })}
//                 style={{ height: hp(33), width: wp(92), marginLeft: wp(4),borderRadius:10 }}
//             />
//         </View>
//     )

// }

// const styles = StyleSheet.create({})

import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Youtube from 'react-native-youtube-iframe';
import { wp, hp, } from '../utility'

export default function YoutubePlayer(props) {
    return (
        <View style = {{marginLeft: wp(4), width: wp(90), backgroundColor: '#00000060', borderRadius: 10, overflow: 'hidden'}}>
            <Youtube
                height={wp(50.4)}
                width = {wp(90)}
                play={true}
                videoId={props.videoId}
                onError = {(e) => console.log('get error',e)}
                onChangeState={(e) => console.log(e)}
            />
        </View>
    )
}

const styles = StyleSheet.create({})
