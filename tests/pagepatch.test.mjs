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
  assert.ok(html.includes("application/x-pagepatch-inert"));
  assert.ok(html.includes("ppScriptType"));
  assert.ok(html.includes("ppHeldAttrs"));
});

test("active site behavior is restored before export", () => {
  assert.ok(html.includes("type==='__none__'"));
  assert.ok(html.includes("setAttribute(name,value)"));
  assert.ok(html.includes("delete n.dataset.ppHeldAttrs"));
});

test("dangerous link schemes and oversized input are guarded", () => {
  assert.match(html, /javascript\|vbscript\|data/);
  assert.match(html, /25\*1024\*1024/);
  assert.match(html, /5\*1024\*1024/);
  assert.ok(html.includes("names.length>500"));
  assert.match(html, /100\*1024\*1024/);
});

test("ordinary relative links remain accepted", () => {
  assert.ok(html.includes("function safeUrl(value)"));
  assert.ok(html.includes("return v}function openLink"));
  assert.ok(html.includes("url=safeUrl($('#newImageLink').value)"));
});

test("CanvasCode-inspired utilities are present", () => {
  for (const marker of ["pasteOpen", "pasteModal", "loadPastedHtml", "selectParent", "selectChild", "copyElement", "function copyText", "function focusElement"]) {
    assert.ok(html.includes(marker), `missing ${marker}`);
  }
  assert.ok(html.includes("document.execCommand('copy')"));
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
