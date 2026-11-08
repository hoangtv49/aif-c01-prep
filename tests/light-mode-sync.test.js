import { expect, test } from "bun:test";
import fs from "fs";

test("Light mode provides high-contrast text for selected option states", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Selected correct must have dark green text (not pale/white)
  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.option-item\.selected-correct\s+\.opt-text\s*\{[^}]*color:\s*#065f46/);

  // Selected wrong must have dark red text (not pale/white)
  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.option-item\.selected-wrong\s+\.opt-text\s*\{[^}]*color:\s*#991b1b/);
});

test("Light mode overrides .topic-domain-header and title", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.topic-domain-header\s*\{[^}]*background:\s*#ffffff/);
  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.topic-domain-title\s*\{[^}]*color:\s*#0f172a/);
});

test("Light mode overrides .playlist-toolbar and .exam-timer-widget", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.playlist-toolbar\s*\{[^}]*background:\s*#ffffff/);
  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.exam-timer-widget\s*\{[^}]*background:\s*#f8fafc/);
});

test("Light mode overrides .graph-svg-wrapper for concept knowledge graph", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.graph-svg-wrapper\s*\{[^}]*background:[^;]*#f8fafc/);
});

test("Light mode overrides .view-subtabs-group and .cram-header", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.view-subtabs-group\s*\{[^}]*background:\s*#f1f5f9/);
  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.cram-header\s*\{[^}]*background:\s*#ffffff/);
});

test("Section titles and table terms do not use hardcoded inline color: #fff", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).not.toContain('<h2 style="font-size: 1.25rem; font-weight: 700; color: #fff;">Bản đồ Liên kết Khái niệm');
  expect(html).not.toContain('<h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Bảng Quyết Định');
  expect(html).not.toContain('<h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Bộ Từ Điển');
  expect(html).not.toMatch(/<strong style=["']color:\s*#fff;/);
});
