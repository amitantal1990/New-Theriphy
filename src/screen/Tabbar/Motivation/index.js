import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, TouchableOpacity, Image } from 'react-native'
import Header from '../../../component/Header'
import { bg_icon, gallery_icon } from '../../../utility/ImageConstant';
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, } from '../../../utility'
import { SUCCESS_STATUS, API_GET_RELAXATION_DATA } from '../../../utility/APIConstant'
import { Content } from 'native-base';
import MasonryList from "react-native-masonry-list";
import { CLR_PRIMARY } from '../../../utility/Colors';

export default class Motivation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            motivationList: []
        }
    }
    componentDidMount() {
        // this.getMotivationalData()
    }
    render() {
        var data = [["", "Big Data", "Hadoop", "Spark", "Hive"], ["Data Science", "Python", "Ruby"]];
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Motivation'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                        searchBtnAction={(text) => console.log('get image')}
                    />
                    <View style={{ width: wp(100), height: 44, justifyContent: 'center', alignItems: 'center', marginTop: wp(1.5) }}>
                        <TouchableOpacity>
                            <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.2) }}>Photo</Text>
                        </TouchableOpacity>
                    </View>

                    <MasonryList
                        images={[

                            { uri: "https://luehangs.site/pic-chat-app-images/beautiful-blond-blonde-hair-478544.jpg" },
                            { source: { uri: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-women-beauty-40901.jpg" } },
                            {
                                uri: "https://luehangs.site/pic-chat-app-images/animals-avian-beach-760984.jpg",
                                dimensions: { width: 1080, height: 1920 }
                            },
                            {
                                URI: "https://luehangs.site/pic-chat-app-images/beautiful-blond-fishnet-stockings-48134.jpg",
                                id: "blpccx4cn"
                            },
                            { url: "https://luehangs.site/pic-chat-app-images/beautiful-beautiful-woman-beauty-9763.jpg" },
                            { URL: "https://luehangs.site/pic-chat-app-images/attractive-balance-beautiful-186263.jpg" },
                        ]}
                        // Version *2.14.0 update
                        // onEndReached={() => {
                        //     // add more images when scrolls reaches end
                        // }}
                        backgroundColor={'transparent'}
                        columns={2}
                        listContainerStyle={{ width: wp('100%'), alignSelf: 'center', paddingLeft: wp('2%') }}
                        //  onPressImage = {(item, index) => this.props.navigateToPostDetail(item, index)}  
                        // onPressImage = {(item, index) => this.getTappedImage(item, index)}  
                        imageContainerStyle={{ width: wp('46%'), margin: wp('1%'), borderRadius: 10, }}
                    />
                    <View style={{ width: wp(100), height: 60, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style = {{flexDirection: 'row'}}>
                            <Text style={{ color: CLR_PRIMARY,fontSize: wp(4.2) }}>Upload Images</Text>
                            <Image style={{ width: 20, height: 20, tintColor: CLR_PRIMARY, marginLeft: 10 }} source={gallery_icon} />
                        </TouchableOpacity>
                    </View>

                </ImageBackground>
            </View>
        )
    }
    getMotivationalData = () => {
        this.setState({ loading: true })
        API.getApi(API_GET_RELAXATION_DATA, this.successMotivationalResponse, this.failureResponse);
    }
    successMotivationalResponse = (response) => {
        console.log('get Motivation response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {


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
})
