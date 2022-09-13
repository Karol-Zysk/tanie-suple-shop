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
  _id: ObjectId;
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
 
    id: number;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;

}

export type FormValues = {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
};

export enum PayActionKind {
  FETCH_REQUEST = "FETCH_REQUEST",
  FETCH_SUCCESS = "FETCH_SUCCESS",
  FETCH_FAIL = "FETCH_FAIL",
  PAY_REQUEST = "PAY_REQUEST",
  PAY_FAIL = "PAY_FAIL",
  PAY_SUCCESS = "PAY_SUCCESS",
  PAY_RESET = "PAY_RESET",
}