import { expect, Page } from '@playwright/test';
import { LoginPage } from './pom/login/login-page';
import { PartsPage } from './pom/parts/parts-page';
import { RequestsPage } from './pom/requests/requests-page';
import { LinkPartsPage } from './pom/requests/link-parts/link-parts-page';
import { RegisterPage } from './pom/parts/register/register-page';
import { RegisterCfpPage } from './pom/parts/register-cfp/register-cfp-page';
import { RequestCfpPage } from './pom/parts/request-cfp/request-cfp-page';
import { getTableIndex } from './utils';

type RegisterInfo = {
  name: string; // 親部品の場合、uuidつきの名前
  preEmission: number;
  mainEmission: number;
  preTeR: number;
  preTiR: number;
  preGeR: number;
  mainTeR: number;
  mainTiR: number;
  mainGeR: number;
};

type RequestInfo = {
  name: string;
  registerTableIndex: number;
  destination: string;
  message: string;
};

/**
 * [Description]
 * ログイン->新規部品登録->CFP,証明書登録までを行う
 */
async function fromLoginToRegisterCertification(
  page: Page,
  login: () => Promise<void>,
  setPartsToRegister: () => Promise<void>,
  parent: RegisterInfo,
  childrenToRegister: RegisterInfo[],
  childrenToRequest: RequestInfo[]
) {
  // ログイン
  await login();
  // 部品構成一覧
  const partsPage = new PartsPage(page);
  await partsPage.expectToBeLoaded();
  await partsPage.clickRegisterButton();
  // 部品構成登録
  const registerPage = new RegisterPage(page);
  await registerPage.expectToBeLoaded();
  await setPartsToRegister();

  // csvに記載のplantIdが消えても、plantIdを選択するために、再度選択する。
  await registerPage.selectParentPlantId();
  for (
    let index = 0;
    index < childrenToRegister.length + childrenToRequest.length;
    index++
  ) {
    await registerPage.selectChildPlantId(index);
  }

  await registerPage.inputParentPartsName(parent.name);
  for (const { registerTableIndex, name } of childrenToRequest) {
    await registerPage.inputChildPartsName(name, registerTableIndex);
  }
  await registerPage.clickSubmitButton();

  // 部品構成一覧
  await partsPage.waitForTimeout(10000);
  await partsPage.expectToBeLoaded();
  await page
    .locator(
      `tr:nth-child(${(await getTableIndex(page, parent.name, PartsPage))! + 1
      }) > td:nth-child(8) > div > .w-full`
    ) // nth-childは1始まり
    .click();
  await partsPage.clickTheirCfpRegisterButton();
  // CFP参照・登録画面
  const registerCfpPage = new RegisterCfpPage(page);
  await registerCfpPage.expectToBeLoaded();

  for (const { name, preEmission, mainEmission } of [
    parent,
    ...childrenToRegister,
  ]) {
    const i = await getTableIndex(page, name);
    await registerCfpPage.inputEmission(
      i!,
      preEmission.toString(),
      mainEmission.toString()
    );
  }
  // DQR入力
  await registerCfpPage.clickDqrtab();
  for (const { name, preTeR, preTiR, preGeR, mainTeR, mainTiR, mainGeR } of [
    parent,
    ...childrenToRegister,
  ]) {
    const i = await getTableIndex(page, name);
    await registerCfpPage.inputDqr(
      i!,
      preTeR.toString(),
      preTiR.toString(),
      preGeR.toString(),
      mainTeR.toString(),
      mainTiR.toString(),
      mainGeR.toString()
    );
  }
  // 自社証明書登録
  await registerCfpPage.uploadCert((await getTableIndex(page, parent.name))!);
  await registerCfpPage.clickSubmitButton();
  await registerCfpPage.waitUploadCert();

  // CFP登録
  await registerCfpPage.clickSubmitButton();
  await registerCfpPage.clickSubmitButton();
  await registerCfpPage.waitForTimeout(2000);
}

/**
 * [Description]
 * CFP算出依頼を行う
 * @return string[] RequestしたpartsのtraceId
 */
async function requestCfp(
  page: Page,
  parentName: string,
  childrenToRequest: RequestInfo[]
) {
  // 部品構成一覧
  const partsPage = new PartsPage(page);
  await partsPage.waitForTimeout(1000);
  await partsPage.expectToBeLoaded();
  await page
    .locator(
      `tr:nth-child(${(await getTableIndex(page, parentName, PartsPage))! + 1
      }) > td:nth-child(8) > div > .w-full`
    )
    .click();
  await partsPage.clickRequestCfpButton();
  // CFP算出依頼
  const requestCfpPage = new RequestCfpPage(page);
  await requestCfpPage.waitForTimeout(10000);
  await requestCfpPage.expectToBeLoaded();

  const indexes: number[] = [];
  for (const { name: uuidName, destination, message } of childrenToRequest) {
    const index = (await getTableIndex(page, uuidName))!; // シートもカウントされるので+1されている。
    await requestCfpPage.inputRequest(index - 1, destination, message);
    indexes.push(index);
  }

  await requestCfpPage.waitForTimeout(2000);
  await requestCfpPage.clickSubmitButton();
  // 部品構成一覧に戻る
  await partsPage.expectToBeLoaded();
}

