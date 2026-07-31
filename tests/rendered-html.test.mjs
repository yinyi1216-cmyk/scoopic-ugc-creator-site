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
  assert.match(page, /\/assets\/scoopic-logo\.png/);
  assert.match(page, /What is Scoopic\?/);
  assert.match(page, /Photos become stories/);
  assert.match(page, /Built for close friends/);
  assert.match(page, /\/assets\/pup-green-main\.png/);
  assert.match(page, /\/assets\/pup-green-steam\.png/);
  assert.match(page, /\/assets\/pup-pink-main\.png/);
  assert.match(page, /\/assets\/pup-group-28\.svg/);
  assert.match(page, /\/assets\/pup-group-21\.svg/);
  assert.match(page, /program-steps/);
  assert.match(page, /14 videos completed over each two-week cycle/);
  assert.match(page, /capture real moments, reactions, and app flows/);
  assert.match(page, /Share feedback, comments, and honest reactions/);
  assert.match(page, /final-apply/);
  assert.match(page, /Scoopic Student Ambassador Program/);
  assert.match(page, /\$500-\$2,000/);
  assert.match(page, /Meet the Ambassadors/);
  assert.match(page, /ambassadorVideos/);
  assert.match(page, /\/assets\/ambassador-video-1\.mp4/);
  assert.match(page, /\/assets\/ambassador-video-4\.mp4/);
  assert.match(page, /\/assets\/ambassador-video-8\.mp4/);
  assert.doesNotMatch(page, /\/assets\/ambassador-video-6\.mp4/);
  assert.doesNotMatch(page, /\/assets\/ambassador-video-7\.mp4/);
  assert.match(page, /\/assets\/app-feed-new\.png/);
  assert.match(page, /canvas-decor/);
  assert.match(page, /\/assets\/decor-pup-lineup-padded\.png/);
  assert.match(page, /\/assets\/decor-turn-stories-provided\.png/);
  assert.match(page, /\/assets\/decor-scoopic-loop-provided\.png/);
  assert.doesNotMatch(page, /\/assets\/decor-glasses-/);
  assert.doesNotMatch(page, /\/assets\/decor-pup-lineup-clean\.png|\/assets\/decor-turn-stories-cutout\.png|\/assets\/decor-scoopic-loop-cutout\.png|\/assets\/decor-turn-stories\.png|\/assets\/decor-scoopic-loop\.png/);
  assert.doesNotMatch(page, /decor-ribbon|decor-blue-pup|decor-green-flat|decor-black-glasses|decor-green-glasses|decor-pink-pup|decor-purple-pup/);
  assert.match(page, /ambassador-orbit/);
  assert.match(page, /enableVideoSound/);
  assert.match(page, /Frequently Asked/);
  assert.match(page, /Do I have to be a current college student\?/);
  assert.match(page, /The \$500 is monthly base pay/);
  assert.match(page, /faq-list/);
  assert.match(page, /aria-expanded=\{isOpen\}/);
  assert.match(page, /faq-answer/);
  assert.match(page, /floating-apply/);
  assert.match(layout, /Scoopic Student Ambassador Program/);
  assert.match(css, /font-family:\s*"Telka"/);
  assert.match(page, /theme\?:\s*LandingTheme/);
  assert.match(lightPage, /theme="theme-warm"/);
  assert.match(dopaminePage, /theme="theme-dopamine"/);
  assert.match(css, /\.landing-page\.theme-warm/);
  assert.match(css, /\.landing-page\.theme-dopamine/);
  assert.doesNotMatch(
    page + layout + packageJson,
    /_sites-preview|SkeletonPreview|react-loading-skeleton|codex-preview|journey-cards|JourneyCard|Beta-stage product voice|pup-green-side|\/assets\/pup-blue\.png|Profile coming soon|Answer placeholder|AmbassadorPlaceholder|FaqPlaceholder|Scoopic Ambassador Guide|Search the guide|July 20\+|What makes a good Scoopic video/,
  );
  assert.doesNotMatch(page, /Campus story/);
});
