export type PaginationPageName =
  | 'parts'
  | 'link-parts'
  | 'response'
  | 'cfpRequestList';

/**
 * ページングに必要な履歴情報をセッションストレージに保存する
 * @param pageName ページ名
 * @param history 履歴情報
 * @returns
 */
export function saveHistoryToSession(
  pageName: PaginationPageName,
  history: string[]
) {
  sessionStorage.setItem(`pagination.${pageName}`, JSON.stringify(history));
  return;
}

/**
 * ページングに必要な履歴情報をセッションストレージから取得する
 * @param pageName ページ名
 * @returns 履歴情報
 */
export function loadHistoryFromSession(pageName: PaginationPageName): string[] {
  // データ存在チェック
  const item = sessionStorage.getItem(`pagination.${pageName}`);
  if (item === null) return [];

  // 型チェック
  const history = JSON.parse(item);
  if (
    !Array.isArray(history) ||
    !history.every((next: any) => typeof next === 'string')
  ) {
    return [];
  }
  return history;
}
