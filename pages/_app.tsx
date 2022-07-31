import { AppProps } from "next/app";
import Head from "next/head";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { Default as MainLayout } from "../layout/Default";
import { LRAuthProvider } from "loginradius-react";

import "../styles/globals.css";

export default function App(props: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "dark",
    getInitialValueInEffect: true,
  });
  const { Component, pageProps } = props;

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>ADS music quizz</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <LRAuthProvider
        appName="ads-music-quizz"
        apiKey={process.env.NEXT_PUBLIC_LOGINRADIUS_API_KEY!}
        redirectUri={"https://ads-music-quizz.vercel.app/"}
      >
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your mantine theme override here */
              colorScheme,
            }}
          >
            <NotificationsProvider position="top-left" autoClose={3000}>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </NotificationsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </LRAuthProvider>
    </>
  );
}
