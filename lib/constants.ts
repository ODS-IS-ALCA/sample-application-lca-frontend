// 追加できる構成部品の最大数
export const MAX_CHILD_PARTS_NUM = 10000;
// 構成部品：アップロード可能な拡張子
export const PARTSSTRUCTURE_UPLOAD_CERT_FILE_EXT = [
  '.csv',
];

// 親部品一覧（製品一覧・部品紐付け画面）で表示する部品数
export const PARTS_NUM = 100;

export const LISENCE_FAILED_COMMENT =
  'IDEA原単位のライセンスの保持が確認できないため、部品構成を登録してもCFP計算に進めません。IDEAの利用契約か、下流企業からのCFP算定依頼が必要です。（ただしリファレンス実装では実証のため先に進める仕様としています）';