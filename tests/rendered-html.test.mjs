import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Scoopic ambassador site shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Scoopic Student Ambassador Program/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("contains the intended site content and no starter preview", async () => {
  const [page, layout, packageJson, lightPage, dopaminePage, css] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
    readFile(new URL("package.json", root), "utf8"),
    readFile(new URL("app/light/page.tsx", root), "utf8"),
    readFile(new URL("app/dopamine/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);

  assert.match(page, /Become a Scoopic/);
  assert.match(page, /Looking for Passionate GenZ UGC Creators/);
  assert.match(page, /scoopic-logo\.png/);
  assert.match(page, /What is Scoopic\?/);
  assert.match(page, /Built for close friends/);
  assert.match(page, /Everyone gets a puppy/);
  assert.match(page, /Your camera roll has lore/);
  assert.match(page, /pup-green-main\.png/);
  assert.match(page, /pup-green-steam\.png/);
  assert.match(page, /pup-pink-main\.png/);
  assert.match(page, /pup-group-28\.svg/);
  assert.match(page, /pup-group-21\.svg/);
  assert.match(page, /program-steps/);
  assert.doesNotMatch(page, /Project intro/);
  assert.match(page, /Create ONE short video for Scoopic every day/);
  assert.match(page, /Bring 5\+ friends to Scoopic/);
  assert.match(page, /Share honest weekly feedback/);
  assert.match(page, /final-apply/);
  assert.match(page, /Scoopic Student Ambassador Program/);
  assert.match(page, /\$500/);
  assert.match(page, /\$2,000/);
  assert.match(page, /monthly base/);
  assert.match(page, /bonus up to/);
  assert.match(page, /View bonus ladder/);
  assert.match(page, /50K views/);
  assert.match(page, /5M views/);
  assert.match(page, /Meet Our Ambassadors/);
  assert.match(page, /ambassadorVideos/);
  assert.match(page, /ambassador-video-1\.mp4/);
  assert.match(page, /ambassador-video-4\.mp4/);
  assert.match(page, /ambassador-video-6\.mp4/);
  assert.doesNotMatch(page, /ambassador-video-8\.mp4/);
  assert.doesNotMatch(page, /ambassador-video-7\.mp4/);
  assert.match(page, /app-feed-new\.png/);
  assert.match(page, /canvas-decor/);
  assert.match(page, /decor-pup-lineup-padded\.png/);
  assert.match(page, /decor-turn-stories-provided\.png/);
  assert.match(page, /decor-scoopic-loop-provided\.png/);
  assert.doesNotMatch(page, /decor-glasses-/);
  assert.doesNotMatch(page, /decor-pup-lineup-clean\.png|decor-turn-stories-cutout\.png|decor-scoopic-loop-cutout\.png|decor-turn-stories\.png|decor-scoopic-loop\.png/);
  assert.doesNotMatch(page, /decor-ribbon|decor-blue-pup|decor-green-flat|decor-black-glasses|decor-green-glasses|decor-pink-pup|decor-purple-pup/);
  assert.match(page, /ambassador-orbit/);
  assert.match(page, /enableVideoSound/);
  assert.match(page, /If You Wanna Know/);
  assert.match(page, /Can I apply if I'm not currently in college\?/);
  assert.match(page, /Will I post on my personal accounts\?/);
  assert.match(page, /Uncapped\. You'll receive a \$500 monthly base pay/);
  assert.match(page, /faq-list/);
  assert.match(page, /openFaqIndexes/);
  assert.match(page, /aria-expanded=\{openFaqIndexes\.has\(index\)\}/);
  assert.match(page, /className="faq-question"/);
  assert.match(page, /faq-answer/);
  assert.match(page, /floating-apply/);
  assert.match(page, /video-modal-player/);
  assert.match(layout, /Scoopic Student Ambassador Program/);
  assert.match(
    layout,
    /scoopic-ambassador-site\.scoopic-ai\.workers\.dev/,
  );
  assert.match(layout, /7ec9aab3389a481193a54cbc3df0d5a9/);
  assert.match(
    layout,
    /https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js/,
  );
  assert.match(css, /font-family:\s*"Telka"/);
  assert.match(page, /theme\?:\s*LandingTheme/);
  assert.match(page, /theme="theme-campus"/);
  assert.match(lightPage, /theme="theme-warm"/);
  assert.match(dopaminePage, /theme="theme-dopamine"/);
  assert.match(css, /\.landing-page\.theme-campus/);
  assert.match(css, /\.landing-page\.theme-warm/);
  assert.match(css, /\.landing-page\.theme-dopamine/);
  assert.doesNotMatch(
    page + layout + packageJson,
    /_sites-preview|SkeletonPreview|react-loading-skeleton|codex-preview|journey-cards|JourneyCard|Beta-stage product voice|pup-green-side|\/assets\/pup-blue\.png|Profile coming soon|Answer placeholder|AmbassadorPlaceholder|FaqPlaceholder|Scoopic Ambassador Guide|Search the guide|July 20\+|What makes a good Scoopic video/,
  );
  assert.doesNotMatch(page, /Campus story/);
});
