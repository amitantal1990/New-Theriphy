import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { CLR_PLACEHOLDER } from "../utility/Colors";

const ActionSheet = (props) => {
  const callrender = (item) => {
    return (
      <TouchableOpacity
        style={{
          height: item.index == 0 ? wp(15) : wp(14),
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          borderTopColor: CLR_PLACEHOLDER,
          borderTopWidth: item.index == 0 ? 0 : 1.2,
        }}
        onPress={() => props.callRenderMethod(item.item.title)}
      >
        <Text style={{ color: item.item.color, fontSize: wp("4.5%") }}>
          {item.item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
      <FlatList
        style={{ backgroundColor: "white", borderRadius: 12 }}
        bounces={false}
        data={props.sheetArray}
        keyExtractor={(item, index) => index.toString()}
        renderItem={callrender}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          marginTop: 12,
          height: wp(15),
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => props.onPressCancel()}
      >
        <Text style={{ fontSize: wp("5%"), color: 'Red' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionSheet;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
