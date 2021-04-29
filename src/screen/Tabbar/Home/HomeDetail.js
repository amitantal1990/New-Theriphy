import React, { Component } from 'react'
import { Text, NativeModules, StyleSheet, View, ImageBackground, FlatList, Image, Platform } from 'react-native'
import { Content } from 'native-base'
import Loader from '../../../component/Loader'
import Header from '../../../component/Header'
import { bg_icon, book_icon, calendar_icon, web_icon, doc_icon, video_icon, image_icon, pdf_icon, text_icon } from '../../../utility/ImageConstant'
import { hp, wp } from '../../../utility'
import { CLR_DARKGREY, CLR_PRIMARY, CLR_GRAY, CLR_LIGHT_LIGHT_GRAY } from '../../../utility/Colors'
import moment from 'moment'
import { WebView } from 'react-native-webview';
import FileViewer from 'react-native-file-viewer';
import AutoHeightWebView from 'react-native-autoheight-webview'


export default class HomeDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            heightData: 0,
            webUrl: ''
        }
    }

    render() {
        const { loading, heightData, webUrl } = this.state
        const { created_at, file_path, title, text_data, tags, file_type, icon_file_path } = this.props.route.params.data
        let WebViewRef;
        // console.log('get ------------', this.props.route.params.data)
        // console.log('get ------------', file_path)
        // console.log('get ------------', file_type)
        // file_type === ('jpg' || 'png' || 'jpeg') ? image_icon : file_type === 'links' ? web_icon : file_type === "docx" ? text_icon : file_type === "pdf" ? pdf_icon : doc_icon
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
        let fileUrl = ''
        if (file_type === "pdf") {
            fileUrl = 'https://docs.google.com/gview?embedded=true&url=' + file_path
        } else if (file_type === "txt") {
            fileUrl = file_path
        } else {
            fileUrl = 'https://view.officeapps.live.com/op/embed.aspx?src=' + file_path + '&embedded=true'
        }
        return (
            <View style={{ flex: 1, paddingTop: hp(13.3) }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Loader loading={loading} />
                    {(file_type === "docx" || file_type === "txt" || file_type === "xlsx" || file_type === "pdf") &&
                        <View style={{ ...styles.listContainer }}>
                            <View style={{ width: '100%', flexDirection: 'row', borderBottomColor: CLR_LIGHT_LIGHT_GRAY, borderBottomWidth: 1.0 }}>
                                <Image style={styles.topicImage} source={icon_file_path === '' ? images : { uri: icon_file_path }} />
                                <View style={{ marginTop: 10, color: CLR_DARKGREY }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text numberOfLines={1} style={{ width: wp('92') - 190, color: CLR_DARKGREY, fontSize: wp(4.5) }} >{title}</Text>
                                        <View style={{ flexDirection: 'row', width: 110 }}>
                                            <Image style={{ width: 15, height: 15, resizeMode: 'contain', backgroundColor: '#EBDEDE', tintColor: CLR_PRIMARY }} source={calendar_icon} />
                                            <Text style={{ color: CLR_PRIMARY }}> {moment(created_at).fromNow()}</Text>
                                            {/* <Text style={{ color: CLR_PRIMARY }}> {moment(updated_at).format('MM/DD/YYYY')}</Text> */}
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 1, marginBottom: 5, width: wp('88') - 60 }}>
                                        <Text style={{ color: CLR_DARKGREY, fontSize: wp(4.0) }} numberOfLines={2} >{tags}</Text>
                                    </View>
                                </View>
                            </View>
                            {/* {Platform.OS === 'ios' &&
                                <AutoHeightWebView
                                    style={{ width: '100%', height: heightData, marginTop: 8 }}
                                    onSizeUpdated={size => this.setState({ heightData: size.height })}
                                    files={[{
                                        href: 'cssfileaddress',
                                        type: 'text/css',
                                        rel: 'stylesheet'
                                    }]}
                                    source={{ uri: file_path }}
                                    scalesPageToFit={true}
                                    viewportContent={'width=device-width, user-scalable=no'}
                                />
                            } */}
                            {/* {Platform.OS === 'android' && */}
                            <WebView
                                ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
                                source={{ uri: fileUrl }}
                                style={{ width: wp(92), height: hp(100), marginTop: 10 }}
                                automaticallyAdjustContentInsets={false}
                                // onLoad={() => this.setState({ loading: false })}
                                onLoadEnd={(res) => loading ? this.setState({ loading: false }) : WebViewRef.reload()}

                                onLoadStart={() => this.setState({ loading: true })}
                                // contentMode={'mobile'}
                                // startInLoadingState={true}
                                // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                                // scalesPageToFit={false}
                            />
                            {/* } */}
                        </View>
                    }

                    {(file_type === "jpg" || file_type === "png" || file_type === "text" || file_type === "jpeg") &&
                        <Content style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }} bounces={false}>
                            <View style={styles.listContainer}>
                                <View style={{ width: '100%', flexDirection: 'row', borderBottomColor: CLR_LIGHT_LIGHT_GRAY, borderBottomWidth: 1.0 }}>
                                    {/* <View style={{ flexDirection: 'row' }}> */}
                                 <Image style={styles.topicImage} source={icon_file_path === '' ? images : { uri: icon_file_path }} />
                                    <View style={{ marginTop: 10, color: CLR_DARKGREY }}>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text numberOfLines={1} style={{ width: wp('92') - 190, color: CLR_DARKGREY, fontSize: wp(4.5) }} >{title}</Text>
                                            <View style={{ flexDirection: 'row', width: 110 }}>
                                                <Image style={{ width: 15, height: 15, resizeMode: 'contain', backgroundColor: '#EBDEDE', tintColor: CLR_PRIMARY }} source={calendar_icon} />
                                                <Text style={{ color: CLR_PRIMARY }}> {moment(created_at).fromNow()}</Text>
                                                {/* <Text style={{ color: CLR_PRIMARY }}> {moment(updated_at).format('MM/DD/YYYY')}</Text> */}
                                            </View>
                                        </View>
                                        <View style={{ marginTop: 1, marginBottom: 5, width: wp('88') - 60 }}>
                                            <Text style={{ color: CLR_DARKGREY, fontSize: wp(4.0) }} numberOfLines={2} >{tags}</Text>
                                        </View>
                                    </View>
                                    {/* </View> */}

                                </View>
                                <View style={{ padding: 10 }}>
                                    {(file_type === "jpg" || file_type === "png") &&
                                        <Image style={styles.imageFile} source={{ uri: file_path }} />
                                    }
                                    {file_type === "text" &&
                                        <Text>{text_data}</Text>
                                    }


                                </View>

                            </View>
                        </Content>
                    }

                    {/* <WebView
                    // source={{ uri: 'https://view.officeapps.live.com/op/embed.aspx?src=https://www.theriphy.com/public/therapist/2/xlsx/1612943970xlsx/Financial%20Sample.xlsx&embedded=true'}}
                    source={{ uri: 'http://docs.google.com/gview?embedded=true&url=https://www.theriphy.com/public/therapist/2/xlsx/1612943970xlsx/Financial%20Sample.xlsx' }}
                    // source={{ uri: 'https://view.officeapps.live.com/op/embed.aspx?src=' + file_path + '&embedded=true' }}
                    style={{ width: wp(88), height: hp(100) }}
                    automaticallyAdjustContentInsets={false}
                    onLoad={() => this.setState({ loading: false })}
                    onLoadStart={() => this.setState({ loading: true })}
                    contentMode={'mobile'}
                    // startInLoadingState={true}
                    // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
                    scalesPageToFit={false}
                /> */}
                </ImageBackground>
                <View style={{ position: 'absolute' }}>
                    <Header title={'Home Detail'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        isBack={true}
                        hideSearch = {true}
                        onPressBack={() => this.props.navigation.goBack()}
                    />
                </View>
            </View>
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
        width: '94%',
        margin: '4%',
        alignSelf: 'center',
        padding: '1%',
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
        marginTop: 10,
        marginBottom: 8,
        marginLeft: 5,
        marginRight: 10
    },
    imageFile: {
        width: '100%',
        height: hp(61),
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


