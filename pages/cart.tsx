import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { XCircleIcon } from "@heroicons/react/outline";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";
import { ProductType } from "../types";
import dynamic from 'next/dynamic';

function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item: ProductType) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const updateCartHandler = (item: ProductType, qty: number) => {
    const quantity = Number(qty);
    dispatch({ type: "CART_ADD_ITEM", payload: { ...item, quantity } });
  };
  
  return (
    <Layout title="Shopping Cart">
      <h1 className="mb-4 text-xl">Koszyk</h1>
      {cartItems.length === 0 ? (
        <div>
          Koszyk jest pusty <Link href="/">Kontynuuj Zakupy</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <table className="min-w-full ">
              <thead className="border-b">
                <tr>
                  <th className="p-5 text-left">Produkt</th>
                  <th className="p-5 text-right">Ilość</th>
                  <th className="p-5 text-right">Cena</th>
                  <th className="p-5">Usuń</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item: ProductType) => {
                  return (
                    <tr key={item.slug} className="border-b">
                      <td>
                        <Link href={`/product/${item.slug}`}>
                          <a className="flex items-center">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            ></Image>
                            &nbsp;
                            {item.name}
                          </a>
                        </Link>
                      </td>
                      <td className="p-5 text-right">
                        <select
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartHandler(
                              item,
                              Number(e.currentTarget.value)
                            )
                          }
                        >
                          {Array.from(Array(item.countInStock).keys()).map(
                            (x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="p-5 text-right">{item.price}zł</td>
                      <td className="p-5 text-center">
                        <button onClick={() => removeItemHandler(item)}>
                          <XCircleIcon className="w-5 h-5"></XCircleIcon>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-5 card">
            <ul>
              <li>
                <div className="pb-3 text-xl">
                  Suma(
                  {cartItems.reduce(
                    (a: number, c: { quantity: number }) => a + c.quantity,
                    0
                  ) +
                    "): " +
                    cartItems.reduce(
                      (a: number, c: { quantity: number; price: number }) =>
                        a + c.quantity * c.price,
                      0
                    )}
                  zł
                </div>
              </li>
              <li>
                <button
                  onClick={() => router.push("/shipping")}
                  className="w-full primary-button"
                >
                  Zamawiam
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });