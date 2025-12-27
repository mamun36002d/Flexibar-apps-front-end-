// app/routes/app.save-bar-settings.jsx

import { data } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

// POST - Save bar settings
export async function action({ request }) {
  try {
    const { admin, session } = await authenticate.admin(request);
    const formData = await request.formData();
    const dataString = formData.get("data");

    if (!dataString) {
      return data({ success: false, error: "No data provided" }, { status: 400 });
    }

    // Validate JSON
    let parsedData;
    try {
      parsedData = JSON.parse(dataString);
    } catch (e) {
      return data({ success: false, error: "Invalid JSON data" }, { status: 400 });
    }

    console.log("📦 Saving Flexibar settings for shop:", session.shop);

    // Step 1: Save to Database (Prisma)
    await db.flexibarSettings.upsert({
      where: { shop: session.shop },
      update: {
        configuration: dataString,
        updatedAt: new Date(),
      },
      create: {
        shop: session.shop,
        configuration: dataString,
      },
    });

    console.log("✅ Saved to database");

    // Step 2: Get Shop GID for metafield
    const shopResponse = await admin.graphql(`
      query {
        shop {
          id
        }
      }
    `);

    const shopData = await shopResponse.json();
    const shopGid = shopData.data.shop.id;

    console.log("🏪 Shop GID:", shopGid);

    // Step 3: Save to Metafield
    const metafieldResponse = await admin.graphql(
      `#graphql
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              namespace: "flexibar",
              key: "settings",
              type: "json",
              value: dataString,
              ownerId: shopGid,
            },
          ],
        },
      }
    );

    const metafieldData = await metafieldResponse.json();

    if (metafieldData.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error("❌ Metafield errors:", metafieldData.data.metafieldsSet.userErrors);
      return data({
        success: false,
        error: metafieldData.data.metafieldsSet.userErrors[0].message,
      });
    }

    console.log("✅ Saved to metafield");

    return data({
      success: true,
      message: "Flexibar settings saved successfully!",
      metafieldId: metafieldData.data?.metafieldsSet?.metafields?.[0]?.id,
    });

  } catch (error) {
    console.error("❌ Save Error:", error);
    return data({
      success: false,
      error: error.message || "Unknown error occurred",
    }, { status: 500 });
  }
}

// GET - Load saved settings (optional)
export async function loader({ request }) {
  try {
    const { session } = await authenticate.admin(request);

    const settings = await db.flexibarSettings.findUnique({
      where: { shop: session.shop },
    });

    if (settings) {
      return data({
        success: true,
        data: JSON.parse(settings.configuration),
      });
    }

    return data({ success: true, data: null });

  } catch (error) {
    console.error("Load Error:", error);
    return data({ success: false, error: error.message }, { status: 500 });
  }
}