import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
} from "react-router";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";

function AppBridgeLink({ url, children, external, ...rest }) {
  const IS_EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
  if (external || IS_EXTERNAL_LINK_REGEX.test(url)) {
    return (
      <a target="_blank" rel="noopener noreferrer" href={url} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={url} {...rest}>
      {children}
    </Link>
  );
}

export async function loader({ request }) {
  return { apiKey: process.env.SHOPIFY_API_KEY };
}

export default function App() {
  const { apiKey } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider
          i18n={enTranslations}
          linkComponent={AppBridgeLink}
        >
          <Outlet />
        </AppProvider>
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}