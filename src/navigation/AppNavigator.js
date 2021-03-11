import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';

import ProductsInOrderScreen from '../screens/ProductsInOrderScreen';
import AuthScreen from '../screens/AuthScreen';
import * as authActions from '../store/actions/auth';

import * as Colors from '../constants/Colors';
import { View } from 'react-native';
import StartupScreen from '../screens/StartupScreen';
import { SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { Button } from 'react-native';

const defaultNavigationOptions = {
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: 'white',
        },
        headerTintColor: Colors.main,
    }
}

const ProductsInOrderNavigator = createStackNavigator({
    ProductsInOrder: ProductsInOrderScreen,
}, {
    navigationOptions: {
        title: 'Список покупок'
    },
    ...defaultNavigationOptions
})

const ProductsNavigator = createDrawerNavigator({
    products: ProductsInOrderNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.main
    },
    contentComponent: props => {
        const dispatch = useDispatch()
        return <View style={{flex: 1, paddingTop: 20}}>
            <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                <DrawerNavigatorItems {...props}/>
                <Button title='Logout' color={Colors.accent} onPress={() => {
                    dispatch(authActions.logout())
                    props.navigation.navigate('Auth')
                }}/>
            </SafeAreaView>
        </View>
    },
    ...defaultNavigationOptions
})

const AuthNavigator = createDrawerNavigator({
    Auth: AuthScreen
}, {
    contentOptions: {
        activeTintColor: Colors.main
    }
})


const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Products: ProductsNavigator
})

export default createAppContainer(MainNavigator)