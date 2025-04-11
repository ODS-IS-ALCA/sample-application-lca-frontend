import { Page } from '@playwright/test';
import { randomUUID } from 'crypto';
export function getUUIDName(prefix: string, originalName: string): string {
  const surffix_uuid = '-' + randomUUID().slice(0, 13);
  return prefix + originalName + surffix_uuid;
}

export async function getTableIndex(
  page: Page,
  target: string,
  PageClass?: any
): Promise<number> {
  const find = async () => {
    const rowsText = await page
      .locator('//table//tbody//tr')
      .locator(':scope')
      .allInnerTexts();
    const index = rowsText.findIndex((text) => text.includes(target));
    return index;
  };

  // 入力画面はreloadすると入力内容が消えるのでwaitをundefinedに指定する。
  const reload = async () => {
    await page.reload();
    await new PageClass(page).expectToBeLoaded();
  };

  const maxWaitNum = 2;
  let waitNum = 0;
  let index = await find();
  while (index === -1) {
    if (waitNum % maxWaitNum === 0 && PageClass !== undefined) {
      await reload();
    }
    await page.waitForTimeout(5000);
    index = await find();
    waitNum += 1;
  }
  return index;
}
