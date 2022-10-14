import axios from "axios";
import React from "react";
import { NextPage } from "next";
import { SetStateAction, useContext, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import { DataBaseProductType } from "../types";
import { brandsArray, categoryArray } from "../utils/data";
import db from "../utils/db";
import { Store } from "../utils/Store";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

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
      <div className="flex w-full gap-3 mt-4 ">
        <div className="flex-col content-center p-3 text-center bg-gray-200 border-2 rounded-lg lg:w-1/4 xss:absolute xs:relative h-min">
          <h1 className="mb-3 text-3xl font-semibold text-slate-800">Sortuj</h1>

          <div className="flex-col pt-3 pl-1 bg-white border-2 rounded-xl">
            <div>
              <span
                onClick={() => setSortBy(true)}
                className={`transition-all mr-1 mt-3 text-xl cursor-pointer   my-1   ${
                  sortBy ? "font-bold" : ""
                }`}
              >
                Cena
              </span>{" "}
              /{" "}
              <span
                onClick={() => setSortBy(false)}
                className={`transition-all mr-1 mt-3 text-xl cursor-pointer   my-1   ${
                  sortBy ? "" : "font-bold"
                }`}
              >
                Ocena
              </span>
            </div>
            <>
              {sortBy ? (
                <div className="flex justify-around my-3 ">
                  <button
                    onClick={handleSortByMaxPrice}
                    className={`transition-all mr-1   my-1 selected-button-price  ${
                      sortByMaxPrice ? "bg-amber-500" : "bg-amber-300"
                    }`}
                  >
                    Rosnąco <FaArrowUp className="ml-1" />
                  </button>
                  <button
                    onClick={handleSortByMinPrice}
                    className={`transition-all mr-1  my-1 selected-button-price  ${
                      sortByMinPrice ? "bg-amber-500" : "bg-amber-300"
                    }`}
                  >
                    Malejąco
                    <FaArrowDown className="ml-1" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-around my-3 ">
                  <button
                    onClick={handleSortByMaxRating}
                    className={`transition-all mr-1   my-1 selected-button-price  ${
                      sortByMaxRating ? "bg-amber-500" : "bg-amber-300"
                    }`}
                  >
                    Rosnąco <FaArrowUp className="ml-1" />
                  </button>
                  <button
                    onClick={handleSortByMinRating}
                    className={`transition-all mr-1  my-1 selected-button-price  ${
                      sortByMinRating ? "bg-amber-500" : "bg-amber-300"
                    }`}
                  >
                    Malejąco
                    <FaArrowDown className="ml-1" />
                  </button>
                </div>
              )}
            </>
            <h1 className="mt-3 text-xl font-semibold">Firma</h1>

            <div className="flex flex-wrap my-3 ">
              {brandsArray.map((brandName) => {
                return (
                  <div key={brandName}>
                    <button
                      value={brandName}
                      className={`transition-all mr-1  my-1 selected-button  ${
                        brandName === selectedBrand
                          ? "bg-amber-500"
                          : "bg-amber-300"
                      }`}
                      onClick={brandHandler}
                    >
                      {brandName}
                    </button>
                  </div>
                );
              })}
            </div>
            <h1 className="text-xl font-semibold">Kategorie</h1>
            <div className="flex flex-wrap my-3 ">
              {categoryArray.map((category) => {
                return (
                  <React.Fragment key={category}>
                    <div>
                      <button
                        value={category}
                        className={`transition-all mr-1  my-1 selected-button  ${
                          category === selectedCategory
                            ? "bg-amber-500"
                            : "bg-amber-300"
                        }`}
                        onClick={categoryHandler}
                      >
                        {category}
                      </button>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center content-center w-full ">
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
