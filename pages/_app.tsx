import "../styles/globals.css";
import type { AppProps } from "next/app";
import { StoreProvider } from "../utils/Store";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NextPageContext } from "next";

export interface MyPageContext extends NextPageContext {
  auth: any;
}

function MyApp({ Component, pageProps: { session, pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {
          //@ts-ignore
          Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )
        }
      </StoreProvider>
    </SessionProvider>
  );
}

export default MyApp;

function Auth({ children }: any) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });
  console.log(status);
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
