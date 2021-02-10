import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground } from 'react-native'
import Wrapper from '../../../component/Wrapper'
import Header from '../../../component/Header'
import { bg_icon } from '../../../utility/ImageConstant';
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, } from '../../../utility'
import { SUCCESS_STATUS, API_GET_RELAXATION_DATA } from '../../../utility/APIConstant'
import { Content } from 'native-base';

export default class Rogue extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            rogueList: []
        }
    }
    componentDidMount() {
        this.getGoRogueData()
    }

    render() {
        console.log('get image value---', this.props.navigation);
        return (
            <View style = {{flex: 1}}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Go Rogue'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')}
                    />
                </ImageBackground>
            </View>
        )
    }
    getGoRogueData = () => {
        this.setState({ loading: true })
        API.getApi(API_GET_RELAXATION_DATA, this.successRogueResponse, this.failureResponse);
    }
    successRogueResponse = (response) => {
        console.log('get rogue response-------', response);
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
