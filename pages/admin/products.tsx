import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { DataBaseProductType, GetProductsActionKind } from "../../types";
import { getError } from "../../utils/error";

interface PayAction {
  type: GetProductsActionKind;
  payload: any;
}



function reducer(state: any, action: PayAction) {
  switch (action.type) {
    case GetProductsActionKind.FETCH_REQUEST:
 
      console.log(state);

      return { ...state, loading: true, error: "" };
    case GetProductsActionKind.FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: "" };
    case GetProductsActionKind.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
export default function AdminProdcutsScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({
          type: GetProductsActionKind.FETCH_REQUEST,
          payload: "",
        });
        const { data } = await axios.get(`/api/admin/products`);
        dispatch({ type: GetProductsActionKind.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({
          type: GetProductsActionKind.FETCH_FAIL,
          payload: getError(err),
        });
      }
    };

    fetchData();
  }, []);
  return (
    <Layout title="Admin Products">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Panel</Link>
            </li>
            <li>
              <Link href="/admin/orders">Zamówienia</Link>
            </li>
            <li>
              <Link href="/admin/products">
                <a className="font-bold">Produkty</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Użytkownicy</Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Produkty</h1>
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
                    <th className="p-5 text-left">Nazwa</th>
                    <th className="p-5 text-left">Cena</th>
                    <th className="p-5 text-left">Kategoria</th>
                    <th className="p-5 text-left">Ilość</th>
                    <th className="p-5 text-left">Ocena</th>
                    <th className="p-5 text-left">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: DataBaseProductType) => (
                    <tr key={product.slug} className="border-b">
                      <td className="p-5 ">{product._id.substring(20, 24)}</td>
                      <td className="p-5 ">{product.name}</td>
                      <td className="p-5 ">${product.price}</td>
                      <td className="p-5 ">{product.category}</td>
                      <td className="p-5 ">{product.countInStock}</td>
                      <td className="p-5 ">{product.rating}</td>
                      <td className="p-5 ">
                        <Link href={`/admin/product/${product._id}`}>Edytuj</Link>
                        &nbsp;
                        <button>Usuń</button>
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

AdminProdcutsScreen.auth = { adminOnly: true };
