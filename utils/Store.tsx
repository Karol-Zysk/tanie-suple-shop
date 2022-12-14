import Cookies from "js-cookie";
import { createContext, FC, useReducer } from "react";
import { ContextProviderType, ProductType, ShippingAdressType } from "../types";

export const Store = createContext<any | undefined>(undefined);

export type CartStateType = {
  cartItems: ProductType[];
  shippingAddress: ShippingAdressType;
};

const initialState = {
  cart: Cookies.get("cart") //@ts-ignore
    ? JSON.parse(Cookies.get("cart"))
    : { cartItems: [], shippingAddress: {} },
};

function reducer(
  state: {
    cart: {
      [x: string]: {};
      cartItems: ProductType[];
    };
  },
  action: { type: string; payload: ProductType }
) {
  switch (action.type) {
    case "CART_ADD_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item: { slug: string }) => item.slug === newItem.slug
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item: { name: string }) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_RESET":
      return {
        ...state,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };
    case "CART_CLEAR_ITEMS":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
}

export const StoreProvider: FC<ContextProviderType> = ({ children }) => {
  //@ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return <Store.Provider value={value}>{children}</Store.Provider>;
};
