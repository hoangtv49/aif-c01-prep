import { expect, test } from "bun:test";
import fs from "fs";

test("Question cards contain .q-meta-tags and .q-meta-actions containers for clean mobile layout", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Must have dedicated wrapper containers so tags and action buttons don't wrap with awkward indents
  expect(html).toContain('class="q-meta-tags"');
  expect(html).toContain('class="q-meta-actions"');

  // .q-toggle-btn must NOT have margin-left: auto which pushes line 2 to the right on mobile
  expect(html).not.toMatch(/\.q-toggle-btn\s*\{[^}]*margin-left:\s*auto/);
});

test("Smart sticky bars do NOT hide on fast scroll (no bar-hidden disappearing bug)", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // handleSmartScroll and bar-hidden that caused search bar to disappear on fast scroll must be removed
  expect(html).not.toContain("handleSmartScroll");
  expect(html).not.toMatch(/\.smart-sticky-bar\.bar-hidden/);

  // All 3 sticky bars exist and stay sticky
  expect(html).toContain('id="quiz-sticky-bar"');
  expect(html).toContain('id="matrix-sticky-bar"');
  expect(html).toContain('id="ste-sticky-bar"');
});

test("CSS includes mobile responsive rules for .q-meta-actions and .playlist-toolbar", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toContain(".q-meta-actions");
  expect(html).toContain(".playlist-toolbar");
});

test("Subtabs switcher (.view-subtabs-group) has sleek mobile layout without awkward multiline breaks", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Must have short text for mobile and full text for desktop
  expect(html).toContain('subtab-text-short');
  expect(html).toContain('subtab-text-full');

  // Must have mobile styles that hide the reading-time-pill inside view-subtab-btn on mobile
  expect(html).toContain('.view-subtab-btn .reading-time-pill');
  expect(html).toContain('fc-mastered-count-subtab-short');
});

test("Header logo/brand links back to topics home page and theory audio aligns controls to both sides on mobile", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Header brand has link/click action to topics home
  expect(html).toContain('goToHome');
  expect(html).toMatch(/\.brand\s*\{[^}]*cursor:\s*pointer/);

  // Theory audio toolbar aligns play button and time display to both sides on mobile
  expect(html).toMatch(/\.theory-audio-left\s*\{[^}]*justify-content:\s*space-between/);
});

test("Exam timer does NOT auto-start on load, and header stats pill has responsive mobile layout", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Timer must initialize paused so it does not auto-decrement on page load
  expect(html).toContain('let isTimerPaused = true;');
  expect(html).toContain('let isTimerStarted = false;');

  // Header stats pill must have short labels for compact mobile display
  expect(html).toContain('stat-label-short');
  expect(html).toContain('stat-label-full');
});
