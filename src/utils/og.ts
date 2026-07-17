import { fontData, experimental_getFontFileURL } from "astro:assets";
import { getFontPathByWeight } from "./getFontPathByWeight";

export type SatoriFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

// Latin/UI font (self-hosted Google Sans Code) that carries the OG layout.
async function loadLatinFonts(url: URL): Promise<SatoriFont[]> {
  const fonts = fontData["--font-google-sans-code"];
  const regular = getFontPathByWeight(fonts, 400);
  const bold = getFontPathByWeight(fonts, 700);
  if (regular === undefined || bold === undefined) {
    throw new Error("Cannot find the Google Sans Code font path.");
  }
  const [regularData, boldData] = await Promise.all([
    fetch(experimental_getFontFileURL(regular, url)).then(res =>
      res.arrayBuffer()
    ),
    fetch(experimental_getFontFileURL(bold, url)).then(res => res.arrayBuffer()),
  ]);
  return [
    { name: "Google Sans Code", data: regularData, weight: 400, style: "normal" },
    { name: "Google Sans Code", data: boldData, weight: 700, style: "normal" },
  ];
}

// An old Android UA makes Google Fonts serve TTF (satori reads ttf/otf/woff,
// but not woff2, and modern UAs get woff2 / MSIE gets EOT).
const TTF_UA =
  "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) " +
  "AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";

// satori-readable font signatures: TrueType, OpenType(CFF), and WOFF (not
// woff2/EOT/HTML). Guards against a proxy or CDN returning something else.
function isFontBuffer(data: ArrayBuffer): boolean {
  const sig = [...new Uint8Array(data.slice(0, 4))]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return (
    sig === "00010000" || // TTF
    sig === "4f54544f" || // 'OTTO'
    sig === "774f4646" || // 'wOFF'
    sig === "74727565" //   'true'
  );
}

// Fetch a Noto Sans JP subset that covers only the characters in `text`, so
// Japanese renders in the OG image without bundling a multi-MB font. Runs at
// build time. Best-effort: on any failure return [] (Latin still renders).
async function loadJapaneseFonts(text: string): Promise<SatoriFont[]> {
  const chars = Array.from(new Set(text)).join("");
  if (!chars) return [];
  const api = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&text=${encodeURIComponent(chars)}`;
  try {
    const css = await fetch(api, { headers: { "User-Agent": TTF_UA } }).then(
      res => res.text()
    );
    const out: SatoriFont[] = [];
    for (const face of css.split("@font-face").slice(1)) {
      const weight = /font-weight:\s*(\d+)/.exec(face)?.[1];
      const src = /src:\s*url\(([^)]+)\)/.exec(face)?.[1];
      if (!weight || !src) continue;
      const w = Number(weight);
      if (w !== 400 && w !== 700) continue;
      const data = await fetch(src, {
        headers: { "User-Agent": TTF_UA },
      }).then(res => res.arrayBuffer());
      if (!isFontBuffer(data)) continue;
      out.push({ name: "Noto Sans JP", data, weight: w, style: "normal" });
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * Fonts for an OG image: the Latin layout font plus a Japanese fallback that
 * covers exactly the glyphs used in `text`. Satori falls back per-glyph, so the
 * container `fontFamily` can stay "Google Sans Code" and Japanese still renders.
 */
export async function loadOgFonts(
  text: string,
  url: URL
): Promise<SatoriFont[]> {
  const [latin, japanese] = await Promise.all([
    loadLatinFonts(url),
    loadJapaneseFonts(text),
  ]);
  return [...latin, ...japanese];
}
