import { type Page, type Locator, expect } from '@playwright/test';
import { PartsBase } from './base';
import { findCellByTitle } from '../../locators';

export class PartsPage extends PartsBase {
  private tableBody: Locator;
  private table: Locator;
  private firstTableRow: Locator;
  private clickableTableRow: Locator;
  constructor(page: Page) {
    super(page);
    this.table = this.page.locator('table');
    this.tableBody = this.table.locator('tbody');
    this.firstTableRow = this.tableBody.locator('tr').nth(0);
    this.clickableTableRow = this.tableBody
      .locator('tr')
      .filter({ hasNotText: /00_部品.+/ })
      .nth(0);
  }

  async goto() {
    await this.page.goto('/parts/');
  }

  async waitForTimeout(time: number) {
    await this.page.waitForTimeout(time);
  }

  async expectToHaveTitle() {
    await super.expectToHaveTitle('部品構成一覧');
  }

  async expectListToBeVisible() {
    await this.firstTableRow.hover();
    await this.firstTableRow.waitFor({ state: 'visible' });
    await expect(this.firstTableRow).toBeVisible();
  }

  async expectToBeLoaded() {
    await expect(this.page).toHaveURL(/\/parts\/$/);
    await this.expectToHaveTitle();
    await this.expectListToBeVisible();
    await this.page.waitForTimeout(5000);
  }

  async clickTraceIdLink() {
    const cell = await findCellByTitle({
      table: this.table,
      row: this.clickableTableRow,
      title: 'トレース識別子',
      hasParentHeader: true,
    });

    await cell.getByRole('link').click();
  }
  async clickRegisterButton() {
    // await this.layout.content
    //   .getByRole('button', { name: '新規部品登録' })
    //   .click()
    await this.page.getByRole('button', { name: '新規部品登録' }).click();
  }

  async clickTheirCfpRegisterButton() {
    await this.page.getByRole('button', { name: 'CFP参照・登録' }).click();
  }

  async clickRequestCfpButton() {
    await this.page.getByRole('button', { name: 'CFP算出依頼' }).click();
  }
}
