import { useLoaderData, Link } from "react-router";
import {
  AppProvider,
  Page,
  Layout,
  Card,
  Button,
  Text,
  BlockStack,
  ProgressBar,
  Checkbox,
  IndexTable,
  Badge,
  useIndexResourceState,
  InlineStack,
  Box
} from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";
import { useState } from "react";

// লোডার ফাংশন
export async function loader() {
  const bars = [
    {
      id: "1",
      title: "Winter Sale",
      lastModified: "2025-11-17",
      isScheduled: "Yes",
      type: "Running",
      status: "Active",
    },
    {
      id: "2",
      title: "Summer Sale",
      lastModified: "2025-11-17",
      isScheduled: "Yes",
      type: "Running",
      status: "Draft",
    },
  ];

  return { bars };
}

export default function Index() {
  const { bars } = useLoaderData();
  
  const [setupState, setSetupState] = useState({
    embed: true,
    create: false,
    confirm: false
  });

  const resourceName = { singular: 'bar', plural: 'bars' };
  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(bars);

  const rowMarkup = bars.map(
    ({ id, title, lastModified, isScheduled, type, status }, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">{title}</Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{lastModified}</IndexTable.Cell>
        <IndexTable.Cell>{isScheduled}</IndexTable.Cell>
        <IndexTable.Cell>{type}</IndexTable.Cell>
        <IndexTable.Cell>
          {status === "Active" ? (
            <Badge tone="success">Active</Badge>
          ) : (
            <Badge tone="attention">In Draft</Badge>
          )}
        </IndexTable.Cell>
        <IndexTable.Cell>
           {status === "Active" ? (
             <Button variant="primary" tone="critical" size="micro">Deactivate</Button>
           ) : (
             <Button variant="primary" size="micro">Activate Now</Button>
           )}
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <AppProvider i18n={enTranslations}>
      <style>
        {`
          .Polaris-Page {
            padding: 0 !important;
            padding-left: 100px !important;
            padding-right: 100px !important;
            max-width: 100% !important;
          }
          .Polaris-Layout {
            margin: 0 !important;
          }
          .Polaris-Layout__Section {
            padding: 0 !important;
          }
        `}
      </style>
      <Page
        title="Flexibar Dashboard"
        primaryAction={<Button>Share Your Thoughts!</Button>}
      >
        <BlockStack gap="500">
          
          {/* Setup Guide Section */}
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <BlockStack gap="200">
                    <Text variant="headingMd" as="h2">Setup Guide</Text>
                    <Text variant="bodySm" as="p" tone="subdued">
                      Use this guide to get your Flexibar App up and running.
                    </Text>
                  </BlockStack>

                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text variant="bodySm" fontWeight="bold">1/3 completed</Text>
                    </InlineStack>
                    <ProgressBar progress={33} tone="primary" />
                  </BlockStack>

                  <Box paddingBlockStart="200">
                    <BlockStack gap="200">
                       <Checkbox
                          label="Activate app embedding in your theme settings"
                          checked={setupState.embed}
                          disabled
                        />
                        <Checkbox
                          label="Create announcement bar"
                          checked={setupState.create}
                          onChange={(newChecked) => setSetupState({ ...setupState, create: newChecked })}
                        />
                        <Checkbox
                          label="Confirm if the announcement is visible"
                          checked={setupState.confirm}
                          onChange={(newChecked) => setSetupState({ ...setupState, confirm: newChecked })}
                        />
                    </BlockStack>
                  </Box>
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>

          {/* Button & Table Section */}
          <Layout>
            <Layout.Section>
              <BlockStack gap="400">
                
                <InlineStack>
                   <Link to="/app/createbar"> 
                      <Button variant="primary" icon="plus">Add New Bar</Button>
                   </Link>
                </InlineStack>

                <Card padding="0">
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={bars.length}
                    selectedItemsCount={
                      allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                      { title: 'Bar Title' },
                      { title: 'Last Modified' },
                      { title: 'Is Scheduled' },
                      { title: 'Type' },
                      { title: 'Status' },
                      { title: 'Action' },
                    ]}
                  >
                    {rowMarkup}
                  </IndexTable>
                </Card>

              </BlockStack>
            </Layout.Section>
          </Layout>

        </BlockStack>
      </Page>
    </AppProvider>
  );
}