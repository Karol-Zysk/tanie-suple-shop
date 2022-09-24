import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import { GetProductsActionKind, DataBaseUsersType } from '../../types';
import { getError } from '../../utils/error';

interface ListUsersAction {
  type: GetProductsActionKind;
  payload: any;
}

function reducer(state: any, action: ListUsersAction) {
  switch (action.type) {
    case GetProductsActionKind.FETCH_REQUEST:
      return { ...state, loading: true, error: '' };
    case GetProductsActionKind.FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload, error: '' };
    case GetProductsActionKind.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };

    case GetProductsActionKind.DELETE_REQUEST:
      return { ...state, loadingDelete: true };
    case GetProductsActionKind.DELETE_SUCCESS:
      return { ...state, loadingDelete: false, successDelete: true };
    case GetProductsActionKind.DELETE_FAIL:
      return { ...state, loadingDelete: false };
    case GetProductsActionKind.DELETE_RESET:
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
}

function AdminUsersScreen() {
  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({
          type: GetProductsActionKind.FETCH_REQUEST,
          payload: undefined
        });
        const { data } = await axios.get(`/api/admin/users`);
        dispatch({ type: GetProductsActionKind.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: GetProductsActionKind.FETCH_FAIL, payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({
        type: GetProductsActionKind.DELETE_RESET,
        payload: undefined
      });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const deleteHandler = async (userId:string) => {
    console.log(userId);
    
    if (!window.confirm('Are you sure?')) {
      
      return;
    }
    try {
      dispatch({
        type: GetProductsActionKind.DELETE_REQUEST,
        payload: undefined
      });
      await axios.delete(`/api/admin/users/${userId}`);
      dispatch({
        type: GetProductsActionKind.DELETE_SUCCESS,
        payload: undefined
      });
      toast.success('User deleted successfully');
    } catch (err) {
      dispatch({
        type: GetProductsActionKind.DELETE_FAIL,
        payload: undefined
      });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Users">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a className="font-bold">Users</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Users</h1>
          {loadingDelete && <div>Deleting...</div>}
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="p-5 text-left">NAME</th>
                    <th className="p-5 text-left">EMAIL</th>
                    <th className="p-5 text-left">ADMIN</th>
                    <th className="p-5 text-left">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user:DataBaseUsersType) => (
                    <tr key={user._id} className="border-b">
                      <td className="p-5 ">{user._id.substring(20, 24)}</td>
                      <td className="p-5 ">{user.name}</td>
                      <td className="p-5 ">{user.email}</td>
                      <td className="p-5 ">{user.isAdmin ? 'YES' : 'NO'}</td>
                      <td className="p-5 ">
                        <Link href={`/admin/user/${user._id}`} passHref>
                          <a type="button" className="default-button">
                            Edit
                          </a>
                        </Link>
                        &nbsp;
                        <button
                          type="button"
                          className="default-button"
                          onClick={() => deleteHandler(user._id)}
                        >
                          Delete
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

AdminUsersScreen.auth = { adminOnly: true };
export default AdminUsersScreen;