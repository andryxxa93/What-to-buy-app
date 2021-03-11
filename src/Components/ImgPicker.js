import React, { useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import * as Colors from '../constants/Colors';

const ImgPicker = props => {

    const [pickedImage, setPickedImage] = useState()

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
        if (!result.status === 'granted') {
            Alert.alert('Подтверждение разрешения', 'Вы должны дать рарзрешение на использвоание камеры', [{text: 'Okay'}])
            return false;
        }
        return true;
    }
    
    const takeImageHandler = async () => {
        const result = await verifyPermissions()
        if (!result) {
            return
        }
        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.5
        });
        setPickedImage(image.uri);
        props.onImageTaken(image.uri)
    }
    
    return (
       <View style={styles.container}>
           <View style={styles.imageContainer}>
                {!pickedImage 
                    ? <Text style={styles.text}>
                            Изображение не выбрано!
                        </Text>
                    : <Image 
                        source={{uri: pickedImage}}
                        style={styles.image}/>
                }
           </View>
            <Button
                onPress={takeImageHandler} 
                title='Выбрать изображение' 
                color={Colors.primary}/>
       </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 15
    },
    imageContainer: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    text: {

    }
})

export default ImgPicker;