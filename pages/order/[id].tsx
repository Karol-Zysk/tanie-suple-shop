import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { DataBaseProductType } from "../../types";
import { getError } from "../../utils/error";

function reducer(state: any, action: { type: string; payload: string }) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function OrderScreen() {
  // order/:id
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({
          type: "FETCH_REQUEST",
          payload: "",
        });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className="mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Chwilkę..</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Adres Wysyłki</h2>
              <div>
                {shippingAddress.fullName}, {shippingAddress.address},{" "}
                {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className="alert-success">
                  Dostarczono do {deliveredAt}
                </div>
              ) : (
                <div className="alert-error">Nie dostarczono</div>
              )}
            </div>

            <div className="p-5 card">
              <h2 className="mb-2 text-lg">Metoda Płatności</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className="alert-success">Opłacono {paidAt}</div>
              ) : (
                <div className="alert-error">Nie opłacono</div>
              )}
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
                  {orderItems.map((item: DataBaseProductType) => (
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
                        $
                        {item.quantity !== undefined &&
                          item.quantity * item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                </li>{" "}
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
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
