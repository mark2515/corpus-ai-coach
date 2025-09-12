import "@/styles/globals.css";
import { useState, useEffect } from "react";
import type { AppProps } from "next/app";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import store from "../store";
import { getLocal, setLocal } from "../utils/storage";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const THEME_STORAGE_KEY = "mantine_color_scheme";

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");

  useEffect(() => {
    const savedColorScheme = getLocal<ColorScheme>(THEME_STORAGE_KEY);
    if (savedColorScheme && (savedColorScheme === "light" || savedColorScheme === "dark")) {
      setColorScheme(savedColorScheme);
    }
  }, []);

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(newColorScheme);
    setLocal(THEME_STORAGE_KEY, newColorScheme);
  };

  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <ColorSchemeProvider
          colorScheme={colorScheme}
          toggleColorScheme={toggleColorScheme}
        >
          <MantineProvider
            theme={{ colorScheme, primaryColor: "green" }}
            withNormalizeCSS
            withGlobalStyles
          >
            <Notifications position="top-right" zIndex={2077}></Notifications>
            <Component {...pageProps} />
          </MantineProvider>
        </ColorSchemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}