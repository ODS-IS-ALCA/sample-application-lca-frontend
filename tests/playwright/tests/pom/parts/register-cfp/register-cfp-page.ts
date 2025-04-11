import { Locator, Page, expect } from '@playwright/test';
import { PartsBase } from '../base';
import path from 'path';

export class RegisterCfpPage extends PartsBase {
  private table: Locator;
  private tableBody: Locator;
  private firstTableRow: Locator;
  private submitButton: Locator;
  private confirmButton: Locator;
  private backButton: Locator;
  private dqrTab: Locator;

  constructor(page: Page) {
    super(page);
    this.table = this.page.locator('table');
    this.tableBody = this.table.locator('tbody');
    this.firstTableRow = this.tableBody.locator('tr').nth(0);
    this.submitButton = page.getByRole('button', { name: '登録' });
    this.confirmButton = page.getByRole('button', { name: '登録' });
    this.backButton = page.getByRole('link', { name: '部品構成一覧' }).last();
    this.dqrTab = page.getByText('DQR', { exact: true });
  }
  async expectToHaveTitle() {
    await super.expectToHaveTitle('CFP参照・登録');
  }

  async waitForTimeout(time: number) {
    await this.page.waitForTimeout(time);
  }

  async expectToBeLoaded() {
    await expect(this.page).toHaveURL(/\/parts\/register-cfp\//);
    await this.expectToHaveTitle();
    await expect(this.firstTableRow).toBeVisible();
    await this.page.waitForLoadState('networkidle');
    await this.waitForTimeout(10000);
  }

  async clickSubmitButton() {
    await this.submitButton.last().click();
  }

  async clickConfirmButton() {
    await this.confirmButton.last().click();
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  async clickDqrtab() {
    await this.dqrTab.click();
  }

  async uploadCert(index: number) {
    await this.page
      .locator(`tr:nth-child(${index + 1}) > td:nth-child(15) > div`)
      .click();
    await this.page.waitForTimeout(1000);
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.page.getByRole('button', { name: 'ファイルを選択' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join('./tests/cert', 'textCert.txt'));
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: '登録' }).last().click();
    await this.page.waitForTimeout(3000);
  }

  async inputEmission(
    index: number,
    preEmission: string,
    mainEmission: string
  ) {
    const inputPreEmission = this.page.locator(
      `input[name="data\\[${index}\\]\\[preEmission\\]"]`
    );
    const inputMainEmission = this.page.locator(
      `input[name="data\\[${index}\\]\\[mainEmission\\]"]`
    );

    await inputPreEmission.fill(preEmission);
    await inputMainEmission.fill(mainEmission);
  }

  async inputDqr(
    index: number,
    preTeR: string,
    preTiR: string,
    preGeR: string,
    mainTeR: string,
    mainTiR: string,
    mainGeR: string
  ) {
    // 前処理排出量
    await this.page
      .locator(`input[name="data\\[${index}\\]\\[preTeR\\]"]`)
      .fill(preTeR);
    await this.page
      .locator(`input[name="data\\[${index}\\]\\[preTiR\\]"]`)
      .fill(preTiR);
    await this.page
      .locator(`input[name="data\\[${index}\\]\\[preGeR\\]"]`)
      .fill(preGeR);
    // 主な排出量
    await this.page
      .locator(`input[name="data\\[${index}\\]\\[mainTeR\\]"]`)
      .fill(mainTeR);
    await this.page
      .locator(`input[name="data\\[${index}\\]\\[mainTiR\\]"]`)
      .fill(mainTiR);
    await this.page
      .locator(`input[name="data\\[${index}\\]\\[mainGeR\\]"]`)
      .fill(mainGeR);
  }

  async waitUploadCert() {
    await this.page.locator('div').filter({ hasText: /^自社証明書登録$/ }).first().waitFor({ state: 'detached' });
    await this.waitForTimeout(2000);
  }
}
