import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, Image, TouchableOpacity } from 'react-native'
import { bg_icon, backword_icon, forword_icon } from '../../../utility/ImageConstant'
import Header from '../../../component/Header'
import { wp, hp } from '../../../utility'
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { CLR_LIGHT_LIGHT_GRAY } from '../../../utility/Colors'

export default class ImageDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            motivationImageList: this.props.route.params.data,
            isUploadImage: false,
            select_index: this.props.route.params.selectedIndex
        }
    }

    componentDidMount() {
        console.log('get image value---', this.props.route.params.data);
        console.log('get image value---', this.props.route.params);
    }

    _renderItem = ({ item, index }) => {
        console.log('get image value', item)
        return (
            <View style={{ width: wp('100'), height: hp(76) }}>
                <Image source={{ uri: 'https://www.theriphy.com/public/' + item.file_path + item.file_name, }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
            </View>
        );
    }

    forworImage = () => {
        const { select_index, motivationImageList } = this.state
        if (motivationImageList.length > select_index + 1) {
            this.setState({ select_index: select_index + 1 })
        }
    }

    backwordImage = () => {
        const { select_index, motivationImageList } = this.state
        if (select_index > 0) {
            this.setState({ select_index: select_index - 1 })
        }
    }

    render() {
        const { motivationImageList, select_index } = this.state
        console.log('get ------', select_index)
        return (
            <View style={{ flex: 1, paddingTop: hp(14) }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Carousel
                        ref={(c) => { this._carousel = c; }}
                        data={motivationImageList}
                        renderItem={this._renderItem}
                        sliderWidth={wp(100)}
                        itemWidth={wp(100)}
                        onSnapToItem={slideIndex => this.setState({ select_index: slideIndex })}
                        // autoplay={true}
                        // activeSlideOffset = {wp(100)*(select_index)}
                        firstItem={select_index}
                    // autoplayDelay={500}
                    //  autoplayInterval={3000}
                    />
                    <TouchableOpacity style={{ position: 'absolute', top: hp(36) - 30, right: 10, width: 60, height: 60 }}
                        onPress={() => this.forworImage()}
                    >
                        <Image source={forword_icon} style={{ width: '100%', height: '100%', tintColor: 'white' }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: 'absolute', top: hp(36) - 25, left: 10, width: 60, height: 60 }}
                        onPress={() => this.backwordImage()}
                    >
                        <Image source={backword_icon} style={{ width: '100%', height: '100%', tintColor: 'white' }} />
                    </TouchableOpacity>

                </ImageBackground>
                <View style={{ position: 'absolute' }}>
                    <Header title={'Album Detail'}
                        onPressAccount={() => props.navigation.navigate('Profile')}
                        isBack={true}
                        hideSearch={true}
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
})
