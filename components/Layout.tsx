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

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const { state, dispatch } = useContext(Store);
  const [state2, setState] = useState(true);
  const { cart } = state;
  const { status, data: session } = useSession();

  useEffect(() => {
    if (session?.user?.isAdmin) setState(true);
    else setState(false);
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
      <Head>
        <ToastContainer position="bottom-center" limit={1} />
        <title>{title ? title + " - TanieSuple" : "TanieSuple"}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-between min-h-screen border-2 ">
        <header>
          <nav className="flex items-center justify-between h-24 px-4 border shadow-md">
            <Link href="/">
              <a className="text-5xl font-bold">TanieSuple</a>
            </Link>
            <div className="flex items-center">
              <div className="flex items-center p-2 border-2">
                {" "}
                <AiOutlineShoppingCart className="text-2xl text-blue-500" />
                <Link href="/cart">
                  <a className="p-2">
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
                  <div className="flex items-center p-2 ml-1 border-2">
                    <Menu as="div" className="relative z-20 inline-block ">
                      <Menu.Button className="flex items-center p-2 text-blue-600">
                        {session.user.name}{" "}
                        <AiOutlineUser className="text-2xl text-blue-500 " />
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
                        {state2 && (
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
                <div className="flex items-center p-2 ml-1 border-2">
                  <AiOutlineUser className="text-2xl text-blue-500" />
                  <Link href="/login">
                    <a className="p-2">Zaloguj się</a>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </header>
        <main className="container flex px-4 m-auto mt-4">{children}</main>
        <footer className="flex items-center justify-center h-10 shadow-inner">
          footer
        </footer>
      </div>
    </>
  );
};

export default Layout;
