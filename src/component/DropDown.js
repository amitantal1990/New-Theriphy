import React, { useState } from 'react'
import { StyleSheet, Text, View, Animated } from 'react-native'
import { CLR_PRIMARY, CLR_BLACK } from '../../../../receiptmate_mobileapp/src/common/Colors'
import { search_icon } from '../utility/ImageConstant';

export default function DropDown() {

    const [animation, setstate] = useState(new Animated.Value(0))

    const startAnimation = () => {
        Animated.timing(animation, {
            toValue: 90,
            duration: 500,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 500,
                }).start(() => { });
            }, 1000);
        });
    }
    const transformStyle = {
        transform: [
            {
                translateY: animation,
            },
        ],
    };
    return (
        <Animated.View style={[styles.animatedBox, transformStyle]}>
            <Image
                style={{
                    tintColor: CLR_PRIMARY,
                    width: 30,
                    height: 30,
                    marginLeft: 13,
                    marginRight: 10,
                }}
                source={search_icon}
            />
            <Text style={{ color: CLR_BLACK }}>
                Loyalty card added!
        </Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({

    animatedBox: {
        flexDirection: "row",
        position: "absolute",
        alignItems: "center",
        width: wp("90%"),
        marginTop: -56,
        height: 56,
        marginHorizontal: wp("5%"),
        backgroundColor: "#ffffff",
        borderRadius: 12,
        shadowColor: CLR_BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 15,
    },
})
