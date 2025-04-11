import { type Page, type Locator, expect } from '@playwright/test';
import { RequestsBase } from './base';
import { getTableIndex } from '../../utils';

export class RequestsPage extends RequestsBase {
  private tableBody: Locator;
  private table: Locator;
  private firstTableRow: Locator;
  constructor(page: Page) {
    super(page);
    this.table = this.page.locator('table');
    this.tableBody = this.table.locator('tbody');
    this.firstTableRow = this.tableBody.locator('tr').nth(0);
  }

  async expectToHaveTitle() {
    await super.expectToHaveTitle('受領依頼一覧');
  }

  async expectListToBeVisible() {
    await this.firstTableRow.waitFor({ state: 'visible' });
    await expect(this.firstTableRow).toBeVisible();
  }

  async expectToBeLoaded() {
    await expect(this.page).toHaveURL(/\/requests\//);
    await this.expectToHaveTitle();
    await this.expectListToBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPartSelectButton(target: string) {
    const index = await getTableIndex(this.page, target, RequestsPage);
    // indexが3倍されて返ってくるので、それに対処する
    await this.page
      .locator(`tr:nth-child(${index! / 3 + 1}) > td:nth-child(8) > div`)
      .getByRole('button', { name: '部品選択' })
      .click();
  }

  async expectPartsLinked(target: string) {
    const index = await getTableIndex(this.page, target, RequestsPage);
    await expect(
      this.page
        .locator(`tr:nth-child(${index! / 3 + 1}) > td:nth-child(7) > div`)
        .first()
    ).not.toHaveText('-');
  }
}
