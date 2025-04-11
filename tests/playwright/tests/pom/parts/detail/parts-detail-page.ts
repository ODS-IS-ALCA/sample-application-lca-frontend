import { Locator, Page, expect } from '@playwright/test';
import { PartsBase } from '../base';

export class PartsDetailPage extends PartsBase {
  private tableBody: Locator;
  private table: Locator;
  private firstTableRow: Locator;

  constructor(page: Page) {
    super(page);
    this.table = this.layout.content.locator(this.molecule.dataTable);
    this.tableBody = this.table.locator('tbody');
    this.firstTableRow = this.tableBody.locator('tr').nth(0);
  }
  async expectListToBeVisible() {
    await expect(this.firstTableRow).toBeVisible();
  }
  async expectToHaveTitle() {
    await super.expectToHaveTitle('部品構成詳細');
  }
  async expectToBeLoaded() {
    await expect(this.page).toHaveURL(/\/parts\/detail\//);
    await this.expectToHaveTitle();
    await this.expectListToBeVisible();
    await this.page.waitForLoadState('networkidle');
  }
  async clickBackButton() {
    await this.atom.backButton.getByRole('link').click();
  }
}
