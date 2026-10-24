# Confusing Pairs Hub & Interactive Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 2 high-yield study features for AWS Certified AI Practitioner (AIF-C01): A Top 10 Confusing Pairs Hub with side-by-side versus cards and trigger keyword analysis in Tab 4, and an interactive 3D Flashcards Deck with flip animations, shuffle, and mastery tracking in Tab 5.

**Architecture:** Extend `scripts/build-web.bun.js` to compile the Confusing Pairs dataset and the interactive 3D Flashcard engine into the standalone SPAs (`index.html` and `aif-c01-study-guide/index.html`).

**Tech Stack:** Vanilla JavaScript (ES6+), CSS 3D transforms (`perspective`, `transform-style: preserve-3d`, `rotateY`), HTML5 Web Storage API (`localStorage`), Bun compiler, GitHub Pages.

**Spec:** In-chat approved design covering:
1. Confusing Pairs Hub in Tab 4: Sub-tabs (`📋 Ma trận Quyết định (25)` vs `🥊 Cặp Dịch Vụ Dễ Nhầm Lẫn (10)`), side-by-side comparison cards covering Purpose, Input, Trigger Keywords, and Traps.
2. Interactive Flashcards in Tab 5: Toggle between Table view and Flashcard view, 3D flip card, Next/Prev navigation, Shuffle, and Mastery progress tracking (`Đã thuộc` / `Chưa thuộc`).

---

## Global Constraints
- Must remain 100% self-contained in standalone `index.html` (zero external runtime npm packages or CDN dependencies).
- All code modifications must be in `scripts/build-web.bun.js` and compiled cleanly to `index.html` and `aif-c01-study-guide/index.html`.
- Mobile-first responsiveness: versus cards and 3D flashcards must render cleanly without horizontal overflow on 360px+ screens.
- Router integrity: browser Back/Forward navigation must continue to work across all tabs.

---

## Review Focus
1. 3D card flip on mobile: ensure `-webkit-backface-visibility: hidden` is applied so text does not mirror or bleed through.
2. Flashcard index bounds: navigating prev when at index 0 or next at last index must wrap or disable safely without runtime errors.
3. Mastery tracking: marking cards as mastered must persist across deck shuffles and save progress to `localStorage`.
4. Responsive subtabs in Tab 4: subtab buttons must switch views instantly without resetting search states.
5. Touch targets on mobile: flashcard navigation and mastery buttons must have minimum 38px touch targets.

---

### Task 1: Top 10 Confusing Pairs Hub in Tab 4

**Files:**
- Modify: `scripts/build-web.bun.js`
- Test: automated Bun simulation script `tests/confusing-pairs.test.js`

**Interfaces:**
- Produces: `CONFUSING_PAIRS_DATA`, `switchMatrixSubtab(subId)`, `renderConfusingPairs()`

- [ ] **Step 1: Write test verifying Confusing Pairs dataset completeness and subtab switching**
- [ ] **Step 2: Run test to verify failure before implementation**
- [ ] **Step 3: Implement Confusing Pairs dataset, sub-tab controls, and versus cards in `scripts/build-web.bun.js`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit changes**

---

### Task 2: Interactive 3D Flashcards Deck in Tab 5

**Files:**
- Modify: `scripts/build-web.bun.js`
- Test: automated Bun simulation script `tests/flashcards.test.js`

**Interfaces:**
- Produces: `toggleDictionaryView(viewMode)`, `flipFlashcard()`, `nextFlashcard()`, `prevFlashcard()`, `shuffleFlashcards()`, `markFlashcardMastered()`, `resetFlashcards()`

- [ ] **Step 1: Write test verifying Flashcard 3D flip state, navigation bounds, and mastery calculations**
- [ ] **Step 2: Run test to verify failure before implementation**
- [ ] **Step 3: Implement Flashcard component, 3D flip animation, and controls in `scripts/build-web.bun.js`**
- [ ] **Step 4: Run test to verify pass**
- [ ] **Step 5: Commit changes**

---

### Task 3: End-to-End Build, Verification, and GitHub Deployment

**Files:**
- Compile: `index.html`, `aif-c01-study-guide/index.html`
- Git push: `origin/main`

- [ ] **Step 1: Run Bun build generator to compile both standalone HTML files**
- [ ] **Step 2: Run complete test suite across all feature sets**
- [ ] **Step 3: Commit and push to origin/main**
- [ ] **Step 4: Verify live deployment on GitHub Pages**
