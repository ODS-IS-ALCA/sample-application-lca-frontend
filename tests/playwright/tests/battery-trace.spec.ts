import { test } from '@playwright/test';
import * as s1 from './scenario1';
import { getUUIDName } from './utils';

test('シナリオ #1', async ({ page }) => {
  // 部品構成一覧が100件まで昇順表示のため、表示されるよう部品項目に#を付与する(暫定)
  // 部品構成登録 親部品 部品項目をuniqueにしなければ一覧に遷移した後で識別できないためuuidを付与する(暫定)
  const prefix = process.env['PREFIX']!;

  const [userA, userB, userC, pwA, pwB, pwC, openIdB, openIdC] = [
    'NEXT_PUBLIC_DEFAULT_ID_A',
    'NEXT_PUBLIC_DEFAULT_ID_B',
    'NEXT_PUBLIC_DEFAULT_ID_C',
    'NEXT_PUBLIC_DEFAULT_PW_A',
    'NEXT_PUBLIC_DEFAULT_PW_B',
    'NEXT_PUBLIC_DEFAULT_PW_C',
    'NEXT_OPEN_OP_ID_B',
    'NEXT_OPEN_OP_ID_C',
  ].map((key) => process.env[key]!);

  // 依頼送信を行うB03,A01,A02は一意な命名でないと、新規に部品が作成されないため、UUIDで命名する
  const [A1Name, A01Name, A02Name, B1Name, B03Name, C1Name, C2Name] = [
    'A1',
    'A01',
    'A02',
    'B1',
    'B03',
    'C1',
    'C2',
  ].map((name) => getUUIDName(prefix, name));
  await s1.procedure1and2(page, userB, pwB, B1Name, B03Name, openIdC);
  await s1.procedure3and4(
    page,
    userA,
    pwA,
    A1Name,
    A01Name,
    A02Name,
    openIdB,
    openIdC
  );
  await s1.procedure5(page, userC, pwC, C1Name);
  await s1.procedure6(page, A02Name, C1Name);
  await s1.procedure7(page, C2Name);
  await s1.procedure8(page, B03Name, C2Name);
  await s1.procedure9(page, userB, pwB, A01Name, B1Name);
  await s1.procedure10(page, userA, pwA, A1Name);
});
