import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as productActions from '../store/actions/products';
import { CheckBox } from 'react-native-elements'
import { useDispatch } from 'react-redux';
import NeoMorphContainer from './UI/NeoMorphContainer';


const Product = (props) => {

    const [deleting, setDeleting] = useState(false)

    const dispatch = useDispatch();

    const toggleCheckboxHandler = () => {
        dispatch(productActions.changeBoughtedStatus(props.id, !props.bought))
    }

    useEffect(() => {
        props.setDelayValue(prev => prev + 500)
    }, [])

    const colors = {
        white: ['#ffff', '#ffff'],
        red: ['#fff', '#ff9696'],
        green: ['#fff', '#99ffb8']
    }

    const locations = [0, .9];


    return (
        <TouchableOpacity onPress={props.onSelect}>
            <NeoMorphContainer>
                <LinearGradient
                    style={styles.item}
                    colors={deleting ? colors.red : props.bought ? colors.green : colors.white}
                    start={{x: 1, y: 0}} end={{x: 0, y: 0}}
                    locations={locations}
                >
                    
                    <View style={styles.info}>
                        <View>
                            <CheckBox
                                center
                                iconRight
                                iconType='material'
                                checkedIcon='check'
                                uncheckedIcon='check'
                                checkedColor='green'
                                checked={props.bought}
                                onPress={() => toggleCheckboxHandler()}
                            />
                        </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{props.name}</Text>
                                <Text style={styles.comment}>{props.comment}</Text>
                            </View>
                    </View>
                    {props.image && <Image source={{uri: props.image}}/>}
                    <TouchableOpacity onPressIn={() => {setDeleting(true)}} onPressOut={() => setDeleting(false)} onLongPress={props.onRemove}>
                            <MaterialIcons
                                name={'delete'}
                                size={25}
                                color='red'
                            />
                    </TouchableOpacity>
                </LinearGradient>
            </NeoMorphContainer>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({  
    item: {
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 10,
        padding: 10
    },
    boughted: {
        backgroundColor: '#F0E68C'
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },  
    name: {
        fontSize: 14,
    },
    comment: {
        fontSize: 14,
        color: '#7A7A7A'
    }

})

export default Product;