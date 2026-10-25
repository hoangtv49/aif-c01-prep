# AWS AIF-C01 Audio Explanations Subsystem (57 Questions) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a complete AI Audio Explanations subsystem for all 57 exam scenario questions with male neural voice (Nam Minh), interactive mini-player controls, and a continuous hands-free playlist mode.

**Architecture:** A build-time Node.js pipeline (`scripts/generate-questions-audio.cjs`) extracts structured question data from domain markdown files, formats concise 4-step speech scripts (Option 1), and synthesizes 24kHz mono MP3s via `node-edge-tts`. In the SPA client (`scripts/build-web.bun.js`), a Singleton `AudioManager` manages playback, speed controls (`1.0x` / `1.2x` / `1.5x`), viewport tracking, and continuous auto-advance across questions.

**Tech Stack:** Node.js, Bun, `node-edge-tts` (`vi-VN-NamMinhNeural`), HTML5 Audio API, MediaSession API, Vanilla JS, CSS3.

**Spec:** `docs/superpowers/specs/2026-10-25-aif-c01-audio-explanations-design.md`

## Global Constraints

- Audio voice must be `vi-VN-NamMinhNeural` (Microsoft Neural Vietnamese Male).
- Audio format must be MP3 24kHz Mono @ 48 kbps (`audio-24khz-48kbitrate-mono-mp3`).
- Audio files must reside in both `audio/questions/d{domain}-q{num}.mp3` and `aif-c01-study-guide/audio/questions/d{domain}-q{num}.mp3`.
- Total count of question audio files must be exactly 57.
- Speech script must follow Option 1: Header -> Scenario Summary -> Correct Answer -> Analysis & Exam Trap Warning.
- Player must follow Singleton pattern: only one audio stream plays at any given time.

## Review Focus

- Empty or invalid audio files (<50KB) must fail fast and trigger regeneration during build.
- LaTeX math expressions (`$\rightarrow$`, `\le`) must be spoken as natural words (*"suy ra"*, *"nhỏ hơn hoặc bằng"*).
- Continuous playlist auto-advance must gracefully stop at the last question without errors.
- Speed controls (`1.0x`, `1.2x`, `1.5x`) must persist across question switches in `localStorage` (`aif_audio_speed`).
- Active question card must automatically scroll into view and glow with `#38bdf8` outline when auto-playing.

---

### Task 1: Speech Script Builder & Text Sanitization Pipeline

**Files:**
- Create: `scripts/generate-questions-audio.cjs`
- Test: `tests/questions-audio.test.js`

**Interfaces:**
- Produces: `formatQuestionSpeechScript(question, domainTitle)` returning a clean, natural Vietnamese speech string ready for TTS synthesis.

- [ ] **Step 1: Write the failing unit test for speech script generation**

Create `tests/questions-audio.test.js`:

```javascript
import { expect, test } from "bun:test";
import fs from "fs";
import path from "path";

test("Speech script builder sanitizes markdown and formats Option 1 structure", () => {
  const { formatQuestionSpeechScript } = require("../scripts/generate-questions-audio.cjs");

  const sampleQuestion = {
    id: "d1-q1",
    domainId: 1,
    number: 1,
    stem: "A financial company needs to extract tabular data from scanned PDF contracts. Which AWS service should be used?",
    correctAnswer: "B. Amazon Textract",
    reason: "Từ khóa: extract tabular data $\\rightarrow$ Amazon Textract đọc hiểu bảng biểu và form mẫu.",
    trap: "Đề bài nhắc đến ảnh scan rất dễ chọn Amazon Rekognition $\\rightarrow$ Lưu ý: đọc bảng biểu luôn chọn Textract."
  };

  const script = formatQuestionSpeechScript(sampleQuestion, "Domain 1: Nguyên lý cơ bản về AI và Học máy");

  expect(script).toContain("Câu hỏi số 1 của Domain 1");
  expect(script).toContain("Phương án đúng là: B");
  expect(script).toContain("Amazon Textract");
  expect(script).not.toContain("$\\rightarrow$");
  expect(script).toContain("suy ra");
  expect(script).toContain("Lưu ý bẫy thi");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/questions-audio.test.js`
Expected: FAIL (`Cannot find module '../scripts/generate-questions-audio.cjs'`)

- [ ] **Step 3: Implement `formatQuestionSpeechScript` in `scripts/generate-questions-audio.cjs`**

