import ProdItem from '../../models/ProdItem';
import { ADD_ITEM, CHANGE_BOUGHTED_STATUS, REMOVE_PRODUCT, SET_PRODUCTS } from "../actions/products";

const initialState = {
    products: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PRODUCTS:
            return {
                ...state,
                products: action.products.sort((a, b) => a.bought > b.bought ? 1 : -1)
            }
        case ADD_ITEM:
            const newProducts = [...state.products, new ProdItem(action.name, action.comment, action.bought, action.id, action.image)]
            return {
                products: [...newProducts.sort((a, b) => a.bought > b.bought ? 1 : -1)]
            }
        case REMOVE_PRODUCT:
            const newProductsArray = state.products.filter(prod => prod.id !== action.id);
            return {
                products: [...newProductsArray]
            }
        case CHANGE_BOUGHTED_STATUS:
            const updatedProd = state.products.find(item => item.id === action.id);
            updatedProd.bought = action.bought;
            const prodIdx = state.products.findIndex(prod => prod.id === action.id);
            const updatedProducts = [...state.products];
            updatedProducts[prodIdx] = updatedProd;
            return {
                products: [...updatedProducts.sort((a, b) => a.bought > b.bought ? 1 : -1)]
            }
        default:
            return state;
    }
}