import type { Session } from "next-auth/client";
import type { AppProps } from "next/app";
import type { ReactNode } from "react";

declare module "next/app" {
  interface CustomAppProps extends AppProps {
    pageProps: {
      children: ReactNode
      session: Session;
    }
  }
}