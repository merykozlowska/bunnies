import type { MetaFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

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

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Snowball vs Fluffy",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
