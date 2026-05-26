# hume-press

技術ブログの実装リポジトリ。記事原稿は [shsw228/hume.com](https://github.com/shsw228/hume.com) にあり、ビルド時に取り込まれる。

## 構成

- フレームワーク: [Astro](https://astro.build/) + Tailwind CSS v4
- 記事のロード: Astro Content Layer の `glob` ローダーで外部ディレクトリを参照
- ホスト: GitHub Pages（`https://shsw228.github.io/hume-press/`）
- ビルドトリガー: 記事リポジトリの push → `repository_dispatch` で本リポジトリの Actions を起動

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

## デプロイ

GitHub Actions の `deploy.yml` が以下のいずれかでトリガーされる:

- 実装側 `main` への push
- 記事側からの `repository_dispatch`（`event-type: articles-updated`）
- 手動 `workflow_dispatch`

ジョブは記事リポジトリを `hume.com` ディレクトリに checkout し、Astro でビルドして `actions/deploy-pages` で GitHub Pages に配信する。

### リポジトリ設定

- Settings → Pages → Source を **GitHub Actions** に設定する。
- 独自ドメインに切り替える場合は `astro.config.mjs` の `SITE_URL` を環境変数か直書きで変更し、`BASE_PATH` を空文字にする。`public/CNAME` も忘れずに置く。

### 必要なシークレット

- `ARTICLES_TOKEN`: 記事リポジトリを checkout するための PAT（記事が private のときのみ。public なら不要）

GitHub Pages の配信自体は `GITHUB_TOKEN` で動くので追加シークレットは不要。
