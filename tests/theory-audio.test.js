import { expect, test } from "bun:test";
import fs from "fs";
import path from "path";

test("Theory audio parser chunks all 5 domains with spoken intros and diagram descriptions", () => {
  const { parseDomainTheoryChunks, DOMAIN_TITLES, DIAGRAM_TRANSCRIPTIONS } = require("../scripts/generate-theory-audio.cjs");

  expect(typeof parseDomainTheoryChunks).toBe("function");

  for (let domainId = 1; domainId <= 5; domainId++) {
    const chunks = parseDomainTheoryChunks(domainId);
    expect(chunks.length).toBeGreaterThanOrEqual(5);

    // First chunk should contain domain introduction
    expect(chunks[0].text).toContain("Chào mừng bạn đến với phần tóm tắt lý thuyết");
    expect(chunks[0].text).toContain(`Domain ${domainId}`);

    // No chunk should exceed 2000 chars to avoid Edge TTS timeout
    chunks.forEach(c => {
      expect(c.text.length).toBeLessThanOrEqual(2000);
      expect(c.text).not.toContain("```");
      expect(c.text).not.toContain("$\\rightarrow$");
    });
  }
});

test("Theory audio tracks exist for all 5 domains and manifest is valid", () => {
  const manifestPath = path.resolve("audio/theory/manifest.json");
  const subManifestPath = path.resolve("aif-c01-study-guide/audio/theory/manifest.json");

  expect(fs.existsSync(manifestPath)).toBe(true);
  expect(fs.existsSync(subManifestPath)).toBe(true);

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  for (let domainId = 1; domainId <= 5; domainId++) {
    const key = `domain-${domainId}`;
    expect(manifest[key]).toBeDefined();
    expect(manifest[key].domainId).toBe(domainId);
    expect(manifest[key].duration).toBeGreaterThan(300); // at least 5 minutes
    expect(manifest[key].size).toBeGreaterThan(2000000); // at least 2MB

    const rootFile = path.resolve(`audio/theory/domain-${domainId}.mp3`);
    const subFile = path.resolve(`aif-c01-study-guide/audio/theory/domain-${domainId}.mp3`);

    expect(fs.existsSync(rootFile)).toBe(true);
    expect(fs.existsSync(subFile)).toBe(true);

    const buf = fs.readFileSync(rootFile);
    // MPEG sync word (0xFF 0xFB, 0xFF 0xF3, etc.)
    expect(buf[0]).toBe(0xFF);
    expect((buf[1] & 0xE0)).toBe(0xE0);
  }
});

test("Deprecated audio demo is removed from index.html and Theory Audio Player is integrated", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Removed old demo section and nav button
  expect(html).not.toContain('id="audio-demo-player"');
  expect(html).not.toContain('onclick="openAudioDemo()"');
  expect(html).not.toContain("Thử Nghiệm Giọng Đọc AI (Neural Audio Preview)");

  // Added Theory Audio Toolbar and Controller
  expect(html).toContain("theory-audio-toolbar");
  expect(html).toContain("toggleTheoryAudio");
  expect(html).toContain("theoryAudioManager");
  expect(html).toContain("TheoryAudioManager");
});
