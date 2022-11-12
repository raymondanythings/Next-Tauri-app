// import { currentMonitor } from "@tauri-apps/api";
// import { currentMonitor, getCurrent } from "@tauri-apps/api/window";
import Cookies from "js-cookie";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import localforage from "localforage";

export const RUNNING_IN_TAURI =
  typeof window !== "undefined" && window?.__TAURI__ !== undefined;

interface ICookieSet {
  sameSite?: "strict" | "Strict" | "lax" | "Lax" | "none" | "None";
  expires?: number;
  path?: string;
}

export function useCookie<T extends string>(
  key: string,
  defaultValue: T,
  { expires = 365000, sameSite = "lax", path = "/" }: Partial<ICookieSet>
) {
  const cookieValue = Cookies.get(key) as T;
  const state = useState(cookieValue || defaultValue);
  useEffect(() => {
    Cookies.set(key, state[0], { expires, sameSite, path });
  }, [expires, key, path, sameSite, state]);
  return state;
}

export function trueTypeOf(obj: object) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
  /*
        []              -> array
        {}              -> object
        ''              -> string
        new Date()      -> date
        1               -> number
        function () {}  -> function
        /test/i         -> regexp
        true            -> boolean
        null            -> null
        trueTypeOf()    -> undefined
    */
}

// export function useMinWidth(minWidth: number) {
//   async function resizeWindow() {
//     const physicalSize = await getCurrent().innerSize();
//     const monitor = await currentMonitor();
//     if (monitor) {
//       const scaleFactor = monitor.scaleFactor;
//       const logicalSize = physicalSize.toLogical(scaleFactor);
//       if (logicalSize.width < minWidth) {
//         logicalSize.width = minWidth;
//         await getCurrent().setSize(logicalSize);
//       }
//     }
//   }
//   useEffect(() => {
//     if (RUNNING_IN_TAURI) {
//       resizeWindow().catch(console.error);
//     }
//   }, []); // [] to ensure on first render
// }

export function useLocalForage<T extends object>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  // only supports primitives, arrays, and {} objects
  const [state, setState] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [allow, setAllow] = useState(true);

  const getItem = () => {
    localforage
      .getItem(key)
      .then((value) => {
        if (value === null) throw "";
        if (allow) setState(value as T);
      })
      .catch(() => localforage.setItem(key, defaultValue))
      .then(() => {
        if (allow) setLoading(false);
      });
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    getItem();
    return () => setAllow(false);
  }, []);

  useEffect(() => {
    if (!loading) localforage.setItem(key, state);
  }, [state]);
  return [state, setState, loading];
}

// notification example (different from mantine notification)
export function notify(title: string, body?: string) {
  new Notification(title, {
    body: body || "",
  });
}
