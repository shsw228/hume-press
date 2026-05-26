# hume-press

技術ブログの実装リポジトリ。記事原稿は [shsw228/hume.com](https://github.com/shsw228/hume.com) にあり、配信もそちらの GitHub Pages から行われる。本リポジトリは Astro のソースコードだけを持つ「素材置き場」で、Pages 配信は行わない。

## 構成

- フレームワーク: [Astro](https://astro.build/) + Tailwind CSS v4
- 記事のロード: Astro Content Layer の `glob` ローダーで外部ディレクトリ（`../hume.com/articles`）を参照
- 公開URL: `https://shsw228.github.io/hume.com/`（配信は hume.com 側のActionsから）
- 実装更新時の連携: 本リポジトリ `main` への push → `dispatch.yml` が `repository_dispatch` を `shsw228/hume.com` に投げてビルドをキック

## ローカル開発

兄弟ディレクトリ前提:

```
parent/
├── hume-press/   # 本リポジトリ
└── hume.com/     # 記事リポジトリ
```

```sh
npm install
npm run dev
```

別の場所に記事ディレクトリがある場合は `ARTICLES_DIR` で上書きできる:

```sh
ARTICLES_DIR=/path/to/articles npm run dev
```

## 必要なシークレット

- `DISPATCH_TOKEN`: `shsw228/hume.com` に `repository_dispatch` を投げる fine-grained PAT。
  - Repository access: `shsw228/hume.com` のみ
  - Permissions: `Contents: Read and write`, `Metadata: Read`

## 独自ドメインへの切り替え

`astro.config.mjs` の `SITE_URL` を実ドメインに、`BASE_PATH` を空文字に変更し、`hume.com` 側に `public/CNAME` を置く。
