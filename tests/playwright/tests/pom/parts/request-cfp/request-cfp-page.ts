import { Locator, Page, expect } from '@playwright/test';
import { PartsBase } from '../base';

export class RequestCfpPage extends PartsBase {
  private table: Locator;
  private tableBody: Locator;
  private firstTableRow: Locator;
  private submitButton: Locator;
  private backButton: Locator;

  constructor(page: Page) {
    super(page);
    this.table = this.page.locator('table');
    this.tableBody = this.table.locator('tbody');
    this.firstTableRow = this.tableBody.locator('tr').nth(0);
    this.submitButton = page.getByRole('button', { name: '算出を依頼' }).last();
    this.backButton = page.getByRole('link', { name: '戻る' });
  }
  async expectToHaveTitle() {
    await super.expectToHaveTitle('CFP算出依頼');
  }

  async expectToBeLoaded() {
    await expect(this.page).toHaveURL(/\/parts\/request-cfp\//);
    await this.expectToHaveTitle();
    await this.firstTableRow.waitFor({ state: 'visible' });
    await expect(this.firstTableRow).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTimeout(time: number) {
    await this.page.waitForTimeout(time);
  }

  async clickSubmitButton() {
    await this.submitButton.click();
    await this.submitButton.click();
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  async inputRequest(index: number, openOperatorId: string, message: string) {
    const inputOpenOperatorId = this.page.getByPlaceholder('事業者識別子を入力*').nth(index);
    const inputMessage = this.page.locator(`textarea[name="notRequestedCfp\\[${index}\\]\\.message"]`);

    await inputOpenOperatorId.fill(openOperatorId);
    await inputMessage.fill(message);
  }

  async getTraceId(page, target: string) {
    const rows = await page.locator('//table//tbody//tr');
    const rowsText = await rows.locator(':scope').allInnerTexts();
    let i = 0;
    let index = 0;
    await rowsText.forEach((text) => {
      if (text.includes(target)) {
        index = i;
      }
      i++;
    });
    return await page
      .locator(`tr:nth-child(${index}) > td:nth-child(5) > div`)
      .first()
      .innerText();
  }
}
