import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { getError } from "../utils/error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import axios from "axios";
import { FormValues } from "../types";

export default function LoginScreen() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      //@ts-ignore
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm<FormValues>();
  const submitHandler = async ({ name, email, password }: FormValues) => {
    try {
      await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create Account">
      <form
        className="max-w-screen-md mx-auto"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Utwórz Konto</h1>
        <div className="mb-4">
          <label htmlFor="name">Imię</label>
          <input
            type="text"
            minLength={3}
            maxLength={12}
            className="w-full"
            placeholder="Jan"
            id="name"
            autoFocus
            {...register("name", {
              required: "Proszę wpisać imię",
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Proszę wpisać email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Proszę wpisać prawidłowy email",
              },
            })}
            className="w-full"
            placeholder="example@example.com"
            id="email"
          ></input>
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Hasło</label>
          <input
            type="password"
            {...register("password", {
              required: "Proszę wpisać hasło",
              minLength: {
                value: 6,
                message: "hasło powinno mieć powyżej 5 znaków",
              },
            })}
            className="w-full"
            id="password"
            placeholder="*********"
            autoFocus
          ></input>
          {errors.password && (
            <div className="text-red-500 ">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword">Potwierdź hasło</label>
          <input
            className="w-full"
            type="password"
            placeholder="*********"
            id="confirmPassword"
            {...register("confirmPassword", {
              required: "Proszę powtórzyć hasło",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "hasło powinno mieć powyżej 5 znaków",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">Hasła się nie zgadzają</div>
            )}
        </div>

        <div className="mb-4 ">
          <button className="primary-button">Zarejestruj</button>
        </div>
        <div className="mb-4 ">
          Nie masz konta ?
          <Link href={`/register?redirect=${redirect || "/"}`}>
            Rejestracja
          </Link>
        </div>
      </form>
    </Layout>
  );
}
