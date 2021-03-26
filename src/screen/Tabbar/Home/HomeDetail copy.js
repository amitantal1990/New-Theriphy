import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, FlatList, Image, Platform } from 'react-native'
import { Content } from 'native-base'
import Loader from '../../../component/Loader'
import Header from '../../../component/Header'
import { bg_icon, book_icon, calendar_icon, web_icon, doc_icon, video_icon, image_icon } from '../../../utility/ImageConstant'
import { hp, wp } from '../../../utility'
import { CLR_DARKGREY, CLR_PRIMARY, CLR_GRAY } from '../../../utility/Colors'
import moment from 'moment'
import { WebView } from 'react-native-webview';
import FileViewer from 'react-native-file-viewer';
import AutoHeightWebView from 'react-native-autoheight-webview'


export default class HomeDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false
        }
    }

    render() {
        const { loading } = this.state
        const { updated_at, file_path, title, text_data, tags, file_type } = this.props.route.params.data
        console.log('get ------------', this.props.route.params.data)
        console.log('get ------------', file_path)
        return (
            <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                <Header title={'Home Detail'}
                    onPressAccount={() => this.props.navigation.navigate('Profile')}
                    onPressLogout={() => alert('hello')}
                    isBack={true}
                    hideSearch = {true}
                    onPressBack={() => this.props.navigation.goBack()}
                />

                <Loader loading={loading} />

                <Content style={{ flex: 1, marginTop: - hp(6.5) }} contentContainerStyle={{ alignItems: 'center' }} bounces={false}>
                    <View style={styles.listContainer}>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <Image style={styles.topicImage} source={file_type === ('jpg' || 'png' || 'jpeg') ? image_icon : file_type === 'links' ? web_icon : doc_icon} />
                            <View style={{ flexDirection: 'row', marginTop: 15, alignItems: 'center', color: CLR_DARKGREY }}>
                                <Text numberOfLines={1} style={{ width: wp('88') - 140, color: CLR_DARKGREY, fontSize: wp(4.5) }} >{title}</Text>
                                <View style={{ flexDirection: 'row', width: 60 }}>
                                    <Image style={{ width: 15, height: 15, resizeMode: 'contain', backgroundColor: '#EBDEDE', tintColor: CLR_PRIMARY }} source={calendar_icon} />
                                    <Text style={{ color: CLR_PRIMARY }}> {moment(updated_at).format('DD MMM')}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            {(file_type === "jpg" || file_type === "png") &&
                                <Image style={styles.imageFile} source={{ uri: file_path }} />
                            }
                            {file_type === "text" &&
                                <Text>{text_data}</Text>
                            }
                            {Platform.OS !== 'ios' && (file_type === "docx" || file_type === "txt" || file_type === "xlsx" || file_type === "pdf") &&
                                <WebView
                                    source={{ uri: 'http://docs.google.com/gview?embedded=true&url=' + file_path + '&embedded=true' }}
                                    style={{ width: wp(88), height: hp(70) }}
                                    automaticallyAdjustContentInsets={false}
                                    contentMode={'mobile'}
                                    startInLoadingState={true}
                                    injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                                    scalesPageToFit={false}
                                />
                            }
                            {Platform.OS === 'ios' && (file_type === "docx" || file_type === "txt" || file_type === "xlsx" || file_type === "pdf") &&

                                <AutoHeightWebView
                                    style={{ width: wp(88) }}
                                    onSizeUpdated={size => console.log(size.height)}
                                    files={[{
                                        href: 'cssfileaddress',
                                        type: 'text/css',
                                        rel: 'stylesheet'
                                    }]}
                                    source={{ uri: 'http://docs.google.com/gview?embedded=true&url=' + file_path }}
                                    scalesPageToFit={true}
                                    viewportContent={'width=device-width, user-scalable=no'}
                                /*
                                other react-native-webview props
                                */
                                />

                            }

                        </View>
                        <View style={{ marginTop: 10, marginBottom: 15 }}>
                            <Text style={{ color: CLR_DARKGREY, fontSize: wp(4.2) }}>{tags}</Text>
                        </View>
                    </View>
                </Content>
            </ImageBackground>
        )
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
        margin: '4%',
        alignSelf: 'center',
        padding: '3%',
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
        backgroundColor: 'pink',
        borderRadius: 30,
        marginTop: 10,
        marginRight: 10
    },
    imageFile: {
        width: '100%',
        height: wp(88),
        resizeMode: 'contain'
    },
    multipleContainerView: {
        marginTop: 10,
        width: '100%',
        height: wp(88)
        // minHeight: 30,
        // maxHeight: hp(70)
    }
})


