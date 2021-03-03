import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import { CLR_GRAY, CLR_LIGHT_GRAY, CLR_DARKGREY, CLR_PLACEHOLDER, CLR_SECOND_PRIMARY } from '../utility/Colors'
import { wp, hp } from '../utility'

export default function ProfileInput(props) {
    const [inputValue, updateInputData] = useState(props.value)
    let viewHeight = 40 + 26 + hp(4)
    return (
        <View style={{ width: '100%', borderBottomColor: 'black', borderBottomWidth: 1.5, height: viewHeight }}>
            <Text style={{ fontSize: wp(4.5), height: 26, color: CLR_PLACEHOLDER, marginTop: hp(4) }}>{props.inputTitle}</Text>
            <View style={{ flexDirection: 'row', height: 40, width: '100%' }}>
                {!props.isButton &&
                    <TextInput 
                        {...props}
                        style={{ height: 42, fontSize: wp(4.3), width: props.inputTitle !== 'Email Address' ? wp(80) - 40 : wp(80), color: 'black'}}
                        placeholderTextColor = {CLR_PLACEHOLDER}
                        // placeholder={props.placeholder}
                        // editable = {props.inputTitle !== 'Email Address' ? true : false}
                        // value={inputValue}
                        // onChangeText={text => updateInputData(text)}
                    />
                }
                {props.isButton &&
                    <TouchableOpacity style={{ height: 40, width: wp(80) - 40, justifyContent: 'center' }}
                        onPress={() => props.onPress()} >
                        <Text style={{ fontSize: wp(4.3), color: props.value === '' ? CLR_GRAY : 'black' }}>{props.value === '' ? props.placeholder : props.value}</Text>
                    </TouchableOpacity>
                }
                {props.inputTitle !== 'Email Address' &&
                    <View style={{ width: 40, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Image {...props} style={{ width: '40%', height: '40%', resizeMode: 'contain', alignSelf: 'flex-end', tintColor: CLR_SECOND_PRIMARY }} />
                    </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})
