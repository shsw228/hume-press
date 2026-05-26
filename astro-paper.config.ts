import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://shsw228.github.io/hume.com/",
    title: "hume.com",
    description: "shsw228 のテックブログ。Walkman 解析、iOS 開発、オーディオまわりの覚え書き。",
    author: "shsw228",
    profile: "https://github.com/shsw228",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Asia/Tokyo",
    dir: "ltr",
  },
  posts: {
    perPage: 6,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/shsw228" },
  ],
  shareLinks: [
    { name: "x", url: "https://x.com/intent/post?url=" },
    { name: "mail", url: "mailto:?subject=See%20this%20post&body=" },
  ],
});
