import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AdminPanel from "../../../components/AdminPanel";
import Layout from "../../../components/Layout";
import { EditProductActionKind } from "../../../types";
import { getError } from "../../../utils/error";

function reducer(
  state: any,
  action: { type: EditProductActionKind; payload: "" | undefined }
) {
  switch (action.type) {
    case EditProductActionKind.FETCH_REQUEST:
      return { ...state, loading: true, error: "" };
    case EditProductActionKind.FETCH_SUCCESS:
      return { ...state, loading: false, error: "" };
    case EditProductActionKind.FETCH_FAIL:
      return { ...state, loading: false, error: action.payload };

    case EditProductActionKind.UPDATE_REQUEST:
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case EditProductActionKind.UPDATE_SUCCESS:
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case EditProductActionKind.UPDATE_FAIL:
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };

    case EditProductActionKind.UPLOAD_REQUEST:
      return { ...state, loadingUpload: true, errorUpload: "" };
    case EditProductActionKind.UPLOAD_SUCCESS:
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case EditProductActionKind.UPLOAD_FAIL:
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
}
export default function AdminProductEditScreen() {
  const { query } = useRouter();
  const productId = query.id;
  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({
          type: EditProductActionKind.FETCH_REQUEST,
          payload: "",
        });
        const { data } = await axios.get(`/api/admin/products/${productId}`);
        dispatch({
          type: EditProductActionKind.FETCH_SUCCESS,
          payload: "",
        });
        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("price", data.price);
        setValue("image", data.image);
        setValue("category", data.category);
        setValue("brand", data.brand);
        setValue("countInStock", data.countInStock);
        setValue("description", data.description);
      } catch (err) {
        dispatch({
          type: EditProductActionKind.FETCH_FAIL,
          payload: getError(err),
        });
      }
    };

    fetchData();
  }, [productId, setValue]);

  const router = useRouter();

  const uploadHandler = async (
    e: { target: { files: any } },
    imageField = "image"
  ) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
    try {
      dispatch({
        type: EditProductActionKind.UPLOAD_REQUEST,
        payload: undefined,
      });

      const {
        data: { signature, timestamp },
      } = await axios("/api/admin/cloudinary-sign");

      const file = e.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp); //@ts-ignore
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
      const { data } = await axios.post(url, formData);

      dispatch({
        type: EditProductActionKind.UPLOAD_SUCCESS,
        payload: undefined,
      });
      setValue(imageField, data.secure_url);
      toast.success("File uploaded successfully");
    } catch (err) {
      dispatch({
        type: EditProductActionKind.UPLOAD_FAIL,
        payload: getError(err),
      });
      toast.error(getError(err));
    }
  };

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    image,
    brand,
    countInStock,
    description,
  }: FieldValues) => {
    try {
      dispatch({
        type: EditProductActionKind.UPDATE_REQUEST,
        payload: undefined,
      });
      await axios.put(`/api/admin/products/${productId}`, {
        name,
        slug,
        price,
        category,
        image,
        brand,
        countInStock,
        description,
      });
      dispatch({
        type: EditProductActionKind.UPDATE_SUCCESS,
        payload: undefined,
      });
      toast.success("Product updated successfully");
      router.push("/admin/products");
    } catch (err) {
      dispatch({
        type: EditProductActionKind.UPDATE_FAIL,
        payload: getError(err),
      });
      toast.error(getError(err));
    }
  };

  return (
    <Layout title={`Edytuj Produkt ${productId}`}>
      <div className="grid md:grid-cols-4 md:gap-5">
      <AdminPanel/>
        <div className="md:col-span-3">
          {loading ? (
            <div>Chwileczkę...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="max-w-screen-md mx-auto"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">{`Edit Product ${productId}`}</h1>
              <div className="mb-4">
                <label htmlFor="name">Imię</label>
                <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register("name", {
                    required: "Please enter name",
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">Nieprawidłowa nazwa</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="slug">unikalny kod produktu</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register("slug", {
                    required: "proszę wpisać unikalny kod produktu",
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">kod produktu nieprawidłowy</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Cena</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register("price", {
                    required: "nieprawidłowa cena",
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">nieprawidłowa cena</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="image">Obraz</label>
                <input
                  type="text"
                  className="w-full"
                  id="image"
                  {...register("image", {
                    required: "proszę dodać nazwę",
                  })}
                />
                {errors.image && (
                  <div className="text-red-500">nieprawidłowa nazwa</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="imageFile">Dodaj zdjęcie</label>
                <input
                  type="file"
                  className="w-full"
                  id="imageFile"
                  onChange={uploadHandler}
                />

                {loadingUpload && <div>Dodawanie....</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Kategoria</label>
                <input
                  type="text"
                  className="w-full"
                  id="category"
                  {...register("category", {
                    required: "Please enter category",
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">nieprawidłowa kategoria</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">Producent</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register("brand", {
                    required: "Please enter brand",
                  })}
                />
                {errors.brand && (
                  <div className="text-red-500">nieprawidłowy producent</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">ilość w magazynie</label>
                <input
                  type="text"
                  className="w-full"
                  id="countInStock"
                  {...register("countInStock", {
                    required: "Please enter countInStock",
                  })}
                />
                {errors.countInStock && (
                  <div className="text-red-500">nieprawidłowe dane</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">Opis</label>
                <input
                  type="text"
                  className="w-full"
                  id="description"
                  {...register("description", {
                    required: "Please enter description",
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">popraw opis</div>
                )}
              </div>
              <div className="mb-4">
                <button disabled={loadingUpdate} className="primary-button">
                  {loadingUpdate ? "Loading" : "Update"}
                </button>
              </div>
              <div className="mb-4">
                <Link href={`/admin/products`}>Wstecz</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

AdminProductEditScreen.auth = { adminOnly: true };
