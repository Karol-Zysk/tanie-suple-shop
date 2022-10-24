import axios from "axios";
import React from "react";
import { NextPage } from "next";
import { SetStateAction, useContext, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import { DataBaseProductType } from "../types";
import db from "../utils/db";
import { Store } from "../utils/Store";
import Sidebar from "../components/Sidebar";

interface Iproducts {
  products: DataBaseProductType[];
}

const Home: NextPage<Iproducts> = ({ products }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectButtonActive, setSelecteButtonActive] = useState(false);
  //sort state
  const [sortProducts, setSortProducts] = useState(products);
  const [sortBy, setSortBy] = useState(false);
  //sort by price
  const [sortByMinPrice, setSortByMinPrice] = useState(false);
  const [sortByMaxPrice, setSortByMaxPrice] = useState(false);
  //sort by rating
  const [sortByMinRating, setSortByMinRating] = useState(false);
  const [sortByMaxRating, setSortByMaxRating] = useState(false);
  const [hidden, setHidden] = useState(false);

  const showSidebarHandler = () => {
    setHidden(!hidden);
  };
  const hideSidebarHandler = () => {
    setHidden(false);
  };

  const handleSortByMaxPrice = () => {
    setSortByMinPrice(false);
    setSortByMaxPrice(true);
    setSortProducts(sortProducts.sort((a, b) => a.price - b.price));
  };
  const handleSortByMinPrice = () => {
    setSortByMinPrice(true);
    setSortByMaxPrice(false);
    setSortProducts(sortProducts.sort((a, b) => b.price - a.price));
  };
  const handleSortByMaxRating = () => {
    setSortByMinRating(false);
    setSortByMaxRating(true);
    setSortProducts(sortProducts.sort((a, b) => a.rating - b.rating));
  };
  const handleSortByMinRating = () => {
    setSortByMinRating(true);
    setSortByMaxRating(false);
    setSortProducts(sortProducts.sort((a, b) => b.rating - a.rating));
  };

  const brandHandler = (e: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    if (e.currentTarget.value === selectedBrand) {
      setSelectedBrand("");
    } else setSelectedBrand(e.currentTarget.value);
    setSelecteButtonActive(!selectButtonActive);
  };
  const categoryHandler = (e: {
    currentTarget: { value: SetStateAction<string> };
  }) => {
    if (e.currentTarget.value === selectedCategory) {
      setSelectedCategory("");
    } else setSelectedCategory(e.currentTarget.value);
    setSelecteButtonActive(!selectButtonActive);
  };

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

  const p = sortProducts.filter(
    (prod) =>
      prod.brand.toLowerCase().indexOf(selectedBrand.toLowerCase()) >= 0 &&
      prod.category.toLowerCase().indexOf(selectedCategory.toLowerCase()) >= 0
  );

  return (
    <Layout title="Strona Główna">
      <div className="flex w-full gap-3 mt-4">
        <Sidebar
          setSortBy={setSortBy}
          sortBy={sortBy}
          handleSortByMaxPrice={handleSortByMaxPrice}
          handleSortByMinPrice={handleSortByMinPrice}
          handleSortByMinRating={handleSortByMinRating}
          handleSortByMaxRating={handleSortByMaxRating}
          sortByMaxPrice={sortByMaxPrice}
          sortByMinPrice={sortByMinPrice}
          sortByMaxRating={sortByMaxRating}
          sortByMinRating={sortByMinRating}
          categoryHandler={categoryHandler}
          brandHandler={brandHandler}
          selectedBrand={selectedBrand}
          selectedCategory={selectedCategory}
          showSidebarHandler={showSidebarHandler}
          hidden={hidden}
        />
        <div
          onClick={hideSidebarHandler}
          className="flex flex-col items-center content-center w-auto "
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-3">
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
        </div>
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
