import type { NextPage } from "next";
import Layout from "../components/Layout";
import { ProductItem } from "../components/ProductItem";
import data from "../utils/data";

const Home: NextPage = () => {

  return <Layout title="Strona Główna">
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
        {data.products.map((product) => (
          <ProductItem product={product} key={product.slug}></ProductItem>
        ))}
      </div>
    </Layout>;
};

export default Home;