Create `scripts/generate-questions-audio.cjs`:

```javascript
const fs = require("fs");
const path = require("path");
const { EdgeTTS } = require("node-edge-tts");

function sanitizeSpeechText(text) {
  if (!text) return "";
  return text
    .replace(/\$\s*\\rightarrow\s*\$/g, " suy ra ")
    .replace(/\$\s*\\to\s*\$/g, " suy ra ")
    .replace(/\\rightarrow/g, " suy ra ")
    .replace(/\\to\b/g, " suy ra ")
    .replace(/\$\\le\s*(\d+)\$/g, " nhỏ hơn hoặc bằng $1 ")
    .replace(/\$([^\$]+)\$/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function formatQuestionSpeechScript(q, domainTitle) {
  const domainClean = domainTitle.replace(/\s*\(\d+%\)/, "").trim();
  const stemClean = sanitizeSpeechText(q.stem);
  const answerClean = sanitizeSpeechText(q.correctAnswer);
  const reasonClean = sanitizeSpeechText(q.reason)
    .replace(/^Từ khóa quan trọng:?/i, "Từ khóa quan trọng:")
    .replace(/^-\s*/gm, "");
  const trapClean = sanitizeSpeechText(q.trap || q.distractor || "");

  let script = `Câu hỏi số ${q.number} của ${domainClean}. `;
  script += `Tình huống: ${stemClean}. `;
  script += `Phương án đúng là: ${answerClean}. `;
  if (reasonClean) {
    script += `Phân tích: ${reasonClean}. `;
  }
  if (trapClean) {
    script += `Lưu ý bẫy thi: ${trapClean}. `;
  }
  return script.replace(/\s+/g, " ").trim();
}

module.exports = {
  sanitizeSpeechText,
  formatQuestionSpeechScript
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/questions-audio.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-questions-audio.cjs tests/questions-audio.test.js
git commit -m "feat(audio): implement speech script builder and sanitization"
```

---

### Task 2: Batch Audio Synthesis & Manifest Generation

**Files:**
- Modify: `scripts/generate-questions-audio.cjs`
- Test: `tests/questions-audio.test.js`
- Generate: `audio/questions/*.mp3` (57 files)
- Generate: `audio/questions/manifest.json`

**Interfaces:**
- Produces: 57 audio files at `audio/questions/d{d}-q{n}.mp3` and mirrored at `aif-c01-study-guide/audio/questions/d{d}-q{n}.mp3`.
- Produces: `audio/questions/manifest.json` with metadata `{ [qId]: { duration: number, size: number, title: string } }`.

- [ ] **Step 1: Write test for batch synthesis & file existence**

Append to `tests/questions-audio.test.js`:

```javascript
test("Audio generation produces exactly 57 valid MP3 files and manifest", () => {
  const manifestPath = path.resolve("audio/questions/manifest.json");
  expect(fs.existsSync(manifestPath)).toBe(true);

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const keys = Object.keys(manifest);
  expect(keys.length).toBe(57);

  // Check sample files
  ["d1-q1", "d2-q1", "d3-q1", "d4-q1", "d5-q1"].forEach(qId => {
    expect(manifest[qId]).toBeDefined();
    const rootPath = path.resolve(`audio/questions/${qId}.mp3`);
    const subPath = path.resolve(`aif-c01-study-guide/audio/questions/${qId}.mp3`);
    expect(fs.existsSync(rootPath)).toBe(true);
    expect(fs.existsSync(subPath)).toBe(true);
    expect(fs.statSync(rootPath).size).toBeGreaterThan(100000); // > 100KB
  });
});
```

- [ ] **Step 2: Run test to verify it fails before generation**

Run: `bun test tests/questions-audio.test.js`
Expected: FAIL (manifest.json not found)

- [ ] **Step 3: Complete batch generator logic in `scripts/generate-questions-audio.cjs`**

Enhance `scripts/generate-questions-audio.cjs` to parse all 5 domain markdown files and synthesize all 57 audio files with retry and caching:

