import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import satori from "satori";
import sharp from "sharp";
import { loadOgFonts } from "@/utils/og";
import { getPostSlug } from "@/utils/getPostPaths";
import config from "@/config";

// Apple-neutral palette (light card, single blue accent).
const BG = "#fbfbfd";
const INK = "#1d1d1f";
const SUB = "#6e6e73";
const HAIR = "#d2d2d7";
const ACCENT = "#0071e3";
const MONO = "Google Sans Code";
const SANS = "Noto Sans JP";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) {
    return [];
  }

  const posts = await getCollection("posts").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props, url }) => {
  if (!config.features.dynamicOgImage) {
    return new Response(null, { status: 404, statusText: "Not found" });
  }

  const hostname = new URL(config.site.url).hostname;
  const fonts = await loadOgFonts(
    `${props.data.title}${props.data.author}${config.site.title}${hostname}by `,
    url
  );

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "84px",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "26px",
                      height: "26px",
                      borderRadius: "8px",
                      background: ACCENT,
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      marginLeft: "16px",
                      fontSize: 30,
                      fontFamily: MONO,
                      fontWeight: 700,
                      color: SUB,
                    },
                    children: config.site.title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", flexGrow: 1, alignItems: "center" },
              children: {
                type: "div",
                props: {
                  style: {
                    fontSize: 66,
                    fontFamily: SANS,
                    fontWeight: 700,
                    color: INK,
                    lineHeight: 1.18,
                    letterSpacing: -2,
                    maxHeight: "380px",
                    overflow: "hidden",
                  },
                  children: props.data.title,
                },
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: `1px solid ${HAIR}`,
                paddingTop: "30px",
                fontSize: 26,
                fontFamily: MONO,
                color: SUB,
              },
              children: [
                { type: "div", props: { children: `by ${props.data.author}` } },
                {
                  type: "div",
                  props: { style: { fontWeight: 700 }, children: hostname },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, embedFont: true, fonts }
  );

  const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { "Content-Type": "image/png" },
  });
};
