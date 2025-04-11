import { type Page, type Locator } from '@playwright/test';

require('dotenv').config();

const NEXT_PUBLIC_DEFAULT_ID = process.env['NEXT_PUBLIC_DEFAULT_ID'];
const NEXT_PUBLIC_DEFAULT_PW = process.env['NEXT_PUBLIC_DEFAULT_PW'];

export class LoginPage {
  private readonly userId: Locator;
  private readonly password: Locator;
  private readonly loginButton: Locator;

  constructor(protected readonly page: Page) {
    this.userId = page.locator('input[type="text"]');
    this.password = page.locator('input[type="password"]');
    this.loginButton = page.getByText('ログイン');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillUserId() {
    if (typeof NEXT_PUBLIC_DEFAULT_ID === 'string') {
      await this.userId.fill(NEXT_PUBLIC_DEFAULT_ID);
    }
  }
  async fillPassword() {
    if (typeof NEXT_PUBLIC_DEFAULT_PW === 'string') {
      await this.password.fill(NEXT_PUBLIC_DEFAULT_PW);
    }
  }
  async fillUserId_(userid: string) {
    if (typeof userid === 'string') {
      await this.userId.fill(userid);
    }
  }
  async fillPassword_(password: string) {
    if (typeof password === 'string') {
      await this.password.fill(password);
    }
  }
  async clickLogin() {
    await this.loginButton.click();
  }

  async login() {
    await this.goto();
    await this.fillUserId();
    await this.fillPassword();
    await this.clickLogin();
  }

  async loginFromUserId(userId: string, password: string) {
    await this.goto();
    await this.fillUserId_(userId);
    await this.fillPassword_(password);
    await this.clickLogin();
  }
}
