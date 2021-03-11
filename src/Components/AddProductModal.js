import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import * as productsActions from '../store/actions/products';
import { CheckBox } from 'react-native-elements';

import * as Colors from '../constants/Colors';
import NeoMorphContainer from './UI/NeoMorphContainer';

const AddProdcutModal = (props) => {
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')
    const [isBought, setIsBought] = useState(false)

    const dispatch = useDispatch();

    const submitHandler = useCallback(() => {
        dispatch(productsActions.addItem(title, comment, isBought))
        props.setModalVisible(false)
    }, [dispatch, title, comment, isBought])


   return (
       <NeoMorphContainer opacity={0.3} color='#5f7cb4' width={70} height={30}>
           <View style={styles.centered}>
            <TextInput
                style={styles.input}
                id="title"
                placeholder="Название"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                returnKeyType="next"
                onInputChange={() => {}}
                onChangeText={(text) => setTitle(text)}
            />
            <TextInput
                style={styles.input}
                id="comment"
                placeholder="Комментарий"
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                onInputChange={() => {}}
                onChangeText={(text) => setComment(text)}
            />
            {/* <ImgPicker
                onImageTaken={imageTakeHandler}
            /> */}
            <CheckBox
                style={{marginBottom: 20}}
                center
                iconRight
                title='Уже купил'
                iconType='material'
                checkedIcon='check'
                uncheckedIcon='check'
                checkedColor='green'
                containerStyle={{backgroundColor: 'white', borderWidth: 0, marginTop: 30}}
                checked={isBought}
                onPress={() => setIsBought(prev => !prev)}
            />
            <View style={styles.btnContainer}>
                <Button color={Colors.main} title='Добавить' onPress={submitHandler}/>
                <Button color={'red'} title='Отмена' onPress={() => props.setModalVisible(false)}/>
            </View>
            </View>
        </NeoMorphContainer>
    )
}

const styles = StyleSheet.create({
    centered: {
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        borderRadius: 10,
    },
    inputContainer: {
        marginVertical: 20
    },  
    input: {
        width: '80%',
        marginVertical: 10,
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    btnContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default AddProdcutModal;