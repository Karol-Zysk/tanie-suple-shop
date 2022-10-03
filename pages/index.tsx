import axios from "axios";
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
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectButtonActive, setSelecteButtonActive] = useState(false);
  const [sortProducts, setSortProducts] = useState(products);
  const [sortByMin, setSortByMin] = useState(false);
  const [sortByMax, setSortByMax] = useState(false);

  const sortHandlerMax = () => {
    setSortByMin(false);
    setSortByMax(true);
    setSortProducts(sortProducts.sort((a, b) => a.price - b.price));
  };
  const sortHandlerMin = () => {
    setSortByMin(true);
    setSortByMax(false);
    setSortProducts(sortProducts.sort((a, b) => b.price - a.price));
  };

  const { cart } = state;

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
      <div className="flex w-full gap-3 ">
        <div className="flex-col content-center w-1/4 p-3 text-center border-2 rounded-lg">
          <h1 className="mb-3 text-xl font-bold">Sortuj</h1>

          <div className="flex-col pl-1 bg-white border-2 ">
            <h1 className="mt-3 text-xl font-semibold">Cena</h1>
            <div className="flex justify-around my-3 ">
              <button
                onClick={sortHandlerMax}
                className={`transition-all mr-1   my-1 selected-button-price  ${
                  sortByMax ? "bg-amber-500" : "bg-amber-300"
                }`}
              >
                Rosnąco <FaArrowUp className="ml-1" />
              </button>
              <button
                onClick={sortHandlerMin}
                className={`transition-all mr-1  my-1 selected-button-price  ${
                  sortByMin ? "bg-amber-500" : "bg-amber-300"
                }`}
              >
                Malejąco
                <FaArrowDown className="ml-1" />
              </button>
            </div>
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
                  <>
                    <div key={category}>
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
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center content-center w-full ">
          <div className="grid content-around grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
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
