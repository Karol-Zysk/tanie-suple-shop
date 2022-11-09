import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { ToastContainer } from "react-toastify";
import { Menu } from "@headlessui/react";
import "react-toastify/dist/ReactToastify.css";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Store } from "../utils/Store";
import DropdownLink from "./DropdownLink";
import { AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";

declare module "next-auth" {
  interface User {
    isAdmin: boolean;
  }

  export interface Session {
    user: User;
  }
}

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { state, dispatch } = useContext(Store);
  const [isSession, setIsSession] = useState(true);
  const { cart } = state;
  const { status, data: session } = useSession();

  useEffect(() => {
    if (session?.user?.isAdmin) setIsSession(true);
    else setIsSession(false);
  }, [session]);

  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(
      cart.cartItems.reduce(
        (a: number, c: { quantity: number }) => a + c.quantity,
        0
      )
    );
  }, [cart.cartItems, cartItemsCount]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      {" "}
      <ToastContainer position="bottom-center" limit={1} />
      <Head>
        <title>{title ? title + " - TanieSuple" : "TanieSuple"}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-between min-h-screen bg-slate-400 ">
        <header>
          <nav className="flex items-center justify-between h-24 px-2 bg-gray-800 border-2 shadow-md xs:px-5">
            <Link href="/">
              <a className="text-xl font-bold sm:text-3xl md:text-5xl">
                TanieSuple
              </a>
            </Link>
            <div className="flex items-center">
              <div className="flex items-center p-1 border-2 rounded-lg md:p-2">
                {" "}
                <AiOutlineShoppingCart className="text-blue-500 text-md md:text-xl" />
                <Link href="/cart">
                  <a className="p-1 text-xs md:text-lg md:p-2">
                    Koszyk
                    {cartItemsCount > 0 && (
                      <span className="px-2 py-1 ml-1 text-xs font-bold text-white bg-red-600 rounded-full">
                        {cartItemsCount}
                      </span>
                    )}
                  </a>
                </Link>
              </div>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <>
                  <div className="flex items-center p-1 ml-1 border-2 rounded-lg md:p-2">
                    <Menu as="div" className="relative z-20 inline-block ">
                      <Menu.Button className="flex items-center p-1 text-xs text-blue-600 md:text-lg md:p-2">
                        <AiOutlineUser className="p-0 mr-1 text-blue-500 scale-150 " />
                        {session.user.name}{" "}
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg ">
                        <Menu.Item>
                          <DropdownLink
                            className="dropdown-link"
                            href="/profile"
                          >
                            Profil
                          </DropdownLink>
                        </Menu.Item>
                        <Menu.Item>
                          <DropdownLink
                            className="dropdown-link"
                            href="/order-history"
                          >
                            Historia Zamówień
                          </DropdownLink>
                        </Menu.Item>
                        {isSession && (
                          <Menu.Item>
                            <DropdownLink
                              className="dropdown-link"
                              href="/admin/dashboard"
                            >
                              Panel Admina
                            </DropdownLink>
                          </Menu.Item>
                        )}
                        <Menu.Item>
                          <a
                            className="dropdown-link"
                            href="#"
                            onClick={logoutClickHandler}
                          >
                            Wyloguj
                          </a>
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </>
              ) : (
                <div className="relative flex items-center p-1 ml-1 border-2 rounded-lg md:p-2">
                  <AiOutlineUser className="text-lg text-blue-500 md:text-2xl" />
                  <Link href="/login">
                    <a className="p-1 text-xs md:text-lg md:p-2">Zaloguj się</a>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </header>
        <main className="container flex px-4 m-auto mt-4">{children}</main>
        <footer className="flex items-center justify-end p-4 mt-8 text-white bg-gray-800 border-t-4 shadow-inner h-14">
          <p className="text-xl font-semibold">Tanie-Suple.com</p>
        </footer>
      </div>
    </>
  );
};

export default Layout;
