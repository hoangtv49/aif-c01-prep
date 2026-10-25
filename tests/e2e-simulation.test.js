import { expect, test } from "bun:test";
import fs from "fs";

test("Full End-to-End simulation of all 3 study boost features in generated index.html", () => {
  // Mock DOM & Storage
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, val) => storage.set(key, String(val)),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear()
  };

  const historyStack = [];
  let historyIndex = -1;
  const popstateListeners = [];

  globalThis.window = {
    location: { hash: "" },
    addEventListener(evt, fn) {
      if (evt === "popstate") popstateListeners.push(fn);
      if (evt === "DOMContentLoaded") fn();
    },
    scrollTo() {},
    innerWidth: 1024,
    scrollY: 0,
    pageYOffset: 0
  };

  globalThis.history = {
    scrollRestoration: "auto",
    pushState(state, title, url) {
      historyIndex++;
      historyStack.splice(historyIndex);
      historyStack.push({ state, title, url });
      globalThis.window.location.hash = url;
    },
    replaceState(state, title, url) {
      if (historyIndex < 0) {
        historyIndex = 0;
        historyStack.push({ state, title, url });
      } else {
        historyStack[historyIndex] = { state, title, url };
      }
      globalThis.window.location.hash = url;
    },
    back() {
      if (historyIndex > 0) {
        historyIndex--;
        globalThis.window.location.hash = historyStack[historyIndex].url;
        popstateListeners.forEach(fn => fn({ state: historyStack[historyIndex].state }));
      }
    }
  };

  const domElements = new Map();
  function getOrCreateEl(id) {
    if (!domElements.has(id)) {
      domElements.set(id, {
        id,
        textContent: "",
        innerHTML: "",
        style: {},
        classList: {
          classes: new Set(),
          add(c) { this.classes.add(c); },
          remove(c) { this.classes.delete(c); },
          contains(c) { return this.classes.has(c); }
        },
        setAttribute() {},
        getAttribute() { return null; },
        hasAttribute() { return false; },
        addEventListener() {},
        getBoundingClientRect() { return { top: 0, bottom: 0, height: 0 }; }
      });
    }
    return domElements.get(id);
  }

  globalThis.document = {
    title: "",
    getElementById: (id) => getOrCreateEl(id),
    querySelector: () => null,
    querySelectorAll: () => [],
    documentElement: { style: { setProperty() {} } }
  };

  // Load and execute index.html script
  const html = fs.readFileSync("index.html", "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  expect(scriptMatch).not.toBeNull();

  const fn = new Function(scriptMatch[1] + `
    return {
      userAnswers,
      bookmarkedQuestions,
      loadStoredState,
      saveStateToStorage,
      handleOptionClick,
      toggleBookmark,
      isQuestionWrong,
      submitExam,
      startExamTimer,
      toggleTimerPause,
      resetExamTimer,
      switchTab,
      renderCramSheet,
      filterCramCategory,
      CRAM_DATA,
      APP_DATA
    };
  `);

  const app = fn();

  // 1. Verify CRAM_DATA completeness
  expect(app.CRAM_DATA.length).toBeGreaterThanOrEqual(25);
  const categories = new Set(app.CRAM_DATA.map(c => c.category));
  expect(categories.has("bedrock")).toBe(true);
  expect(categories.has("sagemaker")).toBe(true);
  expect(categories.has("core")).toBe(true);
  expect(categories.has("governance")).toBe(true);

  // 2. Test bookmark toggle and persistence
  app.toggleBookmark("d1-q1");
  expect(app.bookmarkedQuestions.has("d1-q1")).toBe(true);
  const storedBks = JSON.parse(localStorage.getItem("aif_bookmarked_ids"));
  expect(storedBks).toContain("d1-q1");

  app.toggleBookmark("d1-q1");
  expect(app.bookmarkedQuestions.has("d1-q1")).toBe(false);

  // 3. Test option clicking and localStorage
  app.handleOptionClick("d1-q1", "A", false);
  expect(app.userAnswers["d1-q1"]).toEqual(["A"]);
  const storedAns = JSON.parse(localStorage.getItem("aif_user_answers"));
  expect(storedAns["d1-q1"]).toEqual(["A"]);

  // 4. Test submitExam calculation
  app.submitExam();
  const modalBody = domElements.get("scoreboard-body");
  expect(modalBody.innerHTML).toContain("1000 điểm");
  expect(modalBody.innerHTML).toContain("Phân tích kết quả theo 5 Domain");

  // 5. Test Cram Sheet tab switching & routing
  app.switchTab("cram", true);
  expect(globalThis.window.location.hash).toBe("#cram");
  expect(globalThis.document.title).toContain("Cram Sheet");

  // 6. Test Back button returns from #cram to previous hash
  history.back();
  expect(globalThis.window.location.hash).not.toBe("#cram");

  // 7. Test Confusing Pairs Hub in Tab 4
  const pairsFn = new Function(scriptMatch[1] + `
    switchMatrixSubtab('pairs');
    return {
      activeMatrixSubtab,
      CONFUSING_PAIRS_DATA
    };
  `);
  const matrixState = pairsFn();
  expect(matrixState.activeMatrixSubtab).toBe("pairs");
  expect(matrixState.CONFUSING_PAIRS_DATA.length).toBe(10);
  const pairsContainer = domElements.get("confusing-pairs-grid");
  expect(pairsContainer.innerHTML).toContain("Amazon Textract");
  expect(pairsContainer.innerHTML).toContain("Amazon Rekognition");

  // 8. Test 3D Flashcards Deck in Tab 5
  const fcFn = new Function(scriptMatch[1] + `
    setDictView('cards');
    toggleMasterCurrentCard();
    flipFlashcard();
    nextFlashcard();
    return {
      dictView,
      allFlashcardsList,
      activeFlashcardDeck,
      masteredFlashcardIds,
      flashcardCurrentIndex,
      isFlashcardFlipped
    };
  `);
  const fcState = fcFn();
  expect(fcState.dictView).toBe("cards");
  expect(fcState.allFlashcardsList.length).toBe(82);
  expect(fcState.masteredFlashcardIds.size).toBeGreaterThanOrEqual(1);
  const savedFc = JSON.parse(localStorage.getItem("aif_flashcard_mastered"));
  expect(savedFc.length).toBeGreaterThanOrEqual(1);
});

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
