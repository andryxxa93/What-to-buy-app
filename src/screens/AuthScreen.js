import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, ScrollView, Button, KeyboardAvoidingView, Text, View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';

import * as authActions from '../store/actions/auth';

import Input from '../Components/UI/Input';
import Card from '../Components/UI/Card';
import * as Colors from '../constants/Colors';
import { Alert } from 'react-native';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};


const AuthScreen = (props) => {

    const [isSignup, setIsSignup] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const dispatch = useDispatch();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authActions.signup(
                formState.inputValues.email,
                formState.inputValues.password
            )
        } else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            )
        }
        setError(null)
        setIsLoading(true)
        try {
            await dispatch(action)
            props.navigation.navigate('Products')
        } catch (err) {
            setError(err.message)
            setIsLoading(false)
        }
    };

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred', error, [{text: 'OK'}])
        }
    }, [error])

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
        },
        [dispatchFormState]
    );

   return (
    <KeyboardAvoidingView
      behavior='height'
      keyboardVerticalOffset={2}
      style={styles.screen}
    >
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default" 
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading 
              ? <ActivityIndicator
                    color={Colors.main}
                    size={'small'}
                />
              : <Button
                    title={isSignup ? 'Sign Up' : "Login"}
                    color={Colors.primary}
                    onPress={authHandler}
              />}
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                    color={Colors.accent}
                    onPress={() => {setIsSignup(prev => !prev)}}
                />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
  };
  
  const styles = StyleSheet.create({
    screen: {
      flex: 1
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    authContainer: {
      width: '80%',
      maxWidth: 400,
      maxHeight: 400,
      padding: 20
    },
    buttonContainer: {
      marginTop: 10
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
  });