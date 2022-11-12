import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  ActionIcon,
  Group,
  Anchor,
  Button,
  Space,
  NavLink,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { IoSunnySharp } from "react-icons/io5";
import { BsMoonStarsFill } from "react-icons/bs";
import { ImCross } from "react-icons/im";
import React, {
  useState,
  useEffect,
  Fragment,
  Suspense,
  useMemo,
  useRef,
  ReactNode,
} from "react";
import { createStyles, useMantineTheme } from "@mantine/styles";

import { useTranslation } from "react-i18next";
import { useHotkeys } from "@mantine/hooks";
// talk to rust with
// import { invoke } from '@tauri-apps/api/tauri'

// local js files
import { useLocalForage } from "utils/utils";

// fallback for React Suspense
import Fallback from "components/Fallback";

// imported views need to be added to `views`

import Link from "next/link";
import { useRouter } from "next/router";
// import Home from './Views/Home';
// import About from './Views/About';
// import CIFInfo from './Views/CIFInfo';
// if your views are large, you can use lazy loading to reduce the initial load time
// const Settings = lazy(() => import('./Views/Settings'));

// constants
const HEADER_TITLE = "HEADER_TITLE goes here";
const FOOTER = "FOOTER goes here";
const defualtFooterSeen = {};
// TODO: footer fetched from online source
function Layout({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  // left sidebar
  const views = [
    //     {  path: '/home', name: t('Home') },
    //     {  path: '/cif-info', name: 'CIF ' + t('Info') },
    //     {  path: '/about', name: t('About') }
    { path: "/example-view", name: t("ExampleView") },
  ];

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  // opened is for mobile nav
  const [mobileNavOpened, setMobileNavOpened] = useState(false);
  // load preferences using localForage
  const [footersSeen, setFootersSeen, footersSeenLoading] =
    useLocalForage<object>("footersSeen", defualtFooterSeen);
  const lang = i18n.resolvedLanguage;

  // getAppStyles defined below App()
  const { classes } = getAppStyles();
  const [navbarClearance, setNavbarClearance] = useState(0);
  // const footerRef = useRef(null);
  // useEffect(() => {
  //   if (footerRef.current) setNavbarClearance(footerRef.current.clientHeight);
  // }, [footersSeen]);

  function LanguageHeaders() {
    const languages = i18n.options.resources;
    return (
      <>
        {languages &&
          Object.keys(languages).map((supportedLang, index) => (
            <Fragment key={index}>
              {/* language code is a link if not the current language */}
              {lang === supportedLang ? (
                <Text>{supportedLang.toUpperCase()}</Text>
              ) : (
                <Anchor onClick={() => i18n.changeLanguage(supportedLang)}>
                  {supportedLang.toUpperCase()}
                </Anchor>
              )}
              <Text>{index < Object.keys(languages).length - 1 && "|"}</Text>
            </Fragment>
          ))}
      </>
    );
  }

  function NavLinks() {
    const router = useRouter();

    return views.length ? (
      <>
        {views.map((view, index) => (
          <Link href={view.path} key={index}>
            <NavLink
              active={router.pathname === view.path}
              onClick={() => setMobileNavOpened(false)}
              label={view.name}
            ></NavLink>
          </Link>
        ))}
      </>
    ) : (
      <></>
    );
  }

  function shouldShowFooter() {
    return FOOTER && !footersSeenLoading && !(FOOTER in footersSeen);
  }

  function FooterText() {
    // footer output logic goes here
    // example: parse JSON output from online source
    return <>{t(FOOTER)}</>;
  }

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar
          height="100%"
          width={{ sm: 200 }}
          p="xs"
          hidden={!mobileNavOpened}
          hiddenBreakpoint="sm"
        >
          <Navbar.Section grow>
            <NavLinks />
          </Navbar.Section>
          <Navbar.Section>
            {/* Bottom of Navbar Example: https://github.com/mantinedev/mantine/blob/master/src/mantine-demos/src/demos/core/AppShell/_user.tsx */}
            <Space h={navbarClearance} /> {/* Acount for footer */}
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70} p="md" className={classes.header}>
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <Burger
              opened={mobileNavOpened}
              onClick={() => setMobileNavOpened((o) => !o)}
              size="sm"
              mr="xl"
              color={useMantineTheme().colors.gray[6]}
            />
          </MediaQuery>
          <Text>{HEADER_TITLE}</Text>
          <Group className={classes.headerRightItems}>
            <LanguageHeaders />
            <ActionIcon
              title="Ctrl + J"
              variant="default"
              onClick={() => toggleColorScheme()}
              size={30}
            >
              {/* icon to show based on colorScheme */}
              {colorScheme === "dark" ? (
                <IoSunnySharp size={"1.5em"} />
              ) : (
                <BsMoonStarsFill />
              )}
            </ActionIcon>
          </Group>
        </Header>
      }
      // aside={
      //   <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
      //     <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
      //       <Text>Right Side. Use for help or support menu?</Text>
      //     </Aside>
      //   </MediaQuery>
      // }
      footer={
        shouldShowFooter() ? (
          <Footer height={"fit-content"} p="xs" className={classes.footer}>
            <FooterText />
            <Button
              variant="subtle"
              size="xs"
              onClick={() =>
                setFootersSeen((prev) => ({ ...prev, [FOOTER]: "" }))
              }
            >
              <ImCross />
            </Button>
          </Footer>
        ) : (
          <></>
        )
      }
      className={classes.appShell}
    >
      <React.Suspense fallback={<Fallback />}>{children}</React.Suspense>
    </AppShell>
  );
}

// this can exported in styles.js
const getAppStyles = createStyles((theme) => ({
  navLink: {
    display: "block",
    width: "100%",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.md,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    textDecoration: "none",
    willChange: "transform",

    "&:hover:active": {
      transform: "translateY(2px)",
    },
  },
  navLinkActive: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
  },
  navLinkInactive: {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[1],
    },
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
  headerRightItems: {
    marginLeft: "auto",
  },
  appShell: {
    main: {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
  mediaQuery: {
    display: "none",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default Layout;
