import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, FlatList, TouchableOpacity, Image } from 'react-native'
import Wrapper from '../../../component/Wrapper'
import Header from '../../../component/Header'
import { bg_icon, play_icon } from '../../../utility/ImageConstant'
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, } from '../../../utility'
import { SUCCESS_STATUS, API_GET_RELAXATION_DATA } from '../../../utility/APIConstant'
import { Content } from 'native-base';
import SegmentedControl from '@react-native-community/segmented-control'
import { CLR_PRIMARY, CLR_SECOND_PRIMARY } from '../../../utility/Colors'
// import Segment from '../../../component/SegmentView'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            homeList: ['One', 'Two'],
            selectedIndex: 0
        }
    }
    componentDidMount() {
        // this.getHomeWorkData()
    }
    render() {

        const { selectedIndex, homeList } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Homework'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                    />
                    <SegmentedControl
                        style={{ height: wp(14), marginHorizontal: wp(4), marginTop: wp(6) }}
                        values={['Current', 'History']}
                        containerStyle={{ marginVertical: 20 }}
                        selectedIndex={selectedIndex}
                        activeFontStyle={{ color: 'white', fontSize: wp(4.4) }}
                        // backgroundColor= '#ffff'
                        appearance='light'
                        // appearance="dark"
                        tintColor={CLR_PRIMARY}
                        onChange={(event) => {
                            this.setState({ selectedIndex: event.nativeEvent.selectedSegmentIndex });
                        }}
                    />
                    <Content>
                        <FlatList
                            style={{ marginTop: wp(2), alignSelf: 'center' }}
                            data={homeList}
                            renderItem={this.renderHomeItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </Content>

                </ImageBackground>
            </View>
        )
    }

    renderHomeItem = (item) => {
        return (
            <TouchableOpacity style={{ width: wp(94), height: wp(20), marginTop: wp(3), borderRadius: wp(3), overflow: 'hidden' }}
                // onPress={() => this.props.navigation.navigate('AudioPlayer', { data: this.state.relaxationList, index: item.index })}
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
    getHomeWorkData = () => {
        this.setState({ loading: true })
        API.getApi(API_GET_RELAXATION_DATA, this.successHomeWorkResponse, this.failureResponse);
    }
    successHomeWorkResponse = (response) => {
        console.log('get Home response-------', response);
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


