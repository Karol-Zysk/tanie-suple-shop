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
      <CheckoutWizard activeStep={3} />
      <h1 className="mb-4 text-xl">Złóż zamówienie</h1>
      {cartItems.length === 0 ? (
        <div>
          Koszyk jest pusty <Link href="/">Wróć do sklepu</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Miejsce Wysyłki</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              <div>
                <Link href="/shipping">Edytuj</Link>
              </div>
            </div>
            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Metody Płatności</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment">Edytuj</Link>
              </div>
            </div>
            <div className="p-5 overflow-x-auto card">
              <h2 className="mb-2 text-lg">Zamówienie</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Produkt</th>
                    <th className="p-5 text-right ">Ilość</th>
                    <th className="p-5 text-right ">Cena</th>
                    <th className="p-5 text-right">Suma</th>
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
                      <td className="p-5 text-right ">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.quantity !== undefined && (item.quantity * item.price)}
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
            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Podsumowanie Zamówienia</h2>
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
                    className="w-full primary-button"
                  >
                    {loading ? "Loading..." : "Place Order"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

PlaceOrderScreen.auth = true;
