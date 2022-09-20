import axios from "axios";
import Link from "next/link";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import {
  DataBaseProductType,
  GetProductsActionKind,
} from "../../types";
import { useRouter } from "next/router";
import { getError } from "../../utils/error";
import { toast } from "react-toastify";

interface PayAction {
  type: GetProductsActionKind;
  payload: any;
}

function reducer(state: any, action: PayAction) {
  switch (action.type) {
    case GetProductsActionKind.FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case GetProductsActionKind.FETCH_SUCCESS:
      return { ...state, loading: false, products: action.payload, error: "" };
    case GetProductsActionKind.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case GetProductsActionKind.CREATE_REQUEST:
      return { ...state, loadingCreate: true };
    case GetProductsActionKind.CREATE_SUCCESS:
      return { ...state, loadingCreate: false };
    case GetProductsActionKind.CREATE_FAIL:
      return { ...state, loadingCreate: false };
    case GetProductsActionKind.DELETE_REQUEST:
      return { ...state, loadingDelete: true };
    case GetProductsActionKind.DELETE_SUCCESS:
      return { ...state, loadingDelete: false, successDelete: true };
    case GetProductsActionKind.DELETE_FAIL:
      return { ...state, loadingDelete: false };
    case GetProductsActionKind.DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}
export default function AdminProdcutsScreen() {
  const router = useRouter();

  const [
    { loading, error, products, loadingCreate, successDelete, loadingDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  const createHandler = async () => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({
        type: GetProductsActionKind.CREATE_REQUEST,
        payload: undefined,
      });
      const { data } = await axios.post(`/api/admin/products`);
      dispatch({
        type: GetProductsActionKind.CREATE_SUCCESS,
        payload: undefined,
      });
      toast.success("Product created successfully");
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({
        type: GetProductsActionKind.CREATE_FAIL,
        payload: undefined,
      });
      toast.error(getError(err));
    }
  };

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

    if (successDelete) {
      dispatch({
        type: GetProductsActionKind.DELETE_RESET,
        payload: undefined,
      });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (productId: DataBaseProductType) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({
        type: GetProductsActionKind.DELETE_REQUEST,
        payload: undefined,
      });
      await axios.delete(`/api/admin/products/${productId}`);
      dispatch({
        type: GetProductsActionKind.DELETE_SUCCESS,
        payload: undefined,
      });
      toast.success("Pomylnie usuniéto");
    } catch (err) {
      dispatch({
        type: GetProductsActionKind.DELETE_FAIL,
        payload: undefined,
      });
      toast.error(getError(err));
    }
  };
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
        <div className="flex justify-between">
            <h1 className="mb-4 text-xl">Produkty</h1>
            {loadingDelete && <div>Usuwanie...</div>}
            <button
              disabled={loadingCreate}
              onClick={createHandler}
              className="primary-button"
            >
              {loadingCreate ? 'Loading' : 'Create'}
            </button>
          </div>
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
                        <Link href={`/admin/product/${product._id}`}>
                          <a type="button" className="default-button">
                            Edytuj
                          </a>
                        </Link>
                        &nbsp;
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="default-button"
                          type="button"
                        >
                          Usuń
                        </button>
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
