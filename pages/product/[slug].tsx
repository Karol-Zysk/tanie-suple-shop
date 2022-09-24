import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "../../components/Layout";
import data from "../../utils/data";
import { Store } from "../../utils/Store";

export default function ProductScreen() {
  const { state, dispatch } = useContext(Store);

  const router = useRouter();
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);
  console.log(product?.brand);
  
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

  const formula = data.formula;
  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">wróć do strony głównej </Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Kategoria: {product.category}</li>
            <li>Producent: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Opis: {product.description}</li>
          </ul>
          <div className="mt-4">
            <h1>{formula}</h1>
          </div>
        </div>
        <div>
          <div className="p-5 card">
            <div className="flex justify-between mb-2">
              <div>Cena</div>
              <div>{product.price}zł</div>
            </div>
            <div className="flex justify-between mb-2">
              <div>Status</div>
              <div>
                {product.countInStock > 0 ? "W magazynie" : "Niedostępny"}
              </div>
            </div>
            <button
              className="w-full primary-button"
              onClick={addToCartHandler}
            >
              Dodaj do Koszyka
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