/**
 * [Description]
 * 部品紐付を行う
 */
async function linkParts(
  page: Page,
  requestPartsName: string,
  linkPartsName: string
) {
  // 部品構成一覧にいる前提
  await new PartsPage(page).expectToBeLoaded();
  const requestsPage = new RequestsPage(page);
  await requestsPage.clickRequestsTab();
  await requestsPage.expectToBeLoaded();
  await requestsPage.clickPartSelectButton(requestPartsName);
  const linkPartsPage = new LinkPartsPage(page);
  await linkPartsPage.expectToBeLoaded();

  // シートも含めて検索するためindexはすでに+1されている状態
  const index = await getTableIndex(page, linkPartsName, LinkPartsPage)!;
  await page
    .locator(`tr:nth-child(${index}) > td:nth-child(7) > div > .w-full`)
    .click();
  await linkPartsPage.clickSubmitButton();

  // 受領依頼一覧に戻る
  // APIの更新を待つためしばらく待機してreloadする。
  await requestsPage.expectToBeLoaded();
  await page.waitForTimeout(10000);
  await page.reload();
  await requestsPage.expectToBeLoaded();
  await requestsPage.expectPartsLinked(requestPartsName);
}

export async function procedure1and2(
  page: Page,
  userB: string,
  pwB: string,
  B1Name: string,
  B03Name: string,
  openIdC: string
) {
  const childrenToRequest = [
    {
      name: B03Name,
      registerTableIndex: 2,
      message: 'あああああ',
      destination: openIdC,
    },
  ];
  await fromLoginToRegisterCertification(
    page,
    () => new LoginPage(page).loginFromUserId(userB, pwB),
    () => new RegisterPage(page).csvUpload('1-1.csv'),
    {
      name: B1Name,
      preEmission: 0,
      mainEmission: 4.5,
      preTeR: 0,
      preTiR: 0,
      preGeR: 0,
      mainTeR: 0,
      mainTiR: 0,
      mainGeR: 0,
    },
    [
      {
        name: 'B01',
        preEmission: 1.5,
        mainEmission: 3.7,
        preTeR: 0,
        preTiR: 0,
        preGeR: 0,
        mainTeR: 0,
        mainTiR: 0,
        mainGeR: 0,
      },
      {
        name: 'B02',
        preEmission: 0,
        mainEmission: 2.5,
        preTeR: 0,
        preTiR: 0,
        preGeR: 0,
        mainTeR: 0,
        mainTiR: 0,
        mainGeR: 0,
      },
    ],
    childrenToRequest
  );
  return requestCfp(page, B1Name, childrenToRequest);
}

export async function procedure3and4(
  page: Page,
  userA: string,
  pwA: string,
  A1Name: string,
  A01Name: string,
  A02Name: string,
  openIdB: string,
  openIdC: string
) {
  const childrenToRequest = [
    {
      name: A01Name,
      registerTableIndex: 0,
      message: 'あああああ',
      destination: openIdB,
    },
    {
      name: A02Name,
      registerTableIndex: 1,
      message: 'あああああ',
      destination: openIdC,
    },
  ];

  await fromLoginToRegisterCertification(
    page,
    () => new LoginPage(page).loginFromUserId(userA, pwA),
    () => new RegisterPage(page).csvUpload('1-2.csv'),
    {
      name: A1Name,
      preEmission: 0,
      mainEmission: 4.8,
      preTeR: 0,
      preTiR: 0,
      preGeR: 0,
      mainTeR: 0,
      mainTiR: 0,
      mainGeR: 0,
    },
    [
      {
        name: 'A03',
        preEmission: 0,
        mainEmission: 10.5,
        preTeR: 0,
        preTiR: 0,
        preGeR: 0,
        mainTeR: 0,
        mainTiR: 0,
        mainGeR: 0,
      },
    ],
    childrenToRequest
  );
  return requestCfp(page, A1Name, childrenToRequest);
}

export async function procedure5(
  page: Page,
  userC: string,
  pwC: string,
  C1Name: string
) {
  return fromLoginToRegisterCertification(
    page,
    () => new LoginPage(page).loginFromUserId(userC, pwC),
    () => new RegisterPage(page).inputParentParts(C1Name, '01', 'kilogram'),
    {
      name: C1Name,
      preEmission: 0,
      mainEmission: 2.5,
      preTeR: 0,
      preTiR: 0,
      preGeR: 0,
      mainTeR: 4,
      mainTiR: 3,
      mainGeR: 3,
    },
    [],
    []
  );
}

export async function procedure6(
  page: Page,
  A02Name: string,
  C1Name: string
) {
  // 手順6 A社からの依頼に対し、部品を紐付けてCFP回答（A02-C1）
  // 受領依頼一覧
  await linkParts(page, A02Name, C1Name);
}

