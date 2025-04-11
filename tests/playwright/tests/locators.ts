import test, { Locator, Page } from '@playwright/test';

function convertObjectValue<KEY extends string, V>(
  definition: {
    [K in KEY]: string;
  },
  f: (selector: string) => V
) {
  return Object.fromEntries(
    (Object.entries(definition) as [KEY, string][]).map((entry) => [
      entry[0],
      f(entry[1]),
    ])
  ) as {
      [K in KEY]: ReturnType<typeof f>;
    };
}

export const layout = (page: Page) =>
  convertObjectValue(
    {
      header: '.--header-pane',
      title: '.--title-pane',
      content: '.--content-pane',
    },
    (selector: string) => page.locator(selector)
  );

export const atom = (page: Page) =>
  convertObjectValue(
    {
      backButton: '.--atom_back-button',
    },
    (selector: string) => page.locator(selector)
  );
export const molecule = (page: Page) =>
  convertObjectValue(
    {
      dataTable: '.--molecule_data-table',
    },
    (selector: string) => page.locator(selector)
  );

async function headerTitles({
  table,
  hasParentHeader,
}: {
  table: Locator;
  hasParentHeader: boolean;
}) {
  return await table
    .locator('thead')
    .locator('tr')
    .nth(hasParentHeader ? 1 : 0)
    .locator('th')
    .allInnerTexts();
}

async function headerIndex({
  table,
  hasParentHeader,
  title,
}: {
  table: Locator;
  title: string;
  hasParentHeader: boolean;
}) {
  return (await headerTitles({ table, hasParentHeader })).findIndex(
    (t) => t === title
  );
}

export async function findCellByTitle({
  table,
  row,
  title,
  hasParentHeader,
}: {
  table: Locator;
  row: Locator;
  title: string;
  hasParentHeader: boolean;
}) {
  const index = await headerIndex({ table, title, hasParentHeader });
  if (index < 0) {
    test.fail();
  }
  return row.locator('td').nth(index);
}