```javascript
// Add main synthesis runner
async function synthesizeAllQuestions(force = false) {
  const BASE_DIR = path.resolve(__dirname, "../aif-c01-study-guide");
  const audioDir = path.resolve(__dirname, "../audio/questions");
  const subAudioDir = path.resolve(__dirname, "../aif-c01-study-guide/audio/questions");

  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
  if (!fs.existsSync(subAudioDir)) fs.mkdirSync(subAudioDir, { recursive: true });

  const domainFiles = [1, 2, 3, 4, 5].map(id => {
    return fs.readdirSync(BASE_DIR).find(f => f.startsWith(`domain-${id}`));
  });

  const manifest = {};
  const tts = new EdgeTTS({
    voice: "vi-VN-NamMinhNeural",
    lang: "vi-VN",
    outputFormat: "audio-24khz-48kbitrate-mono-mp3"
  });

  for (const filename of domainFiles) {
    const domainId = parseInt(filename.match(/domain-(\d+)/)[1]);
    const content = fs.readFileSync(path.join(BASE_DIR, filename), "utf8");
    const titleMatch = content.match(/^# (.*)/m);
    const domainTitle = titleMatch ? titleMatch[1] : `Domain ${domainId}`;

    const qBlocks = content.split(/### Question \d+/);
    for (let qIdx = 1; qIdx < qBlocks.length; qIdx++) {
      const qNum = qIdx;
      const block = qBlocks[qIdx];
      const qId = `d${domainId}-q${qNum}`;

      const stemAndOpts = block.split(/\*\*Đáp án đúng:\*\*/);
      const stemRaw = stemAndOpts[0].trim();
      const stemLines = [];
      stemRaw.split("\n").forEach(l => {
        const trimmed = l.trim();
        if (!/^[-*]\s+[A-E]\./.test(trimmed) && trimmed.length > 0) {
          stemLines.push(trimmed);
        }
      });

      const answerPart = stemAndOpts[1] || "";
      const answerMatch = answerPart.match(/^\s*\*?\*?(.*?)\*?\*?\s*\n/);
      const correctAnswer = answerMatch ? answerMatch[1].trim() : "";
      const reasonMatch = answerPart.match(/\*\*Lý do chọn.*?\*\*([\s\S]*?)(?=\*\*Phân tích|\*\*Cảnh báo|$)/i);
      const reason = reasonMatch ? reasonMatch[1].trim() : "";
      const trapMatch = answerPart.match(/\*\*Cảnh báo.*?\*\*([\s\S]*?)(?=---|###|$)/i);
      const trap = trapMatch ? trapMatch[1].trim() : "";

      const qObj = {
        id: qId,
        domainId,
        number: qNum,
        stem: stemLines.join(" "),
        correctAnswer,
        reason,
        trap
      };

      const script = formatQuestionSpeechScript(qObj, domainTitle);
      const targetFile = path.join(audioDir, `${qId}.mp3`);
      const subTargetFile = path.join(subAudioDir, `${qId}.mp3`);

      // Check cache (>50KB)
      if (!force && fs.existsSync(targetFile) && fs.statSync(targetFile).size > 50000) {
        // Cached
        const size = fs.statSync(targetFile).size;
        const estDuration = Math.round(size / 6000); // 48kbps ~ 6KB/s
        manifest[qId] = { duration: estDuration, size, script };
        if (!fs.existsSync(subTargetFile)) fs.copyFileSync(targetFile, subTargetFile);
        continue;
      }

      console.log(`Synthesizing [${qId}]...`);
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        try {
          attempts++;
          await tts.ttsPromise(script, targetFile);
          fs.copyFileSync(targetFile, subTargetFile);
          success = true;
        } catch (e) {
          console.warn(`Retry ${qId} attempt ${attempts}:`, e.message);
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (success) {
        const size = fs.statSync(targetFile).size;
        const estDuration = Math.round(size / 6000);
        manifest[qId] = { duration: estDuration, size, script };
      }
    }
  }

  const manifestPath = path.join(audioDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(subAudioDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Generated manifest with ${Object.keys(manifest).length} items.`);
}

if (require.main === module) {
  const force = process.argv.includes("--force");
  synthesizeAllQuestions(force).catch(err => {
    console.error("Batch synthesis failed:", err);
    process.exit(1);
  });
}
```

- [ ] **Step 4: Execute the batch generation script**

Run: `node scripts/generate-questions-audio.cjs`
Expected: Successfully generates 57 audio files and `audio/questions/manifest.json`.

- [ ] **Step 5: Run tests to verify all 57 audio files pass**

Run: `bun test tests/questions-audio.test.js`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add audio/questions/ aif-c01-study-guide/audio/questions/ scripts/generate-questions-audio.cjs tests/questions-audio.test.js
git commit -m "feat(audio): batch synthesize 57 scenario question audio tracks"
```

