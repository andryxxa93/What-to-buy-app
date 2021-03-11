import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-community/async-storage";
import * as Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import { useDispatch } from 'react-redux';

const StartupScreen = (props) => {
    const dispatch = useDispatch()
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (!userData) {
                props.navigation.navigate('Auth')
                return;
            }
            const transformedData = JSON.parse(userData)
            const { userID, token, expirationDate } = transformedData;
            const expiryDate = new Date(expirationDate)
            
            if (!token || !userID) {
                AsyncStorage.removeItem('userData')
                props.navigation.navigate('Auth')
                return;
            }
            const expirationTime = expiryDate.getTime() - new Date().getTime();

            props.navigation.navigate('Products')
            dispatch(authActions.autheticate(userID, token, expirationTime))
        }
        tryLogin()
    }, [dispatch])

    return (<View style={styles.screen}>
        <ActivityIndicator size='large' color={Colors.main}/>
    </View>)
}




const styles = StyleSheet.create({
    screem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen;