import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import Image from "next/image";
import { DataBaseProductType } from "../types";

export default function PlaceOrderScreen() {
  const { state, dispatch } = useContext(Store);

  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;

  const itemsPrice = round2(
    cartItems.reduce(
      (a: number, c: { quantity: number; price: number }) =>
        a + c.quantity * c.price,
      0
    )
  ); // 123.4567 => 123.46

  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "CART_CLEAR_ITEMS" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Place Order">
      <div className="flex-col w-full p-2 md:p-0">
        <CheckoutWizard activeStep={3} />
        <h1 className="mb-4 text-lg md:text-xl">Złóż zamówienie</h1>
        {cartItems.length === 0 ? (
          <div>
            Koszyk jest pusty <Link href="/">Wróć do sklepu</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="p-2 bg-slate-200 md:p-4 card">
                <h2 className="mb-2 md:text-lg text-md ">Miejsce Wysyłki</h2>
                <div>
                  {shippingAddress.fullName}, {shippingAddress.address},{" "}
                  {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                </div>
                <div>
                  <Link href="/shipping">Edytuj</Link>
                </div>
              </div>
              <div className="p-2 md:p-4 card bg-slate-200">
                <h2 className="mb-2 md:text-lg text-md ">Metody Płatności</h2>
                <div>{paymentMethod}</div>
                <div>
                  <Link href="/payment">Edytuj</Link>
                </div>
              </div>
              <div className="p-2 overflow-x-auto md:p-4 card bg-slate-200">
                <h2 className="mb-2 md:text-lg text-md ">Zamówienie</h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Produkt</th>
                      <th className="p-2 text-right md:p-4 ">Ilość</th>
                      <th className="p-2 text-right md:p-4 ">Cena</th>
                      <th className="p-2 text-right md:p-4">Suma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item: DataBaseProductType) => (
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
                        <td className="p-2 text-right md:p-4 ">
                          {item.quantity}
                        </td>
                        <td className="p-2 text-right md:p-4">${item.price}</td>
                        <td className="p-2 text-right md:p-4">
                          $
                          {item.quantity !== undefined &&
                            item.quantity * item.price}
                          zł
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  <Link href="/cart">Edytuj</Link>
                </div>
              </div>
            </div>
            <div>
              <div className="p-2 md:p-4 card bg-slate-200">
                <h2 className="mb-2 md:text-lg text-md ">
                  Podsumowanie Zamówienia
                </h2>
                <ul>
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Produkty</div>
                      <div>{itemsPrice}zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Podatek</div>
                      <div>{taxPrice}zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Wysyłka</div>
                      <div>{shippingPrice}zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Suma</div>
                      <div>{totalPrice}zł</div>
                    </div>
                  </li>
                  <li>
                    <button
                      disabled={loading}
                      onClick={placeOrderHandler}
                      className="w-full font-semibold primary-button"
                    >
                      {loading ? "Loading..." : "Kupuję"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
