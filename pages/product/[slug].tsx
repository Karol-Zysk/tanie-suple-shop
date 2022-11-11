import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import StarRatings from "react-star-ratings";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
import { ProductType } from "../../types";
import db from "../../utils/db";
import { Store } from "../../utils/Store";
import { TiArrowBackOutline } from "react-icons/ti";
import { formula } from "../../utils/data";

export default function ProductScreen(props: { product: ProductType }) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  if (!product) {
    return <div>Nie znaleziono takiego produktu</div>;
  }

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find(
      (x: { slug: string }) => x.slug === product.slug
    );
    const quantity: number = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      alert("Przepraszamy. W magazynie nie ma więcej produktów");
      return;
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <Layout title={product.name}>
      <div className="items-center hidden pt-5 pl-5 text-xl font-semibold text-blue-700 lg:flex h-min">
        <Link href="/">
          <TiArrowBackOutline className="text-5xl text-blue-700 cursor-pointer " />
        </Link>
      </div>
      <div className="flex w-full lg:justify-center ">
        <div className="flex flex-col items-center content-between justify-between w-full lg:items-stretch lg:w-9/12 lg:flex-row ">
          <div className="p-3 pt-20 border-4 lg:p-8 lg:w-8/12 bg-slate-800 text-slate-100">
            <ul>
              <li>
                <h1 className="mb-8 text-2xl font-semibold text-blue-500 lg:text-4xl">
                  {product.name}
                </h1>
              </li>
              <li className="mb-2 font-normal text-md lg:text-lg">
                <b>Kategoria: </b>
                {product.category}
              </li>
              <li className="mb-2 font-normal text-md lg:text-lg">
                <b>Producent: </b>
                {product.brand}
              </li>
              <li className="flex content-center h-8 mb-2 text-lg font-normal">
                {"  "}
                <div className="flex items-center content-center h-full">
                  <StarRatings
                    rating={product.rating}
                    starDimension="20px"
                    starSpacing="0px"
                    starRatedColor="gold"
                    ignoreInlineStyles={false}
                  />
                  <p className="block mt-1 ml-2">z {product.numReviews} ocen</p>
                </div>
              </li>
              <li className="mb-2 font-normal text-md lg:text-lg">
                <b>Opis: </b>
                {product.description}
              </li>
            </ul>
            <p className="mt-8 text-base font-bold md:text-lg">{formula}</p>
            <div className="mt-4"></div>
          </div>
          <div className="w-full p-3 pt-6 border-4 lg:p-8 lg:w-4/12 bg-slate-800 text-slate-900">
            <div className="mb-4 md:col-span-2">
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                layout="responsive"
              ></Image>
            </div>
            <div className="p-5 card">
              <div className="flex justify-between mb-2 text-slate-900">
                <div>Cena</div>
                <div>{product.price}zł</div>
              </div>
              <div className="flex justify-between mb-2 text-slate-900">
                <div>Status</div>
                <div>
                  {product.countInStock > 0 ? "W magazynie" : "Niedostępny"}
                </div>
              </div>
              <button
                className="w-full primary-button text-slate-900"
                onClick={addToCartHandler}
              >
                Dodaj do Koszyka
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context; //@ts-ignore
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
