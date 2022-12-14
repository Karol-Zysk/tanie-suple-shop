import axios from "axios";
import Link from "next/link";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import React, { useEffect, useReducer } from "react";
import Layout from "../../components/Layout";
import { getError } from "../../utils/error";
import AdminPanel from "../../components/AdminPanel";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

function reducer(state: any, action: { type: any; payload: any }) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
function AdminDashboardScreen() {
  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({
          type: "FETCH_REQUEST",
          payload: undefined,
        });
        const { data } = await axios.get(`/api/admin/summary`);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: summary.salesData.map((x: { _id: any }) => x._id), 
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgba(162, 222, 208, 1)",
        data: summary.salesData.map(
          (x: { totalSales: number }) => x.totalSales
        ),
      },
    ],
  };
  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
      <AdminPanel/>
        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl">Panel Admina</h1>
          {loading ? (
            <div>Chwileczk??...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="p-5 m-5 card">
                  <p className="text-3xl">{summary.ordersPrice}z?? </p>
                  <p>Sprzeda??e</p>
                  <Link href="/admin/orders">Zobacz sprzda??e</Link>
                </div>
                <div className="p-5 m-5 card">
                  <p className="text-3xl">{summary.ordersCount} </p>
                  <p>Zam??wienia</p>
                  <Link href="/admin/orders">Zobacz zam??wienia</Link>
                </div>
                <div className="p-5 m-5 card">
                  <p className="text-3xl">{summary.productsCount} </p>
                  <p>Produkty</p>
                  <Link href="/admin/products">Zobacz produkty</Link>
                </div>
                <div className="p-5 m-5 card">
                  <p className="text-3xl">{summary.usersCount} </p>
                  <p>U??ytkownicy</p>
                  <Link href="/admin/users">Zobacz u??ytkownik??w</Link>
                </div>
              </div>
              <h2 className="text-xl">raport sprzeda??y</h2>
              <Bar options={{}} data={data} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminDashboardScreen.auth = { adminOnly: true };
export default AdminDashboardScreen;