export async function procedure7(page: Page, C2Name: string) {
  // 手順7 自社部品情報、CFP情報を登録（親部品：C2）
  // 部品構成一覧
  await new PartsPage(page).goto();
  return fromLoginToRegisterCertification(
    page,
    async () => { },
    () => new RegisterPage(page).inputParentParts(C2Name, '01', 'kilogram'),
    {
      name: C2Name,
      preEmission: 2.5,
      mainEmission: 0,
      preTeR: 3,
      preTiR: 2,
      preGeR: 4,
      mainTeR: 0,
      mainTiR: 0,
      mainGeR: 0,
    },
    [],
    []
  );
}

export async function procedure8(
  page: Page,
  B03Name: string,
  C2Name: string
) {
  // 手順8 B社からの依頼に対し、部品を紐付けてCFP回答（B03-C2）
  // 受領依頼一覧
  await linkParts(page, B03Name, C2Name);
}

export async function procedure9(
  page: Page,
  userB: string,
  pwB: string,
  A01Name: string,
  B1Name: string
) {
  // B社ログイン
  await new LoginPage(page).loginFromUserId(userB, pwB);
  // 手順9 A社からの依頼に対し、部品を紐付けてCFP回答（A01-B1）
  await linkParts(page, A01Name, B1Name);
}

export async function procedure10(
  page: Page,
  userA: string,
  pwA: string,
  A1Name: string
) {
  // 手順10 回答が出揃ったことを確認し、CFPの合計値を確認
  // A社ログイン
  await new LoginPage(page).loginFromUserId(userA, pwA);
  // 部品構成一覧
  const partsPage = new PartsPage(page);
  await partsPage.clickPartsTab();
  await partsPage.expectToBeLoaded();
  await page
    .locator(
      `tr:nth-child(${(await getTableIndex(page, A1Name, PartsPage))! + 1
      }) > td:nth-child(8) > div > .w-full`
    )
    .click();
  await partsPage.clickTheirCfpRegisterButton();
  // CFP参照・登録画面
  const registerCfpPage = new RegisterCfpPage(page);
  await registerCfpPage.expectToBeLoaded();

  // CFP
  // 合計
  await expect(page.locator('.text-right').first()).toHaveText('14.3');
  // 前処理
  await expect(
    page
      .locator('div:nth-child(2) > .line-clamp-1 > .pl-4 > div > .text-right')
      .first()
  ).toHaveText('2.3');
  await expect(
    page.locator('div:nth-child(2) > .text-right').first()
  ).toHaveText('0');
  await expect(
    page.locator('div:nth-child(3) > .text-right').first()
  ).toHaveText('2.3');
  // 製造
  await expect(
    page
      .locator('div:nth-child(3) > .line-clamp-1 > .pl-4 > div > .text-right')
      .first()
  ).toHaveText('12');
  await expect(
    page.locator(
      'div:nth-child(3) > .line-clamp-1 > .pl-4 > div:nth-child(2) > .text-right'
    )
  ).toHaveText('4.8');
  await expect(
    page.locator(
      'div:nth-child(3) > .line-clamp-1 > .pl-4 > div:nth-child(3) > .text-right'
    )
  ).toHaveText('7.2');

  // DQR 原材料取得及び前処理
  await expect(
    page
      .locator(
        '.w-\\[330px\\] > div > div:nth-child(2) > div > .line-clamp-1 > .w-full > div'
      )
      .first()
  ).toHaveText('2.6');
  // TeR
  await expect(
    page
      .locator(
        '.w-\\[330px\\] > div > div:nth-child(2) > div > .line-clamp-1 > .w-full > div:nth-child(2)'
      )
      .first()
  ).toHaveText('2.5');
  // TiR
  await expect(
    page
      .locator(
        '.w-\\[330px\\] > div > div:nth-child(2) > div > .line-clamp-1 > .w-full > div:nth-child(3)'
      )
      .first()
  ).toHaveText('1.7');
  // GeR
  await expect(
    page.locator('.line-clamp-1 > .w-full > div:nth-child(4)').first()
  ).toHaveText('3.4');
  // DQR 主な製造
  await expect(
    page
      .locator(
        '.w-\\[330px\\] > div > div:nth-child(2) > div:nth-child(2) > .line-clamp-1 > .w-full > div'
      )
      .first()
  ).toHaveText('0.2');
  // TeR
  await expect(
    page.locator(
      '.w-\\[330px\\] > div > div:nth-child(2) > div:nth-child(2) > .line-clamp-1 > .w-full > div:nth-child(2)'
    )
  ).toHaveText('0.2');
  // TiR
  await expect(
    page.locator(
      '.w-\\[330px\\] > div > div:nth-child(2) > div:nth-child(2) > .line-clamp-1 > .w-full > div:nth-child(3)'
    )
  ).toHaveText('0.2');
  // GeR
  await expect(
    page.locator(
      'div:nth-child(2) > .line-clamp-1 > .w-full > div:nth-child(4)'
    )
  ).toHaveText('0.2');
}
