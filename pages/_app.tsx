// boilerplate components
import {
  MantineProvider,
  ColorSchemeProvider,
  Global,
  ColorScheme,
  MantineTheme,
  MantineThemeOverride,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useHotkeys, useColorScheme } from "@mantine/hooks";
import SplashScreen from "components/SplashScreen";
import React, { useState } from "react";
import { useCookie } from "utils/utils";
import { AppProps } from "next/app";
import Layout from "layout";
import "i18n";
// I love boilerplate
export default function App({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useCookie<ColorScheme>(
    "colorScheme",
    preferredColorScheme,
    {}
  );

  function toggleColorScheme(value?: ColorScheme) {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  }

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  // long tasks should use useState(true)
  const [isLoading, setLoading] = useState(false);

  // override theme for Mantine (default props and styles)
  // https://mantine.dev/theming/mantine-provider/
  const theme: MantineThemeOverride = {
    colorScheme,
    loader: "oval",
    fontFamily: "Open Sans, sans serif",
    components: {
      Checkbox: {
        styles: { input: { cursor: "pointer" }, label: { cursor: "pointer" } },
      },
      TextInput: { styles: { label: { marginTop: "0.5rem" } } },
      Select: { styles: { label: { marginTop: "0.5rem" } } },
      Loader: { defaultProps: { size: "xl" } },
      Space: { defaultProps: { h: "sm" } },
      Anchor: { defaultProps: { target: "_blank" } },
    },
  };

  const styles = () => ({
    ".row": {
      display: "flex",
      alignItems: "flex-end",
      "& > div": {
        flexGrow: 1,
      },
    },
    ".rowCenter": {
      display: "flex",
      alignItems: "center",
      "& > div": {
        flexGrow: 1,
      },
    },
    ".embeddedInput": {
      display: "inline-block",
      margin: "auto 5px",
    },
  });

  return (
    <MantineProvider
      theme={theme}
      withGlobalStyles
      withNormalizeCSS
      withCSSVariables
    >
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <NotificationsProvider>
          <ModalsProvider>
            <Global styles={styles} />
            {/* show splashscreen for inital data */}
            {isLoading ? (
              <SplashScreen />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </ModalsProvider>
        </NotificationsProvider>
      </ColorSchemeProvider>
    </MantineProvider>
  );
}
