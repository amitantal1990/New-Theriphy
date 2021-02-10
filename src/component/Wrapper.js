import React from 'react';
import {
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ViewPropTypes,
  ScrollView
} from 'react-native';
import propTypes from 'prop-types';

const Wrapper = (props) => {
  return (
    <View style={{flex: 1, ...props.containerStyle}}>
      <StatusBar {...props.statusBarStyle} />
      <ImageBackground source={props.bgImage} style={styles.bgImage}>
        <ScrollView
          style={{flex: 1}}
          scrollEnabled={props.scrolling}
          contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
          showsVerticalScrollIndicator={false}>
          {props.children}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

Wrapper.propTypes = {
  statusBarStyle: StatusBar.propTypes,
  containerStyle: ViewPropTypes.style,
  SafeAreaStyle: SafeAreaView.style,
  defaultProps: propTypes.func,
  bgImage: propTypes.string,
};

Wrapper.defaultProps = {
  defaultProps: false,
};

const styles = StyleSheet.create({
  bgImage: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
});

export default Wrapper;
