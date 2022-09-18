import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { OrderType } from "../../types";
import { getError } from "../../utils/error";

function reducer(state: any, action: { type: string; payload: {} }) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}

export default function AdminOrderScreen() {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({
          type: "FETCH_REQUEST",
          payload: "",
        });
        const { data } = await axios.get(`/api/admin/orders`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Panel</Link>
            </li>
            <li>
              <Link href="/admin/orders">
                <a className="font-bold">Zamówienia</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/products">Produkty</Link>
            </li>
            <li>
              <Link href="/admin/users">Użytkownicy</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Zamówienia admina</h1>

          {loading ? (
            <div>Chwileczkę...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">Użytkownik</th>
                    <th className="p-5 text-left">Data</th>
                    <th className="p-5 text-left">Suma</th>
                    <th className="p-5 text-left">Zapłacono</th>
                    <th className="p-5 text-left">Dostarczono</th>
                    <th className="p-5 text-left">Usuń</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: OrderType) => (
                    <tr key={order._id} className="border-b">
                      <td className="p-5">{order._id.substring(20, 24)}</td>
                      <td className="p-5">
                        {order.user ? order.user.name : "Usunięty użytkownik"}
                      </td>
                      <td className="p-5">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="p-5">${order.totalPrice}</td>
                      <td className="p-5">
                        {order.isPaid
                          ? `${order?.paidAt?.substring(0, 10)}`
                          : "not paid"}
                      </td>
                      <td className="p-5">
                        {order.isDelivered
                          ? `${order?.deliveredAt?.substring(0, 10)}`
                          : "nie dostarczono"}
                      </td>
                      <td className="p-5">
                        <Link href={`/order/${order._id}`} passHref>
                          <a>Szczegóły</a>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminOrderScreen.auth = { adminOnly: true };
