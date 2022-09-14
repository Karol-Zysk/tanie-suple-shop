import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import Layout from "../components/Layout";

export default function ProfileScreen() {
  const { data: session } = useSession();

  const {
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("name", session?.user?.name);
    setValue("email", session?.user?.email);
  }, [session, setValue]);

  const submitHandler = async ({ name, email, password }: FieldValues) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("Profile updated successfully");
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Profile">
      <form className="max-w-screen-md mx-auto">
        <h1 className="mb-4 text-xl">Aktualizuj Profil</h1>

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
          {errors.name && <div className="text-red-500">error imię</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: "Please enter valid email",
              },
            })}
          />
          {errors.email && <div className="text-red-500">błąd email</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Hasło</label>
          <input
            className="w-full"
            type="password"
            id="password"
            {...register("password", {
              minLength: { value: 6, message: "password is more than 5 chars" },
            })}
          />
          {errors.password && <div className="text-red-500 ">error hasło</div>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Potwierdź Hasło</label>
          <input
            className="w-full"
            type="password"
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 6,
                message: "confirm password is more than 5 chars",
              },
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500 ">error potwierdz hasło</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className="text-red-500 ">Hasła nie są zgodne</div>
            )}
        </div>
        <div className="mb-4">
          <button onClick={submitHandler} className="primary-button">
            Aktualizuj Profil
          </button>
        </div>
      </form>
    </Layout>
  );
}

ProfileScreen.auth = true;
