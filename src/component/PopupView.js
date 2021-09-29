import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput } from 'react-native'
import { wp, pickMultipleImagePicker, hp } from '../utility'
import { cat_drop_down, gallery_icon, delete_icon } from '../utility/ImageConstant'
import { CLR_PLACEHOLDER, CLR_PRIMARY, CLR_LIGHT_LIGHT_GRAY, CLR_LIGHT_GRAY } from '../utility/Colors'
import ModalDropdown from 'react-native-modal-dropdown'
import WaterMark from './WaterMarkImage'
import Modal from 'react-native-modal'
import Toast from 'react-native-simple-toast'

export default function PopupView(props) {
    const [category, setCategory] = useState('')
    const [imageObj, setImageObj] = useState([])
    const [isCustomImage, updateCustomImage] = useState(false)
    const [customUpload, setCustomUpload] = useState(0)

    console.log('get props Button --------', props);
    const cancelButton = (response) => {
        console.log('get cancel Button --------', response);
    }
    const getImageList = (response) => {
        let imgObj = []
        response.map((item, index) => {
            let imageData = {
                uri: item.path,
                width: item.width / 4,
                height: item.height / 4,
                name: (new Date().getTime()).toString() + ".jpg",
                type: "image/jpeg"
            }
            imgObj.push(imageData)
        })
        setImageObj(imgObj)
        setCustomUpload(2)
        console.log('get image list --------', imgObj);
    }
    const getCustomImage = (uri) => {
        updateCustomImage(false)
        let imageData = {
            uri: uri,
            width: wp(100),
            height: hp(100) - 80,
            name: (new Date().getTime()).toString() + ".jpg",
            type: "image/jpeg"
        }
        setCustomUpload(1)
        setImageObj([imageData])
    }
    const uploadImageOnServer = () => {
        console.log('get image', category, imageObj)
        if (imageObj.length == 0) {
            Toast.show('Please select image.')
        } else if (category.trim().length == 0) {
            Toast.show('Please select or enter category.')
        } else {
            // alert(category)
            props.onPressUploadFile(imageObj, category)
        }
    }
    return (
        <View style={styles.container}

        >
            <Modal style={{ margin: 0 }}
                isVisible={isCustomImage}>
                <WaterMark
                    onPressDone={(uri) => getCustomImage(uri)}
                    onPressCancel={() => updateCustomImage(false)}
                />
            </Modal>
            <View style={styles.middleView}>
                <View style={styles.inputViewContainer}>
                    <TextInput style={{ height: '100%', fontSize: wp(4.3), width: wp(84) - 55 }}
                        placeholder={'Category name'}
                        autoCapitalize={'none'}
                        placeholderTextColor={CLR_PLACEHOLDER}
                        value={category}
                        returnKeyType={"done"}
                        onChangeText={text => setCategory(text)}
                    />
                    <TouchableOpacity style={{ justifyContent: 'center', width: 40, alignItems: 'center', }}>

                        {/* <ModalDropdown style={{width: '100%', height: '100%'}}
                           options={['one', 'two','three']}
                           onSelect={(idx, value) => _dropdown_6_onSelect(idx, value)}/> */}
                        <ModalDropdown options={props.categoryData}
                            // style={styles.dropdown_2}
                            // textStyle={styles.dropdown_2_text}
                            dropdownStyle={styles.dropdown_2_dropdown}
                            dropdownTextStyle={{ fontSize: wp(4.1) }}
                            onSelect={(idx, value) => setCategory(value)}
                        >
                            <Image style={{ width: 15, height: 15, padding: 20, resizeMode: 'contain', tintColor: CLR_PRIMARY }} source={cat_drop_down} />
                        </ModalDropdown>

                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                    <Image style={{ width: 70, height: 70, resizeMode: 'contain', tintColor: CLR_PRIMARY }} source={gallery_icon} />
                    <View style={{ width: wp(84), alignItems: 'center' }}>
                        <Text style={{ color: 'black', fontSize: wp(4.2), marginBottom: 10 }}>{  imageObj.length > 0 ? customUpload == 2 ? `${imageObj.length} File Selected` : '1 Custom File Selected' : ''}</Text>
                        <TouchableOpacity style={styles.imagePickedContaint}
                            onPress={() => updateCustomImage(true)}>
                            <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.2) }}>Select Custom File </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{...styles.imagePickedContaint, marginTop: 10}}
                            onPress={() => pickMultipleImagePicker(props.max_upload, getImageList, cancelButton)}>
                            <Text style={{ color: CLR_PRIMARY, fontSize: wp(4.2) }}>Select From Gallery</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.bottomButtonContainer}
                        onPress={() => uploadImageOnServer()}>
                        <Text style={{ color: 'white', fontSize: wp(4.3) }}> Upload files </Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={{ width: 35, height: 35, position: 'absolute', top: -13, right: -13 }}
                    onPress={() => props.onPressCancel()}
                >
                    <Image source={delete_icon} style={{ width: '100%', height: '100%', tintColor: '#832D77' }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        margin: -wp(5),
        backgroundColor: '#ffffff80',
        justifyContent: 'center',
        alignItems: 'center'
    },
    middleView: {
        width: wp(90),
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: wp(3),
        // backgroundColor: 'green'
    },
    inputViewContainer: {
        flexDirection: 'row',
        width: wp(84),
        backgroundColor: CLR_LIGHT_LIGHT_GRAY,
        height: 50,
        borderRadius: 25,
        paddingLeft: 12,
        marginTop: 20
    },
    bottomButtonContainer: {
        marginTop: 10,
        backgroundColor: CLR_PRIMARY,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 46,
        borderRadius: 23
    },
    dropdown_2: {
        alignSelf: 'flex-end',
        width: '100%',
        height: 40,
        // marginTop: 10,
        right: 0,
        borderWidth: 0,
        borderRadius: 3,
        // backgroundColor: 'cornflowerblue',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    dropdown_2_dropdown: {
        width: wp(82),
        height: 88,
        borderColor: CLR_LIGHT_GRAY,
        borderWidth: 1.5,
        borderRadius: 4,
    },
    dropdown_2_row: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center',
    },
    dropdown_2_image: {
        marginLeft: 4,
        width: 30,
        height: 30,
    },
    dropdown_2_row_text: {
        marginHorizontal: 4,
        fontSize: 20,
        color: 'navy',
        textAlignVertical: 'center',
    },
    dropdown_2_separator: {
        height: 1,
        backgroundColor: 'cornflowerblue',
    },
    imagePickedContaint: {
        width: '90%', height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: CLR_PRIMARY,
        borderWidth: 2, borderRadius: 23
    }

})
