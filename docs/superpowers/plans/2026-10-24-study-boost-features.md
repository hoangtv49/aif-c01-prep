# Study Boost Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 3 high-impact study acceleration features for AWS Certified AI Practitioner (AIF-C01): LocalStorage progress persistence with wrong-answer & bookmark notebooks, an 85-minute timed exam simulator with official AWS 100-1000 scaled score modal and domain breakdown, and an ultra-condensed 10-minute pre-exam Cram Sheet (Cheat Sheet) with instant routing.

**Architecture:** Extend `scripts/build-web.bun.js` to compile the enhanced state management, countdown timer, scoring engine, scoreboard dialog, and cram sheet component directly into the standalone SPAs (`index.html` and `aif-c01-study-guide/index.html`). Integrate with existing URL hash routing (`#quiz`, `#quiz/results`, `#cram`).

**Tech Stack:** Vanilla JavaScript (ES6+), CSS3 Flexbox/Grid with glassmorphism styling, HTML5 Web Storage API (`localStorage`), Bun compiler, GitHub Pages.

**Spec:** In-chat approved design covering:
1. Progress Persistence & Bookmarks: `localStorage` (`aif_user_answers`, `aif_bookmarked_ids`, `aif_revealed_cards`), star button ⭐ on each card, filter chips for wrong answers (`🔴 Câu làm sai`) and bookmarks (`⭐ Đã đánh dấu`), and retry wrong questions action.
2. Timed Exam Simulator: 85-minute countdown timer with warnings at 15m (yellow) and 5m (pulsing red), pause/resume, and Submit Exam modal calculating AWS Scaled Score ($100 + \text{round}((\text{correct}/\text{total}) \times 900)$), Pass/Fail threshold ($\ge 700$), and 5-Domain accuracy breakdown.
3. Cram Sheet: Dedicated `#cram` tab & bottom/top navigation item featuring 4 rapid-recall tables for SageMaker, Bedrock, Core AI, and Security/Governance keyword-to-service rules.

---

## Global Constraints
- Must remain 100% self-contained in standalone `index.html` (no external runtime npm packages or CDN dependencies required).
- All changes must be made in `scripts/build-web.bun.js` and compiled cleanly to `index.html` and `aif-c01-study-guide/index.html`.
- Mobile-first responsiveness: all new controls (timer, bookmark button, submit button, scoreboard modal, cram sheet) must render flawlessly without horizontal scrolling on 360px+ screens.
- Zero data loss: `localStorage` reads must be resilient against missing keys or corrupted JSON without throwing uncaught exceptions.
- Routing integrity: browser Back/Forward navigation must continue to work across all tabs including `#cram`.

---

## Review Focus
1. `localStorage` disabled or throwing quota exceeded: app must gracefully fallback to in-memory state without crashing.
2. Multiple choice questions (Choose TWO): wrong answer filter must accurately flag questions where either answer is wrong or incomplete.
3. Timer expiration: when the 85-minute timer hits 00:00:00, it must automatically stop and prompt the user to submit without losing their selected answers.
4. Scaled score edge cases: 0 correct must yield exactly 100 points; 57/57 correct must yield exactly 1000 points.
5. Mobile layout of the sticky timer and scoreboard modal: must not overlap sticky headers or bottom navigation bar.

---

### Task 1: Progress Persistence & Mistake Notebook (`localStorage` & Bookmarks)

**Files:**
- Modify: `scripts/build-web.bun.js`
- Test: automated Bun simulation script `tests/test-storage-bookmarks.bun.js`

**Interfaces:**
- Produces: `saveProgressToStorage()`, `loadProgressFromStorage()`, `toggleBookmark(qId)`, `clearWrongAnswers()`, `filterWrongAnswers()`, `filterBookmarks()`

- [ ] **Step 1: Write test for localStorage sync and bookmark logic**
- [ ] **Step 2: Run test to verify failure before implementation**
- [ ] **Step 3: Implement localStorage persistence, bookmark ⭐ buttons, and filter chips in `scripts/build-web.bun.js`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit changes**

---

### Task 2: 85-Minute Timed Exam Simulator & AWS Scaled Scoring Modal

**Files:**
- Modify: `scripts/build-web.bun.js`
- Test: automated Bun simulation script `tests/test-timer-scoring.bun.js`

**Interfaces:**
- Produces: `startExamTimer()`, `toggleTimerPause()`, `resetExamTimer()`, `calculateAwsScaledScore()`, `submitExam()`, `closeScoreboardModal()`, `reviewWrongAnswers()`

- [ ] **Step 1: Write test for AWS scaled score algorithm (100-1000) and domain breakdown calculations**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement sticky timer, submit modal, score breakdown calculation, and domain analysis**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit changes**

---

### Task 3: 10-Minute Pre-Exam Cram Sheet (Cheat Sheet) View & Navigation

**Files:**
- Modify: `scripts/build-web.bun.js`
- Test: automated Bun simulation script `tests/test-cram-sheet.bun.js`

**Interfaces:**
- Produces: `#cram` route, `renderCramSheet()`, top tab and bottom nav item for Cram Sheet

- [ ] **Step 1: Write test verifying `#cram` route resolution and cram sheet data completeness**
- [ ] **Step 2: Run test to verify failure**
- [ ] **Step 3: Implement Cram Sheet component and navigation buttons in `scripts/build-web.bun.js`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit changes**

---

### Task 4: End-to-End Build, Verification, and GitHub Deployment

**Files:**
- Compile: `index.html`, `aif-c01-study-guide/index.html`
- Git push: `origin/main`

- [ ] **Step 1: Run Bun build generator to compile both standalone HTML files**
- [ ] **Step 2: Run comprehensive end-to-end verification script across all 3 features**
- [ ] **Step 3: Commit and push to origin/main**
- [ ] **Step 4: Verify live deployment on GitHub Pages**
