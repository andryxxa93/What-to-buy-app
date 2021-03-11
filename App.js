import React from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';

import productsReducer from './src/store/reducers/products'
import authReducer from './src/store/reducers/auth';
import AppNavigator from './src/navigation/AppNavigator';

const rootReducer = combineReducers({
    auth: authReducer,
    products: productsReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
    return (
        <Provider store={store}>
            <AppNavigator/>
        </Provider>
    );
}


