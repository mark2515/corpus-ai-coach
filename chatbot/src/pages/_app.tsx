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

const CLIENT_ID = "259222451841-qihg3qc04b6ir530ikqujc8s0i6pe2lo.apps.googleusercontent.com";

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };
  return (
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
  );
}