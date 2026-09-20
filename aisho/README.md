# 相性チェックメモ（PWA）

算命学・九星気学の考え方による、二人の相性メモ作成ツール。個人学習用。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | アプリ本体（計算エンジン・判定ロジック・画面をすべて含む単一ファイル） |
| `manifest.webmanifest` | PWA定義（アプリ名・アイコン・表示モード） |
| `sw.js` | Service Worker（オフライン動作・キャッシュ管理） |
| `icon-192.png` / `icon-512.png` | アプリアイコン |
| `icon-maskable-512.png` | Android用（角を丸く切り抜かれても欠けないアイコン） |
| `apple-touch-icon.png` | iPhone / iPad のホーム画面用アイコン |

## 公開のしかた

このフォルダごと `uranai` リポジトリの `aisho/` に置く。

```
uranai/
  index.html      ← 既存
  app2.html       ← 既存
  meishiki.html   ← 既存
  uranai3.html    ← 既存
  aisho/          ← このフォルダを追加
    index.html
    manifest.webmanifest
    sw.js
    icon-192.png
    icon-512.png
    icon-maskable-512.png
    apple-touch-icon.png
```

公開後のURL: `https://432smzchi-source.github.io/uranai/aisho/`

Service Worker のスコープは `aisho/` 配下に限定されるため、既存4アプリのキャッシュや動作には影響しない。

## インストールのしかた

- **Windows / Mac（Chrome・Edge）** … 上記URLを開き、画面上部の「アプリとしてインストール」ボタン、またはアドレスバー右端のインストールアイコンを押す。以降はアイコンから独立したウィンドウで開く。
- **iPhone / iPad（Safari）** … 上記URLを開き、共有ボタン → 「ホーム画面に追加」。
  ※ iOSではChromeではなく**Safari**で開く必要がある。
- **Android（Chrome）** … 「アプリとしてインストール」ボタン、またはメニュー →「アプリをインストール」。

インストール後はオフラインでも動作する（計算はすべて端末内で完結し、通信を必要としない）。

## アプリを更新したとき

`index.html` を差し替えるだけで、次回オンラインで開いた時に自動で反映される（HTMLはネットワーク優先で取得する設計のため）。

アイコンや `manifest.webmanifest` を変更した場合のみ、`sw.js` 冒頭の版番号を上げること。

```js
const CACHE = "aisho-v1";   →   const CACHE = "aisho-v2";
```

## 計算エンジンについて

`index.html` 内の

```
/* ===== 計算エンジン（meishiki.htmlの算出ロジックを流用・無改変） ===== */
   … 中略 …
/* ===== ここまで既存アプリから移植した計算エンジン ===== */
```

で挟まれたブロックは `meishiki.html` からの移植。干支・節入り・天中殺まわりの計算を修正した際は、このブロックを差し替えて同期する。

## 注意

本アプリが示す「導出ステップ」「根拠となる理論」は、算命学・九星気学という理論体系の内部で、どの数値からどの規則によって結論が導かれたかを示したもの。計算過程は検証可能だが、その結論が実際の人間関係とどの程度対応するかについての統計的な実証データは存在しない。重大な決定の根拠には用いないこと。