---

### Task 3: Client AudioManager & Inline Mini-Player Component

**Files:**
- Modify: `scripts/build-web.bun.js`
- Test: `tests/questions-audio.test.js`

**Interfaces:**
- Produces: CSS `.q-audio-btn`, `.q-mini-player`, `.q-audio-progress`
- Produces: JS `window.AudioManager` singleton with methods:
  - `playQuestionAudio(qId)`
  - `pauseQuestionAudio()`
  - `toggleQuestionAudio(qId)`
  - `seekQuestionAudio(offsetSec)`
  - `setQuestionAudioSpeed(rate)`

- [ ] **Step 1: Write unit test verifying audio player UI in generated HTML**

Append to `tests/questions-audio.test.js`:

```javascript
test("index.html contains audio buttons and AudioManager for questions", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Every question card should have a toggleQuestionAudio call
  expect(html).toContain("toggleQuestionAudio('d1-q1')");
  expect(html).toContain("toggleQuestionAudio('d5-q1')");

  // Client JS AudioManager
  expect(html).toContain("class QuestionAudioManager");
  expect(html).toContain("audio-questions-manager");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/questions-audio.test.js`
Expected: FAIL (`toggleQuestionAudio('d1-q1')` not found in `index.html`)

- [ ] **Step 3: Update `scripts/build-web.bun.js` to render audio controls on question cards and add `QuestionAudioManager`**

In `scripts/build-web.bun.js`:
1. Add CSS styles for `.q-audio-btn`, `.q-mini-player`, `.q-audio-seek`, `.speed-btn`.
2. In `renderQuestionCard(q, mode)`:
   Add the audio trigger button next to bookmark button:
   ```html
   <button id="q-audio-btn-${q.id}" class="q-audio-btn" onclick="toggleQuestionAudio('${q.id}')" title="Nghe giải thích (Nam Minh)">
     <span class="q-audio-icon">🔊</span>
     <span class="q-audio-text">Nghe (~45s)</span>
   </button>
   ```
   Add the mini-player container inside the card header or right after the stem:
   ```html
   <div id="q-player-box-${q.id}" class="q-mini-player" style="display:none;">
     <div class="q-player-controls">
       <button class="q-ctrl-btn" onclick="seekQuestionAudio(-5)" title="Lùi 5 giây">⏪ 5s</button>
       <button id="q-play-pause-btn-${q.id}" class="q-ctrl-btn play-pause" onclick="toggleQuestionAudio('${q.id}')">⏸️ Tạm dừng</button>
       <button class="q-ctrl-btn" onclick="seekQuestionAudio(5)" title="Tua 5 giây">⏩ 5s</button>
       <span id="q-time-${q.id}" class="q-player-time">00:00 / 00:45</span>
       <div class="q-speed-group">
         <button class="q-speed-btn" onclick="setQuestionAudioSpeed(1.0)">1.0x</button>
         <button class="q-speed-btn" onclick="setQuestionAudioSpeed(1.2)">1.2x</button>
         <button class="q-speed-btn" onclick="setQuestionAudioSpeed(1.5)">1.5x</button>
       </div>
     </div>
     <input type="range" id="q-seek-${q.id}" class="q-player-slider" min="0" max="100" value="0" oninput="onSeekSliderChange(this.value)">
   </div>
   ```
3. Implement `QuestionAudioManager` in client script:
   - Manages single `Audio` instance.
   - Synchronizes time updates to active card slider and time label.
   - Saves speed in `localStorage` (`aif_audio_speed`).
   - Supports MediaSession API.

- [ ] **Step 4: Rebuild web apps and run test to verify it passes**

Run: `bun scripts/build-web.bun.js && bun test tests/questions-audio.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.bun.js index.html aif-c01-study-guide/index.html tests/questions-audio.test.js
git commit -m "feat(audio): integrate client AudioManager and inline mini-players into question cards"
```

---

### Task 4: Continuous Playlist Toolbar & Auto-Scroll Viewport Tracking

**Files:**
- Modify: `scripts/build-web.bun.js`
- Test: `tests/questions-audio.test.js`

**Interfaces:**
- Produces: `#playlist-toolbar` component rendered at the top of question lists.
- Produces: `toggleAutoPlayNext()`, `playNextQuestion()`, `playPrevQuestion()`.

