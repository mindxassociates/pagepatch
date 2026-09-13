import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

test("standalone app has required landmarks", () => {
  for (const marker of ["<!doctype html>", 'id="frame"', 'id="fileInput"', 'id="exportBtn"', "JSZip"]) {
    assert.ok(html.includes(marker), `missing ${marker}`);
  }
});

test("preview uses explicit isolation controls", () => {
  assert.match(html, /sandbox="allow-scripts allow-same-origin"/);
  assert.match(html, /allow-scripts allow-forms allow-modals allow-popups/);
  assert.match(html, /referrerpolicy="no-referrer"/);
  assert.match(html, /doc\.querySelectorAll\('script'\)\.forEach/);
  assert.match(html, /\^on\/i/);
});

test("dangerous link schemes and oversized input are guarded", () => {
  assert.match(html, /javascript\|vbscript/);
  assert.match(html, /25\*1024\*1024/);
  assert.match(html, /5\*1024\*1024/);
});

test("static ids are unique", () => {
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual([...new Set(duplicates)], []);
});

test("bilingual interface and accessibility hooks remain present", () => {
  assert.ok(html.includes("const ZH="));
  assert.ok(html.includes('aria-live="polite"'));
  assert.ok(html.includes("prefers-reduced-motion"));
  assert.ok(html.includes("aria-modal"));
});
