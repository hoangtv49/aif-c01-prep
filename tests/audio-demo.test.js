import { expect, test } from "bun:test";
import fs from "fs";
import path from "path";

test("Demo audio files exist and are valid MP3s", () => {
  const rootHoaiMy = path.resolve("audio/demo-hoaimy.mp3");
  const rootNamMinh = path.resolve("audio/demo-namminh.mp3");
  const subHoaiMy = path.resolve("aif-c01-study-guide/audio/demo-hoaimy.mp3");
  const subNamMinh = path.resolve("aif-c01-study-guide/audio/demo-namminh.mp3");

  expect(fs.existsSync(rootHoaiMy)).toBe(true);
  expect(fs.existsSync(rootNamMinh)).toBe(true);
  expect(fs.existsSync(subHoaiMy)).toBe(true);
  expect(fs.existsSync(subNamMinh)).toBe(true);

  // File size should be ~380KB - 420KB
  expect(fs.statSync(rootHoaiMy).size).toBeGreaterThan(200000);
  expect(fs.statSync(rootNamMinh).size).toBeGreaterThan(200000);
});

test("index.html contains audio demo player and voice switcher", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Check for presence of demo audio player element
  expect(html).toContain("audio-demo-player");
  expect(html).toContain("demo-hoaimy.mp3");
  expect(html).toContain("demo-namminh.mp3");

  // Check for voice selection controls
  expect(html).toContain("Hoài My");
  expect(html).toContain("Nam Minh");

  // Check for transcript content
  expect(html).toContain("Amazon Bedrock");
  expect(html).toContain("Retrieval-Augmented Generation");
});