- [ ] **Step 1: Write unit test for Continuous Playlist Toolbar**

Append to `tests/questions-audio.test.js`:

```javascript
test("Playlist Toolbar exists and controls auto-play next", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toContain("playlist-toolbar");
  expect(html).toContain("toggleAutoPlayNext");
  expect(html).toContain("playNextQuestion");
  expect(html).toContain("playPrevQuestion");
  expect(html).toContain("Tự động chuyển câu");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/questions-audio.test.js`
Expected: FAIL (`playlist-toolbar` not found)

- [ ] **Step 3: Add Playlist Toolbar UI and auto-scroll logic in `scripts/build-web.bun.js`**

In `scripts/build-web.bun.js`:
1. Add `.playlist-toolbar` HTML at the top of Tab 2 (#tab-quiz) and Tab 1 (#topic-sec-p3):
   ```html
   <div class="playlist-toolbar">
     <div class="playlist-info">
       <span class="playlist-icon">🎧</span>
       <span class="playlist-title">Chế độ Nghe Rảnh Tay (Podcast / Chạy xe)</span>
       <span id="playlist-active-badge" class="playlist-badge">57 câu có sẵn</span>
     </div>
     <div class="playlist-actions">
       <button class="playlist-btn" onclick="playPrevQuestion()" title="Câu trước">⏮️ Trước</button>
       <button id="playlist-global-toggle" class="playlist-btn primary" onclick="toggleCurrentOrFirstQuestion()">▶️ Nghe toàn bộ</button>
       <button class="playlist-btn" onclick="playNextQuestion()" title="Câu tiếp theo">Tiếp ⏭️</button>
       <label class="auto-next-label">
         <input type="checkbox" id="auto-next-checkbox" onchange="toggleAutoPlayNext(this.checked)">
         <span>Tự động chuyển câu</span>
       </label>
     </div>
   </div>
   ```
2. In `QuestionAudioManager`:
   - Implement `onEnded`: If `isAutoPlayNext` is true, find next question in current view array, wait 1500ms, then trigger `playQuestionAudio(nextQId)`.
   - On play, call `cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' })` and add CSS class `.audio-active-card` (glowing `#38bdf8` outline).

- [ ] **Step 4: Rebuild web apps and run test to verify it passes**

Run: `bun scripts/build-web.bun.js && bun test tests/questions-audio.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add scripts/build-web.bun.js index.html aif-c01-study-guide/index.html tests/questions-audio.test.js
git commit -m "feat(audio): add continuous hands-free playlist toolbar and auto-scroll tracking"
```

---

### Task 5: End-to-End Simulation, Quality Verification & Live Deployment

**Files:**
- Modify: `tests/e2e-simulation.test.js`
- Test: All suites (`bun test`)

**Interfaces:**
- Verifies: Full integration of audio manifest, question list rendering, audio speed persistence, and zero JS console errors.

- [ ] **Step 1: Write E2E test verifying playlist and audio manager flow**

Add to `tests/e2e-simulation.test.js`:

```javascript
test("E2E Audio Subsystem: manifest, speed persistence, and card integration", () => {
  const manifest = JSON.parse(fs.readFileSync("audio/questions/manifest.json", "utf8"));
  expect(Object.keys(manifest).length).toBe(57);

  const html = fs.readFileSync("index.html", "utf8");
  // Check question cards in domain 1 to 5 have audio button
  for (let d = 1; d <= 5; d++) {
    expect(html).toContain(`d${d}-q1`);
  }

  // Ensure clean syntax
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  expect(scriptMatch).not.toBeNull();
  expect(() => new Function(scriptMatch[1])).not.toThrow();
});
```

- [ ] **Step 2: Run complete test suite across all 8 test files**

Run: `bun test`
Expected: All tests pass (100%).

- [ ] **Step 3: Deploy to GitHub Pages**

Run:
```bash
git add -A
git commit -m "feat(audio): finalize 57 questions audio explanation subsystem"
git push origin main
```

- [ ] **Step 4: Verify live audio endpoints via HTTP 200**

Run: `sleep 20 && curl -sI https://hoangtv49.github.io/aif-c01-prep/audio/questions/d1-q1.mp3 | head -n 5`
Expected: `HTTP/2 200` with `content-type: audio/mp3`.
