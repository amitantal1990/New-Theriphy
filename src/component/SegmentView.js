import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import SegmentedControl from '@react-native-community/segmented-control';

export default function SegmentView() {
    return (
        <View>
            <SegmentedControl
                values={['One', 'Two']}
                selectedIndex={0}
                onChange={(event) => {
                    this.setState({ selectedIndex: event.nativeEvent.selectedSegmentIndex });
                }}
            />

        </View>
    )
}

const styles = StyleSheet.create({})
