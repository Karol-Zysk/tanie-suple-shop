import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import { products } from "../utils/data";

const Home: NextPage = () => {
  console.log(products);

  return <Layout title="Strona Główna">HomePage</Layout>;
};

export default Home;
