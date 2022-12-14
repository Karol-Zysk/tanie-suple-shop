/* eslint-disable no-unused-vars */
import { ObjectId } from "mongoose";
import { ReactNode } from "react";

export type ProductsType = {
  product: {
    id: number;
    name: string;
    slug: string;
    category: string;
    image: string;
    price: number;
    brand: string;
    rating: number;
    numReviews: number;
    flavours: string[];
    countInStock: number;
    description: string;
  };
};
export type ProductType = {
  id: number;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  flavours: string[];
  countInStock: number;
  description: string;
  quantity?: number;
};
export type DataBaseProductType = {
  _id: string;
  id: number;
  name: string;
  slug: string;
  category: string;
  image: string;
  price: number;
  brand: string;
  rating: number;
  numReviews: number;
  flavours: string[];
  countInStock: number;
  description: string;
  quantity?: number;
};

export type ContextProviderType = {
  children: ReactNode;
};

export type usersType = {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};
export type DataBaseUsersType = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};

export type FormValues = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
  isAdmin: boolean;
};

export enum PayActionKind {
  FETCH_REQUEST = "FETCH_REQUEST",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAIL = "FETCH_FAIL",
  PAY_REQUEST = "PAY_REQUEST",
  PAY_FAIL = "PAY_FAIL",
  PAY_SUCCESS = "PAY_SUCCESS",
  PAY_RESET = "PAY_RESET",
  DELIVER_REQUEST = "DELIVER_REQUEST",
  DELIVER_SUCCESS = "DELIVER_SUCCESS",
  DELIVER_FAIL = "DELIVER_FAIL",
  DELIVER_RESET = "DELIVER_RESET",
}

export type OrderType = {
  _id: string;
  createdAt: string;
  user: any;
  orderItems: {
    image: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress?:
    | {
        address: string;
        fullName: string;
        city: string;
        postalCode: string;
        country: string;
      }
    | undefined;
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
};

export type ShippingAdressType = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export enum GetProductsActionKind {
  FETCH_REQUEST = "FETCH_REQUEST",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAIL = "FETCH_FAIL",

  CREATE_REQUEST = "CREATE_REQUEST",
  CREATE_SUCCESS = "CREATE_SUCCESS",
  CREATE_FAIL = "CREATE_FAIL",

  DELETE_REQUEST = "DELETE_REQUEST",
  DELETE_SUCCESS = "DELETE_SUCCESS",
  DELETE_FAIL = "DELETE_FAIL",
  DELETE_RESET = "DELETE_RESET",
}

export enum EditProductActionKind {
  FETCH_REQUEST = "FETCH_REQUEST",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAIL = "FETCH_FAIL",

  UPDATE_REQUEST = "UPDATE_REQUEST",
  UPDATE_SUCCESS = "UPDATE_SUCCESS",
  UPDATE_FAIL = "UPDATE_FAIL",

  UPLOAD_REQUEST = "UPLOAD_REQUEST",
  UPLOAD_SUCCESS = "UPLOAD_SUCCESS",
  UPLOAD_FAIL = "UPLOAD_FAIL",
}

export enum ListUsersActionKind {
  FETCH_REQUEST = "FETCH_REQUEST",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAIL = "FETCH_FAIL",

  CREATE_REQUEST = "CREATE_REQUEST",
  CREATE_SUCCESS = "CREATE_SUCCESS",
  CREATE_FAIL = "CREATE_FAIL",

  DELETE_REQUEST = "DELETE_REQUEST",
  DELETE_SUCCESS = "DELETE_SUCCESS",
  DELETE_FAIL = "DELETE_FAIL",
  DELETE_RESET = "DELETE_RESET",
}
