import "@/styles/globals.css";
import { useState } from "react";
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

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
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