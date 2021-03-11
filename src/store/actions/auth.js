import AsyncStorage from "@react-native-community/async-storage";

const _apiKey = 'AIzaSyCvVyp_zdOq-hDM14vpC0tkTCsnEJY4f-4';

export const SIGNUP = 'SIGNUP';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const autheticate = (userID, token, expirationTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expirationTime));
        dispatch({type: AUTHENTICATE, userId: userID, token: token})
    }
}

export const logout = () => {
    clearLogoutTimer()
    AsyncStorage.removeItem('userData')
    return {type: LOGOUT}
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer)
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout())
        }, expirationTime);
    }
}

const saveDataStorage = (token, userID, expirationDate) => {
    AsyncStorage.setItem(
        'userData', 
        JSON.stringify({
            token: token,
            userID: userID,
            expirationDate: expirationDate.toISOString()
    }))
}

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${_apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        )

        if (!response.ok) {
            const responseErrorData = await response.json();
            const errorId = responseErrorData.error.message;
            let message = 'Something went wrong!'
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exist already!';
            } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
                message = 'Too many attemps. Please try later'
            }
            throw new Error (message)
        }

        const resData = await response.json()
        dispatch(autheticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000))
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)
        saveDataStorage(resData.idToken, resData.localId, expirationDate)
    };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${_apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        )
        if (!response.ok) {
            const responseErrorData = await response.json();
            const errorId = responseErrorData.error.message;
            let message = 'Something went wrong!'
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            } else if (errorId === 'INVALID_PASSWORD') {
                message = 'Password is incorrect'
            }
            throw new Error (message)
        }

        const resData = await response.json()
        dispatch(autheticate(resData.localId, resData.idToken, parseInt(resData.expiresIn) * 1000))
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000)
        saveDataStorage(resData.idToken, resData.localId, expirationDate)
    };
};