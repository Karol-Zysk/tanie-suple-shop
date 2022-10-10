import Image from "next/image";
import Link from "next/link";
import React from "react";
import { DataBaseProductType } from "../types";
import { AiOutlineShoppingCart } from "react-icons/ai";
import StarRatings from "react-star-ratings";

interface IProps {
  product: DataBaseProductType;
  addToCartHandler: any;
}

const ProductItem: React.FC<IProps> = ({ product, addToCartHandler }) => {
  return (
    <div className="p-5 bg-gray-200 card ">
      <Link href={`/product/${product.slug}`}>
        <div className="bg-white rounded shadow cursor-pointer">
          <Image
            width="480"
            height="480"
            src={product.image}
            alt={product.name}
          />
        </div>
      </Link>
      <Link href={`/product/${product.slug}`}>
        <h2 className="my-2 text-base font-normal text-center">
          {product.name}
        </h2>
      </Link>
      <div className="flex flex-col items-center justify-center p-2">
        <div className="flex justify-between w-full mt-2 ">
          <div>
            <div className="flex items-center ">
              <p className="mt-1 mr-2 font-semibold ">Ocena:</p>
              <StarRatings
                rating={product.rating}
                starDimension="18px"
                starSpacing="0px"
                starRatedColor="gold"
              />
            </div>
            <p className="text-xl font-medium">{product.price}zł</p>
          </div>
          <button
            className="primary-button"
            type="button"
            onClick={() => addToCartHandler(product)}
          >
            <AiOutlineShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductItem;
