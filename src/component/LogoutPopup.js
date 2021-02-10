import React from 'react'
import { View, Text, TouchableOpacity, } from 'react-native'
import { CLR_PRIMARY } from '../utility/Colors'

export default function LogoutPopup(props) {
    return (
        <TouchableOpacity style={{ flex: 1, justifyContent: "center" }}
        onPress={() => props.onPressCancel()}
        >
            <View style={{
                width: '100%', backgroundColor: 'white', justifyContent: 'center',
                alignItems: 'center', borderRadius: 4, marginTop: 12
            }}>
                <Text style={{ 
                    color: 'black', fontSize: 20, margin: 16, marginTop: 24, marginBottom: 24, textAlign: 'center'
                }}>{props.title}</Text>

                <View style={{
                    backgroundColor: 'white', width: "100%", height: 44, justifyContent: 'space-evenly',
                    borderTopLeftRadius: 6, borderTopRightRadius: 6, flexDirection: 'row', marginBottom: 12
                }}>
                    <TouchableOpacity style={{
                        height: '100%', width: '45%', backgroundColor: '#B0B0B0', alignItems: 'center',
                        borderRadius: 4, justifyContent: 'center'
                    }}
                        onPress={() => props.onPressCancel()}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>{props.cancelTitle}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        height: '100%', width: '45%', backgroundColor: CLR_PRIMARY, alignItems: 'center',
                        borderRadius: 4, justifyContent: 'center'
                    }}
                        onPress={() => props.onPress()}>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>{props.buttonTitle}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}
