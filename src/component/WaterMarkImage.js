import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { wp, pickMultipleImagePicker } from '../utility'
import { CLR_PLACEHOLDER, CLR_PRIMARY } from '../utility/Colors'
import { water_icon } from '../utility/ImageConstant'
import ViewShot from 'react-native-view-shot';

export default function WaterMarkImage(props) {
    const [waterMark, setWaterMark] = useState('')
    const [selectedColor, setSelectedColor] = useState(['#EF2007', '#F28902', '#F5BD03', '#AC1320', '#A43D15', '#7ABB23', '#472C89', '#243A98', '#333333'])
    const [selectedIndex, setSelectedIndex] = useState(0)
    // const [image, setSource] = useState('')
    const viewShotRef = useRef();
    const onCapture = () => {
        viewShotRef.current.capture()
            .then((uri) => {
                props.onPressDone(uri)
                console.log('get image url', uri)
            })
    };
    return (
        <TouchableWithoutFeedback onPress={ Keyboard.dismiss } accessible={false}>
            <View style={styles.containerView}>
                <ViewShot
                    style={{ flex: 1, backgroundColor: selectedColor[selectedIndex], margin: 0 ,justifyContent: 'center'}}
                    ref={viewShotRef}
                >
                    <TextInput style={{ fontSize: wp(10), width: wp(86), marginHorizontal: wp(7), color: 'white' }}
                        placeholder={'Type a status'}
                        autoCapitalize={'sentences'}
                        multiline={true}
                        placeholderTextColor={CLR_PLACEHOLDER}
                        value={waterMark}
                        returnKeyType={"done"}
                        onChangeText={text => setWaterMark(text)}
                        onEndEditing={() => Keyboard.dismiss}
    
                    />
                </ViewShot>
                <View style={{ marginLeft: wp(5), width: wp(90), height: 80, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity style={{}}
                        onPress={() => setSelectedIndex(selectedColor.length - 1 > selectedIndex ? selectedIndex + 1 : 0)}>
                        <Image source={water_icon} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{}}
                            onPress={() => { Keyboard.dismiss, props.onPressCancel() }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp(4.3) }}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 10 }}
                            onPress={() => { Keyboard.dismiss, onCapture() }}>
                            <Text style={{ fontWeight: 'bold', fontSize: wp(4.3), color: CLR_PRIMARY }}>DONE</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'white',
    }
})
