import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ProductsType } from "../types";

export const ProductItem: React.FC<ProductsType> = ({ product }) => {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <div className="rounded shadow">
          <Image
            width="480"
            height="480"
            src={product.image}
            alt={product.name}
          />
        </div>
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p>{product.price}zł</p>
        <button  className="primary-button" type="button">
          do koszyka
        </button>
      </div>
    </div>
  );
};
