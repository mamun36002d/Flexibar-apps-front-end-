import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link, // Link ইম্পোর্ট করা হয়েছে
} from "react-router";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";

// Polaris এর লিঙ্ক হ্যান্ডলিং এর জন্য এই ফাংশনটি জরুরি
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

// এই লোডারটি দরকার যাতে শপিফাই এর API Key ক্লায়েন্ট সাইডে পাওয়া যায়
export async function loader({ request }) {
  // এখানে আপনার authentication চেক বা এনভায়রনমেন্ট ভেরিয়েবল রিটার্ন করতে পারেন
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
          linkComponent={AppBridgeLink} // Polaris কে লিঙ্ক চিনিয়ে দেওয়া হলো
        >
          <Outlet />
        </AppProvider>
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}