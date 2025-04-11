import { Locator, Page, expect } from '@playwright/test';
import { atom, layout, molecule } from '../../locators';

export class RequestsBase {
  protected layout: { [K in keyof ReturnType<typeof layout>]: Locator };
  protected molecule: { [K in keyof ReturnType<typeof molecule>]: Locator };
  protected atom: { [K in keyof ReturnType<typeof atom>]: Locator };
  protected tabLink: Locator;
  constructor(protected readonly page: Page) {
    this.layout = layout(page);
    this.molecule = molecule(page);
    this.atom = atom(page);

    this.tabLink = this.layout.header.getByRole('link', {
      name: '受領依頼一覧',
    });
  }

  async expectToHaveTitle(title: string) {
    await expect(this.page.getByRole('heading', { name: title })).toBeDefined();
  }

  async clickRequestsTab() {
    await this.page.getByRole('link', { name: '受領依頼一覧' }).click();
  }
  async clickBackButton() {
    await this.atom.backButton.getByRole('link').click();
  }
}
