import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useReducer } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import { PayActionKind, DataBaseProductType } from "../../types";
import { getError } from "../../utils/error";
import {
  OnApproveData,
  OnApproveActions,
  CreateOrderActions,
  CreateOrderData,
} from "@paypal/paypal-js/types";

interface PayAction {
  type: PayActionKind;
  payload: any;
}

function reducer(state: any, action: PayAction) {
  switch (action.type) {
    case PayActionKind.FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case PayActionKind.FETCH_SUCCESS:
      return { ...state, loading: false, order: action.payload, error: "" };
    case PayActionKind.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };
    case PayActionKind.PAY_REQUEST:
      return { ...state, loadingPay: true };
    case PayActionKind.PAY_SUCCESS:
      return { ...state, loadingPay: false, successPay: true };
    case PayActionKind.PAY_FAIL:
      return { ...state, loadingPay: false, errorPay: action.payload };
    case PayActionKind.PAY_RESET:
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };

    default:
      state;
  }
}
function OrderScreen() {
  // order/:id
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: session } = useSession();
  const { query } = useRouter();
  const orderId = query.id;

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({
          type: PayActionKind.FETCH_REQUEST,
          payload: "",
        });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: PayActionKind.FETCH_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: PayActionKind.FETCH_FAIL, payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({
          type: PayActionKind.PAY_RESET,
          payload: "",
        });
      }
      if (successDeliver) {
        dispatch({
          type: PayActionKind.DELIVER_RESET,
          payload: "",
        });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal");
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "PLN",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      loadPaypalScript();
    }
  }, [order, orderId, paypalDispatch, successDeliver, successPay]);
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

  function createOrder(data: CreateOrderData, actions: CreateOrderActions) {
    return actions.order

      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID: any) => {
        return orderID;
      });
  }

  function onApprove(data: OnApproveData, actions: OnApproveActions) {
    return (
      actions.order &&
      actions.order.capture().then(async function (details) {
        try {
          dispatch({
            type: PayActionKind.PAY_REQUEST,
            payload: undefined,
          });
          const { data } = await axios.put(
            `/api/orders/${order._id}/pay`,
            details
          );
          dispatch({ type: PayActionKind.PAY_SUCCESS, payload: data });
          toast.success("Order is paid successgully");
        } catch (err) {
          dispatch({ type: PayActionKind.PAY_FAIL, payload: getError(err) });
          toast.error(getError(err));
        }
      })
    );
  }
  function onError(err: any) {
    toast.error(getError(err));
  }

  async function deliverOrderHandler() {
    try {
      dispatch({
        type: PayActionKind.DELIVER_FAIL,
        payload: undefined,
      });
      const { data } = await axios.put(
        `/api/admin/orders/${order._id}/deliver`,
        {}
      );
      dispatch({ type: PayActionKind.DELIVER_SUCCESS, payload: data });
      toast.success("Order is delivered");
    } catch (err) {
      dispatch({ type: PayActionKind.DELIVER_FAIL, payload: getError(err) });
      toast.error(getError(err));
    }
  }

  return (
    <Layout title={`Zamówienie id ${orderId}`}>
      <div className="flex-col w-full p-2 md:p-0">
        <h1 className="mb-4 text-xl">{`zamówienie id ${orderId}`}</h1>
        {loading ? (
          <div>Chwileczkę...</div>
        ) : error ? (
          <div className="alert-error">{error}</div>
        ) : (
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
              <div className="p-2 md:p-5 card bg-white">
                <h2 className="w-full mb-2 font-semibold text-center md:text-lg text:base ">
                  Adres dostawy
                </h2>
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

              <div className="p-2 md:p-5 card">
                <h2 className="w-full mb-2 font-semibold text-center md:text-lg text:base ">
                  Metoda płatności
                </h2>
                <div>{paymentMethod}</div>
                {isPaid ? (
                  <div className="alert-success">Opłacono {paidAt}</div>
                ) : (
                  <div className="alert-error">Nie opłacono</div>
                )}
              </div>

              <div className="p-2 overflow-x-auto md:p-5 card">
                <h2 className="w-full mb-2 font-semibold text-center md:text-lg text:base ">
                  Zamawiam
                </h2>
                <table className="min-w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-5 text-left">Produkt</th>
                      <th className="p-2 text-right md:p-5">Ilość</th>
                      <th className="p-2 text-right md:p-5">Cena</th>
                      <th className="p-2 text-right md:p-5">Suma</th>
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
                        <td className="p-2 text-right md:p-5">
                          {item.quantity}
                        </td>
                        <td className="p-2 text-right md:p-5">${item.price}</td>
                        <td className="p-2 text-right md:p-5">
                          {item.quantity && item.quantity * item.price}zł
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="p-2 md:p-5 card">
                <h2 className="w-full mb-2 font-semibold text-center md:text-lg text:base ">
                  Podsumowanie
                </h2>
                <ul>
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Produkty</div>
                      <div>${itemsPrice}</div>
                    </div>
                  </li>{" "}
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Vat</div>
                      <div>{taxPrice}zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Dostawa</div>
                      <div>{shippingPrice}zł</div>
                    </div>
                  </li>
                  <li>
                    <div className="flex justify-between mb-2">
                      <div>Suma</div>
                      <div>{totalPrice}zł</div>
                    </div>
                  </li>
                  {!isPaid && (
                    <li>
                      {isPending ? (
                        <div>Loading...</div>
                      ) : (
                        <div className="w-full">
                          <PayPalButtons
                            key={"name"}
                            createOrder={createOrder} //@ts-ignore
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        </div>
                      )}
                      {loadingPay && <div>Chwileczkę...</div>}
                    </li>
                  )}
                  {session?.user?.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <li>
                        {loadingDeliver && <div>Loading...</div>}
                        <button
                          className="w-full primary-button"
                          onClick={deliverOrderHandler}
                        >
                          Złóż zamówieni
                        </button>
                      </li>
                    )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

OrderScreen.auth = true;
export default OrderScreen;
