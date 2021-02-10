import React, { Component } from 'react'
import { Text, StyleSheet, View, ImageBackground, FlatList } from 'react-native'
import Header from '../../../component/Header'
import { bg_icon } from '../../../utility/ImageConstant'
import Loader from '../../../component/Loader'
import Toast from 'react-native-simple-toast';
import API from '../../../utility/API';
import { wp, hp, } from '../../../utility'
import { SUCCESS_STATUS, API_GET_RELAXATION_DATA } from '../../../utility/APIConstant'
import { Content } from 'native-base';

export default class Reading extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            readingList: ['Book Title', 'Book Title', 'Book Title', 'Book Title', 'Book Title', 'Book Title', 'Book Title', 'Book Title']
        }
    }
    componentDidMount() {
        // this.getReadingData()
    }
    render() {
        const { readingList, loading } = this.state
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground source={bg_icon} style={styles.backgroundImageView}>
                    <Header title={'Reading'}
                        onPressAccount={() => this.props.navigation.navigate('Profile')}
                        onPressLogout={() => alert('hello')} />
                    <Loader loading={loading} />
                    <Content style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
                        <FlatList
                            style={{}}
                            bounces={false}
                            numColumns={2}
                            data={readingList}
                            renderItem={this.renderReadingItem}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </Content>
                </ImageBackground>
            </View>
        )
    }

    renderReadingItem = (item) => {
        console.log('get item value', item);
        
        return (
            <View style={{ width: wp(50), height: wp(44) + 45, padding: wp(4) }}>
                <View style = {styles.renderContainer}>

                </View>
                <Text style = {{alignSelf: 'center', marginTop: 8}}>{item.item}</Text>
            </View>
        )
    }
    getReadingData = () => {
        this.setState({ loading: true })
        API.getApi(API_GET_RELAXATION_DATA, this.successRelaxResponse, this.failureResponse);
    }
    successRelaxResponse = (response) => {
        console.log('get relax response-------', response);
        this.setState({ loading: false })
        if (SUCCESS_STATUS == response.status) {
            console.log('get response-----', response.data.relaxations)
            this.setState({ relaxationList: response.data.relaxations })
            console.log('getting', this.state.relaxationList);
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
    renderContainer: {
        backgroundColor: 'white', 
        width: '100%', 
        height: wp(44), 
        borderRadius: 10,
        shadowColor: '#000',
        backgroundColor: 'white',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: wp(5),
        elevation: 5
    }

})
