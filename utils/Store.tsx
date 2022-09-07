import { createContext, FC, useReducer } from "react";
import { ContextProviderType, ProductsType, ProductType } from "../types";

export const Store = createContext<any | undefined>(undefined);

const initialState = {
  cart: { cartItems: [] },
};

function reducer(
  state: { cart: { cartItems: any[] } },
  action: { type: string; payload: ProductType }
) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: { slug: string }) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: { name: any }) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    default:
      return state;
  }
}

export const StoreProvider: FC<ContextProviderType> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
