import React, { useContext, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import CheckoutWizard from "../components/CheckoutWizard";
import Layout from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export default function ShippingScreen() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);

  const { cart } = state;
  const { shippingAddress } = cart;
  const router = useRouter();

  useEffect(() => {
    setValue("fullName", shippingAddress?.fullName);
    setValue("address", shippingAddress?.address);
    setValue("city", shippingAddress?.city);
    setValue("postalCode", shippingAddress?.postalCode);
    setValue("country", shippingAddress?.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({
    fullName,
    address,
    city,
    postalCode,
    country,
  }: FieldValues) => {
    dispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );

    router.push("/payment");
  };

  return (
    <Layout title="Shipping Address">
      <div className="flex-col w-full p-2 md:p-0">
        <CheckoutWizard activeStep={1} />
        <form
          className="max-w-screen-md mx-auto"
          onSubmit={handleSubmit(submitHandler)}
        >
          <h1 className="mb-4 text-xl">Adres Wysyłki</h1>
          <div className="mb-4">
            <label htmlFor="fullName">Imię i Nazwisko</label>
            <input
              type="text"
              className="w-full"
              id="fullName"
              autoFocus
              {...register("fullName", {
                required: "Please enter full name",
                minLength: 8,
                maxLength: 30,
              })}
            />
            {errors.fullName ? (
              <div className="text-red-500">Popraw pole: imię i nawisko</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label htmlFor="address">Addres</label>
            <input
              type="text"
              className="w-full"
              id="address"
              {...register("address", {
                required: "Please enter address",
                minLength: {
                  value: 6,
                  message: "Address is more than 2 chars",
                },
              })}
            />
            {errors.address && (
              <div className="text-red-500">Popraw pole: adres</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="city">Miasto</label>
            <input
              type="text"
              className="w-full"
              id="city"
              {...register("city", {
                required: "Please enter city",
                minLength: 4,
              })}
            />
            {errors.city && (
              <div className="text-red-500 ">Popraw pole: miasto</div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="postalCode">Kod Pocztowy</label>
            <input
              id="postalCode"
              type="text"
              className="w-full"
              {...register("postalCode", {
                required: "Please enter postal code",
                pattern: {
                  value: /^\d{2}[-]{0,1}\d{3}$/i,
                  message: "Proszę wpisać prawidłowy kod pocztowy",
                },
              })}
            />
            {errors.postalCode && (
              <div className="text-red-500 ">
                Popraw pole: kod-pocztowy. Poprawny format: 12-345
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="country">Kraj</label>
            <input
              className="w-full"
              id="country"
              {...register("country", {
                required: "Please enter country",
              })}
            />
            {errors.country && (
              <div className="text-red-500 ">Popraw pole: kraj</div>
            )}
          </div>
          <div className="flex justify-between mb-4">
            <button className="primary-button">Dalej</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

ShippingScreen.auth = true;
