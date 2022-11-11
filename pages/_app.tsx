import type { AppProps } from "next/app";

import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  ActionIcon,
  MantineProvider,
  NavLink,
  Anchor,
  Group,
} from "@mantine/core";
import { SunIcon, MoonIcon } from "@modulz/radix-icons";
import { createStyles, useMantineTheme } from "@mantine/core";
import React, { Fragment, useEffect, useState } from "react";
import { ColorScheme } from "../types/common.types";
import Link from "next/link";
import { useRouter } from "next/router";
import { defaultLng, translations } from "../i18n";
import { useTranslation } from "react-i18next";

function getItem<T extends string>(
  key: string,
  stateSetter: React.Dispatch<React.SetStateAction<any>>,
  defaultValue: T
) {
  const item = localStorage.getItem(key);
  stateSetter(item);
  localStorage.setItem(key, defaultValue);
}

export default function App({ Component, pageProps }: AppProps) {
  const { t, i18n } = useTranslation();

  const [mobileNavOpened, setMobileNavOpened] = useState(false);
  const defaultColorScheme = "dark";
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(defaultColorScheme);
  const [lang, setLang] = useState(i18n.resolvedLanguage);

  const router = useRouter();
  const views = [
    {
      path: "/",
      name: t("Home"),
    },
    {
      path: "/settings",
      name: t("Settings"),
    },
    {
      path: "/cif-info",
      name: t("CIF Info"),
    },
    {
      path: "/about",
      name: t("About"),
    },
  ];

  const toggleColorScheme = (value?: ColorScheme) => {
    const themeColor = value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(themeColor);
    localStorage.setItem("colorScheme", themeColor);
  };

  const useStyles = createStyles((theme) => ({
    navLink: {
      display: "block",
      width: "100%",
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
      textDecoration: "none",
      willChange: "transform",

      "&:hover:active": {
        transform: "translateY(2px)",
      },
    },
    navLinkActive: {
      backgroundColor:
        colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1],
    },
    headerRightItems: {
      marginLeft: "auto",
    },
  }));

  const { classes } = useStyles();

  function LanguageHeaders() {
    return (
      <>
        {Object.keys(translations).map((supportedLang, index) => (
          <>
            {lang === supportedLang ? (
              <Text>{supportedLang.toUpperCase()}</Text>
            ) : (
              <Anchor onClick={() => setLang(supportedLang)}>
                {supportedLang.toUpperCase()}
              </Anchor>
            )}
            <Text>{index < Object.keys(translations).length - 1 && "|"}</Text>
          </>
        ))}
      </>
    );
  }

  useEffect(() => {
    getItem("colorScheme", setColorScheme, defaultColorScheme);
    getItem("lang", setLang, defaultLng);
  }, []);

  useEffect(() => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <MantineProvider
      theme={{ colorScheme: colorScheme, fontFamily: "Open Sans, sans self" }}
      withGlobalStyles
    >
      <AppShell
        padding="sm"
        navbarOffsetBreakpoint="sm"
        fixed
        navbar={
          <Navbar
            width={{ sm: 200 }}
            hidden={!mobileNavOpened}
            hiddenBreakpoint="sm"
            p="sm"
          >
            {views.map((view, index) => (
              <Link href={view.path} key={index}>
                <NavLink
                  active={router.pathname === view.path}
                  onClick={() => setMobileNavOpened(false)}
                  label={view.name}
                ></NavLink>
              </Link>
            ))}
          </Navbar>
        }
        header={
          <Header height={70} p="sm">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={mobileNavOpened}
                  onClick={() => setMobileNavOpened((prev) => !prev)}
                  size="sm"
                  color={useMantineTheme().colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>
              <Text>HEADER SECTION</Text>
              <Group className={classes.headerRightItems}>
                <LanguageHeaders />
                <ActionIcon
                  variant="default"
                  onClick={() => toggleColorScheme()}
                  size={30}
                >
                  {colorScheme === "dark" ? <SunIcon /> : <MoonIcon />}
                </ActionIcon>
              </Group>
            </div>
          </Header>
        }
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        <Component {...pageProps} />
      </AppShell>
    </MantineProvider>
  );
}
