import { Locator, Page, expect } from '@playwright/test';
import { PartsBase } from '../base';
import path from 'path';

export class RegisterPage extends PartsBase {
  private level1table: Locator;
  private level2table: Locator;

  private inputParentPartsPartsName: Locator;
  private inputParentPartsSupportPartsName: Locator;
  private inputParentPartsSupportPlantId: Locator;
  private inputParentPartsAmountRequiredUnit: Locator;
  private inputParentPartsTerminatedFlag: Locator;
  private childPartsNameLocator: (i: number) => Locator;
  private childPartsPlantIdLocator: (i: number) => Locator;

  private addRowButton: Locator;
  private csvUploadButton: Locator;
  private submitButton: Locator;
  private backButton: Locator;

  constructor(page: Page) {
    super(page);
    const tables = this.page.locator('table');
    this.level1table = tables.nth(0);
    this.level2table = tables.nth(1);

    this.inputParentPartsPartsName = page.locator(
      'input[name="parentParts\\.partsName"]'
    );
    this.inputParentPartsSupportPartsName = page.locator(
      'input[name="parentParts\\.supportPartsName"]'
    );
    this.inputParentPartsSupportPlantId = page.locator(
      'select[name="parentParts\\.plantId"]'
    );
    this.inputParentPartsAmountRequiredUnit = page.locator(
      'select[name="parentParts\\.amountRequiredUnit"]'
    );
    this.inputParentPartsTerminatedFlag = page.locator('td:nth-child(6)');
    this.childPartsNameLocator = (i) =>
      page.locator(`input[name="childrenParts\\[${i}\\]\\.partsName"]`);
    this.childPartsPlantIdLocator = (i) =>
      page.locator(`select[name="childrenParts\\[${i}\\]\\.plantId"]`);

    this.addRowButton = page
      .locator('div')
      .filter({ hasText: /^部品を追加$/ })
      .nth(1);
    this.csvUploadButton = page.getByRole('button', {
      name: 'CSV取り込み',
    });
    this.submitButton = page.getByRole('button', { name: '登録' });
    this.backButton = page.getByRole('link', { name: '戻る' });
  }
  async expectToHaveTitle() {
    await super.expectToHaveTitle('部品構成登録');
  }

  async expectToBeLoaded() {
    await expect(this.page).toHaveURL(/\/parts\/register\//);
    await this.expectToHaveTitle();
    await expect(this.level1table).toBeVisible();
    await expect(this.level2table).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  async clickSubmitButton() {
    await this.submitButton.last().click();
    await this.submitButton.last().click();
  }

  async clickBackButton() {
    await this.backButton.click();
  }

  async clickAddRowButton() {
    await this.addRowButton.click();
  }

  async inputParentParts(
    partsName: string,
    supportPartsName: string,
    amountRequiredUnit: string
  ) {
    await this.inputParentPartsPartsName.fill(partsName);
    await this.inputParentPartsSupportPartsName.fill(supportPartsName);
    await this.inputParentPartsSupportPlantId.selectOption({ index: 1 });
    await this.inputParentPartsAmountRequiredUnit.selectOption(
      amountRequiredUnit
    );
    await this.inputParentPartsTerminatedFlag.click();
  }

  async selectParentPlantId() {
    return this.inputParentPartsSupportPlantId.selectOption({ index: 1 });
  }

  async selectChildPlantId(i: number) {
    return this.childPartsPlantIdLocator(i).selectOption({ index: 1 });
  }

  async inputParentPartsName(partsName: string) {
    await this.inputParentPartsPartsName.fill(partsName);
  }
  async inputChildPartsName(partsName: string, index: number) {
    await this.childPartsNameLocator(index).fill(partsName);
  }

  async csvUpload(csvFileName: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.csvUploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join('./tests/csv', csvFileName));
    await this.page.waitForTimeout(2000);
  }
}
