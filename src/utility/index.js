import React from 'react';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-community/async-storage";
import { ActionSheet } from 'native-base';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker'

/*
=============================================================
Using for Styling for responsive UI
@return screen percentageDisplay
*/
const wp = (value) => widthPercentageToDP(value);
const hp = (value) => heightPercentageToDP(value);
/*=============================================================*/

const emailValidation = (emailId) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(emailId) !== false) {
    return true;
  }
  return false;
}

const imageOptions = (response) => {
  const OPTIONS = ['Open Camera', 'Choose from gallery', 'Cancel'];
  return ActionSheet.show(
    {
      options: OPTIONS,
      cancelButtonIndex: 3,
      title: 'Upload photo',
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        openCamera(response);
      } else if (buttonIndex === 1) {
        openGallery(response);
      }
    },
  );
};

const openGallery = (response) => {
  const options = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 700,
    maxHeight: 700,
  };
  launchImageLibrary(options, async (image) => {
    await response(image);
  });
};

const openCamera = (response) => {
  const options = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 700,
    maxHeight: 700,
  };
  launchCamera(options, (image) => {
    response(image);
  });
};

const showCameraImagePicker = async (width, height, successPicker, cancelPicker) => {

  let obj = {
    width: width,
    height: height,
    cropping: true,
    compressImageMaxWidth: width,
    compressImageMaxHeight: height,
    compressImageQuality: 1.0,
    compressVideoPreset: 'MediumQuality',
    includeBase64: true,
    includeExif: true,
  }
  setTimeout(() => {
    ImagePicker.openCamera(obj).then((image) => {
      console.log("Utils Image : ", image);
      let imageData = {
        uri: image.path, width: image.width, height: image.height,
        name: "imgageName.jpeg",
        type: image.mime
      }
      if (image.path) {
        successPicker(image.path, imageData);
      }
    }).catch((response) => {
      console.log("Camera error : ", response)
      cancelPicker()
    });
  }, 300)
}

const showGalleryImagePicker = async (width, height, successPicker, cancelPicker) => {

  let obj = {
    width: width,
    height: height,
    cropping: true,
    freeStyleCropEnabled: true,
    compressImageMaxWidth: width,
    compressImageMaxHeight: height,
    compressImageQuality: 1.0,
    compressVideoPreset: 'MediumQuality',
    includeBase64: true,
    includeExif: true,
  }
  setTimeout(() => {
    ImagePicker.openPicker(obj).then((image) => {
      let imageData = {
        uri: image.path, width: image.width, height: image.height,
        // name: image.filename === undefined ? "image" : image.filename,
        name: "imgageName.jpeg",
        type: image.mime
      }
      console.log("check this ==> image data ==> abc ", image)
      // let base64 = `data:${image.mime};base64,`+ image.data;
      if (image.path) {
        successPicker(image.path, imageData);
      }
    }).catch((response) => {
      console.log("Gallery error : ", response)
      cancelPicker()
    });
  }, 300)
}

const pickMultipleImagePicker = async (maxChoose, successPicker, cancelPicker) => {

  let obj = {
    // width: width,
    // height: height,
    // cropping: true,
    // freeStyleCropEnabled: true,
    // compressImageMaxWidth: width,
    // compressImageMaxHeight: height,
    compressImageQuality: 0.60,
    // compressVideoPreset: 'MediumQuality',
    // includeBase64: true,
    // includeExif: true,
    mediaType: 'photo',
    maxFiles: 10,
    multiple: true

  }
  setTimeout(() => {
    ImagePicker.openPicker(obj).then((response) => {
      successPicker(response);
    }).catch((error) => {
      console.log("Gallery error : ", error)
      cancelPicker(error)
    });
  }, 300)
}


////
const storeData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    return true
  } catch (error) {
    return false
  }
}

const retrieveData = async (key) => {
  try {
    let data = await AsyncStorage.getItem(key);
    if (data !== null) {
      return JSON.parse(data)
    } else {
      return data
    }
  } catch (error) {
    return false
  }
}
const deleteData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true
  } catch (error) {
    return false
  }
}
const flushAllKeys = () => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiRemove(keys, (err) => {
      // keys removed, if they existed
      // do most stuff after removal (if you want)
    });
  });
}
const youtube_parser = (url) => {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match&&match[7].length==11)? match[7] : false;
}


export { wp, hp, emailValidation, imageOptions, openGallery, storeData, retrieveData, deleteData, flushAllKeys, showCameraImagePicker, showGalleryImagePicker, pickMultipleImagePicker, youtube_parser }