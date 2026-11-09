// Mide rendimiento móvil con Lighthouse (red y CPU simuladas de un móvil medio).
// Uso: node scripts/measure-performance.mjs <url-base> [ruta ...]
//   pnpm --filter @galeria/web perf:measure https://tu-app.vercel.app /buscar /obra/27992
// Necesita Chrome: usa CHROME_PATH si está definido.
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const [base = "http://localhost:3000", ...args] = process.argv.slice(2);
const paths = args.length > 0 ? args : ["/", "/buscar?q=monet", "/obra/27992"];
const RUNS = Number(process.env.PERF_RUNS ?? 3);

const kb = (bytes) => `${Math.round(bytes / 1024)} KB`;
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

function summarize(lhr) {
  const audits = lhr.audits;
  const resources = audits["resource-summary"].details.items;
  const bytes = (type) => resources.find((item) => item.resourceType === type)?.transferSize ?? 0;
  return {
    score: Math.round(lhr.categories.performance.score * 100),
    lcp: audits["largest-contentful-paint"].numericValue,
    cls: audits["cumulative-layout-shift"].numericValue,
    tbt: audits["total-blocking-time"].numericValue,
    js: bytes("script"),
    images: bytes("image"),
  };
}

async function measure(chrome, url) {
  const runs = [];
  for (let i = 0; i < RUNS; i += 1) {
    const { lhr } = await lighthouse(url, {
      port: chrome.port,
      onlyCategories: ["performance"],
      output: "json",
      disableFullPageScreenshot: true,
    });
    runs.push(summarize(lhr));
  }
  const pick = (key) => median(runs.map((run) => run[key]));
  return {
    score: pick("score"),
    lcp: pick("lcp"),
    cls: pick("cls"),
    tbt: pick("tbt"),
    js: pick("js"),
    images: pick("images"),
  };
}

const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
try {
  console.log(`| Ruta | Puntuación | LCP | CLS | TBT | JavaScript | Imágenes |`);
  console.log(`|---|---|---|---|---|---|---|`);
  for (const path of paths) {
    const r = await measure(chrome, new URL(path, base).href);
    console.log(
      `| \`${path}\` | ${r.score} | ${(r.lcp / 1000).toFixed(2)} s | ${r.cls.toFixed(3)} | ${Math.round(r.tbt)} ms | ${kb(r.js)} | ${kb(r.images)} |`,
    );
  }
} finally {
  await chrome.kill();
}
