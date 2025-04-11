import { type Page, type Locator, expect } from '@playwright/test';
import { RequestsBase } from '../base';

export class LinkPartsPage extends RequestsBase {
  private tableBody: Locator;
  private table: Locator;
  private firstTableRow: Locator;
  private submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.table = this.page.locator('table');
    this.tableBody = this.table.locator('tbody');
    this.firstTableRow = this.tableBody.locator('tr').nth(0);
    this.submitButton = page.getByRole('button', { name: '紐付け' }).last();
  }

  async expectToHaveTitle() {
    await super.expectToHaveTitle('部品紐付け');
  }

  async expectListToBeVisible() {
    await this.firstTableRow.waitFor({ state: 'visible' });
    await expect(this.firstTableRow).toBeVisible();
  }

  async expectToBeLoaded() {
    await expect(this.page).toHaveURL(/\/requests\/link-parts\//);
    await this.expectToHaveTitle();
    await this.expectListToBeVisible();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(10000);
  }

  async clickSubmitButton() {
    await this.submitButton.click();
    await this.submitButton.click();
  }
}
