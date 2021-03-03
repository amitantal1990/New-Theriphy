import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";

export default function Controller({ onNext, onPrv }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrv}>
        <Text>Pre</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Pause</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext}>
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});