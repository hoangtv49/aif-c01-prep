import { expect, test } from "bun:test";
import fs from "fs";

test("Theme toggle button exists in header and has accessible attributes", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toContain('id="theme-toggle-btn"');
  expect(html).toContain('onclick="toggleTheme()"');
  expect(html).toContain('class="theme-toggle-icon"');
});

test("Early inline script exists in <head> to prevent FOUC when loading saved theme", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toMatch(/<script[^>]*>[\s\S]*?localStorage\.getItem\(['"]aif_theme['"]\)[\s\S]*?setAttribute\(['"]data-theme['"][\s\S]*?<\/script>/);
});

test("CSS includes complete light mode theme overrides under [data-theme='light']", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toContain('[data-theme="light"]');
  expect(html).toMatch(/\[data-theme=["']light["']\]\s*\{[^}]*--bg:\s*#f/);
  expect(html).toMatch(/\[data-theme=["']light["']\]\s*\{[^}]*--text:\s*#0/);
  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.app-header/);
  expect(html).toMatch(/\[data-theme=["']light["']\]\s+\.q-card/);
});

test("toggleTheme JavaScript function updates localStorage and DOM attributes", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toContain("function toggleTheme(");
  expect(html).toContain("localStorage.setItem('aif_theme'");
});
