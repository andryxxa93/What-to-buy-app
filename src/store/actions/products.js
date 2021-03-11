import ProdItem from "../../models/ProdItem";

export const ADD_ITEM = 'ADD_ITEM';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const REMOVE_PRODUCT = 'REMOVE_PRODUCT';
export const CHANGE_BOUGHTED_STATUS = 'CHANGE_BOUGHTED_STATUS';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId
        try {
            const response = await fetch(`https://buyapp-4439c-default-rtdb.firebaseio.com/${userId}/products.json`)

            if (!response.ok) {
                const responseErrorData = await response.json();
                const errorId = responseErrorData.error.message;
                throw new Error (errorId)
            }

            const responseData = await response.json();
            const products = [];
            
            for (const key in responseData) {
                products.push(new ProdItem(
                    responseData[key].name,
                    responseData[key].comment,
                    responseData[key].bought,
                    key,
                ))
            }
            dispatch({
                type: SET_PRODUCTS,
                products: products
            })
        } catch (error) {
            throw new Error(error)            
        }
    }
}

export const addItem = (name, comment, bought = false) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId
        const response = await fetch(`https://buyapp-4439c-default-rtdb.firebaseio.com/${userId}/products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bought,
                name,
                comment,
                
            })
        })


        if (!response.ok) {
            const responseErrorData = await response.json();
            console.log(responseErrorData)
            const errorId = responseErrorData.error.message;
            throw new Error (errorId)
        }

        const responseData = await response.json();

        dispatch(
            {type: ADD_ITEM, name: name, comment: comment, bought: bought, id: responseData.name }
        )
    }
}

export const updateItem = (id, name, comment, bought = false) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://buyapp-4439c-default-rtdb.firebaseio.com/${userId}/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                name,
                comment,
                bought
            })
        })

        if (!response.ok) {
            const responseErrorData = await response.json();
            const errorId = responseErrorData.error.message;
            throw new Error (errorId)
        }

        dispatch(
            {type: UPDATE_PRODUCT, name: name, comment: comment, bought: bought }
        )
    }
}



export const removeItem = (id) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId
        const response = await fetch(`https://buyapp-4439c-default-rtdb.firebaseio.com/${userId}/products/${id}.json?auth=${token}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            const responseErrorData = await response.json();
            const errorId = responseErrorData.error.message;
            throw new Error (errorId)
        }

        dispatch(
            {type: REMOVE_PRODUCT, id: id }
        )
    }
}

export const changeBoughtedStatus = (id, bought) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId
        const response = await fetch(`https://buyapp-4439c-default-rtdb.firebaseio.com/${userId}/products/${id}.json?auth=${token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bought
            })
        })

        if (!response.ok) {
            const responseErrorData = await response.json();
            const errorId = responseErrorData.error.message;
            throw new Error (errorId)
        }

        dispatch(
            {type: CHANGE_BOUGHTED_STATUS, bought: bought, id: id }
        )
    }
}
