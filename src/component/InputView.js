import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Image } from 'react-native'
import { CLR_GRAY, CLR_LIGHT_GRAY } from '../utility/Colors'
import { wp, hp } from '../utility'

export default function InputView(props) {

    const [imageWidth, setImageWidth] = useState('13%')
    return (
        <View style={{ ...props.style, borderColor: CLR_LIGHT_GRAY, borderWidth: 1.5 , flexDirection: 'row', marginTop: 10}}>
            <View style = {{width: imageWidth, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Image {...props} style={{ width: '50%', height: '50%', resizeMode: 'contain'}} />
            </View>
            <TextInput {...props} style = {{height: '100%', fontSize: wp(4.3), width: '86%' }} />
        </View>
    )
}

const styles = StyleSheet.create({})
