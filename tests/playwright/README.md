# playwright による E2E テスト

## 事前準備

.env.sample ファイルを参考に、.env ファイルを tests/playwright 直下に配置する。
A 社、B 社、C 社のロール毎に、ログイン・ユーザー ID とパスワード、事業者識別子、公開事業者識別子を設定する。

```sh
# PROXY SERVER
PROXY_SERVER=<proxy_server:8080>
# 部品名に付与するPREFIX
PREFIX=<prefix>
BASEURL=<リモートサーバー上のUIアプリケーション接続先URL>

# A社
NEXT_PUBLIC_DEFAULT_ID_A=<ログイン・ユーザーID>
NEXT_PUBLIC_DEFAULT_PW_A=<ログイン・パスワード>
NEXT_OP_ID_A=<事業者識別子>
NEXT_OPEN_OP_ID_A=<公開事業者識別子>

# B社
NEXT_PUBLIC_DEFAULT_ID_B=<ログイン・ユーザーID>
NEXT_PUBLIC_DEFAULT_PW_B=<ログイン・パスワード>
NEXT_OP_ID_B=<事業者識別子>
NEXT_OPEN_OP_ID_B=<公開事業者識別子>

# C社
NEXT_PUBLIC_DEFAULT_ID_C=<ログイン・ユーザーID>
NEXT_PUBLIC_DEFAULT_PW_C=<ログイン・パスワード>
NEXT_OP_ID_C=<事業者識別子>
NEXT_OPEN_OP_ID_C=<公開事業者識別子>
```

NOTE: ページング には非対応のため、E2E テスト内で登録する部品名には先頭に `PREFIX` を付与して、必ず最初のページに表示されるように調整する必要がある。
例えば、現状部品構成一覧画面の先頭に`ABC-001`という名前の部品が表示されている場合、それよりもアルファベット順で若い部品名にするための`PREFIX`を指定する。(例: `PREFIX=#A-`)

```sh
# 初回のみ
cd tests/playwright
npm ci
npx playwright install
```

## 実行方法 (アクセス先 UI アプリケーションをローカルで実行する場合)

### UI アプリケーションの起動

```sh
# 初回表示に時間がかかってテストが失敗する可能性がある。
npm run dev

# こちらを推奨
npm run build
npx serve out
```

### E2E テストの起動

```sh
#ローカルで起動 UIアプリケーション起動後、シナリオ#1を実行
cd tests/playwright
npm run ui:local
```

## 実行方法 (アクセス先アプリケーションがリモートサーバー上で実行されている場合)

### 事前準備

tests/playwright 直下に配置した.env ファイルに `BASEURL` の設定を行う。

```sh
BASEURL=https://...
```

### E2E テストの起動

```sh
#SPA3で起動 UIアプリケーション起動後、シナリオ#1を実行
cd tests/playwright
npm run ui
```

## (参考)Codegen 操作からのコード生成

Codegen 操作からサンプルコード生成を行い、E2E テスト作成を支援することができる。

```sh
#codegen 操作からコード生成
cd tests/playwright
npx playwright codegen http://localhost:3000/login
```
