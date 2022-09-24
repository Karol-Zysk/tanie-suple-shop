import axios from "axios";
import { NextPage } from "next";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import { DataBaseProductType } from "../types";
import db from "../utils/db";
import { Store } from "../utils/Store";

interface Iproducts {
  products: DataBaseProductType[];
}

const Home: NextPage<Iproducts> = ({ products }) => {
  const { state, dispatch } = useContext(Store);
  const [filters, setFilters] = useState({
    s: "Trec",
  });

  const { cart } = state;

  const addToCartHandler = async (product: DataBaseProductType) => {
    const existItem = cart.cartItems.find(
      (x: { slug: string }) => x.slug === product.slug
    );
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Przepraszamy. Brak w magazynie");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    toast.success("Dodano do koszyka");
  };

  const p = products.filter(
    (prod) => prod.brand.toLowerCase().indexOf(filters.s.toLowerCase()) >= 0
  );

  console.log(p + "elo");

  console.log(products);

  return (
    <Layout title="Strona Główna">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {p.map((product) => {
          return (
            <ProductItem
              product={product}
              key={product.slug}
              addToCartHandler={addToCartHandler}
            ></ProductItem>
          );
        })}
      </div>
    </Layout>
  );
};

export async function getServerSideProps() {
  await db.connect();

  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default Home;
