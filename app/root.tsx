import type { MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { useMemo } from "react";

import { SessionContext } from "~/components/sessionContext/sessionContext";
import { useWebSocket } from "~/components/useWebSocket/useWebSocket";
import type { Session } from "~/model/session";
import fonts from "~/styles/fonts.css";
import main from "~/styles/main.css";
import reset from "~/styles/reset.css";

export function links() {
  return [
    { rel: "stylesheet", href: reset },
    { rel: "stylesheet", href: fonts },
    { rel: "stylesheet", href: main },
    { rel: "preload", href: "/resources/grass.png", as: "image" },
    { rel: "preload", href: "/resources/bunny_1_1.png", as: "image" },
    { rel: "preload", href: "/resources/bunny_1_2.png", as: "image" },
    { rel: "preload", href: "/resources/bunny_2_1.png", as: "image" },
    { rel: "preload", href: "/resources/bunny_2_2.png", as: "image" },
    {
      rel: "preload",
      href: "/fonts/Cave-Story.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    { rel: "icon", href: "/favicon.png", type: "image/png" },
  ];
}

const title = "snowball vs fluffy";
const description =
  "Help either snowball or fluffy in the battle to determine the bunniest of them all.";
const image = "https://snowball-vs-fluffy.pages.dev/social/ogImage.png";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title,
  description,
  "og:title": title,
  "og:description": description,
  "og:image": image,
  "og:url": "https://snowball-vs-fluffy.pages.dev/",
  "twitter:title": title,
  "twitter:description": description,
  "twitter:image": image,
  "twitter:card": "summary_large_image",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const ws = useWebSocket();
  const session: Session = useMemo(() => ({ ws }), [ws]);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <SessionContext.Provider value={session}>
          <Outlet />
        </SessionContext.Provider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
