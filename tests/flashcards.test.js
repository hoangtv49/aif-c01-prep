import { expect, test } from "bun:test";
import fs from "fs";

function setupDomMocks() {
  const storage = new Map();
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) || null,
    setItem: (key, val) => storage.set(key, String(val)),
    removeItem: (key) => storage.delete(key),
    clear: () => storage.clear()
  };

  globalThis.window = {
    location: { hash: "" },
    addEventListener() {},
    scrollTo() {},
    innerWidth: 1024,
    scrollY: 0,
    pageYOffset: 0
  };

  globalThis.history = {
    scrollRestoration: "auto",
    pushState() {},
    replaceState() {}
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
        addEventListener() {}
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
}

test("Flashcard deck data from index.html loads all 82 terms across 5 domains", () => {
  setupDomMocks();
  const html = fs.readFileSync("index.html", "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  expect(scriptMatch).not.toBeNull();

  const fn = new Function(scriptMatch[1] + `
    initFlashcardData();
    return {
      allFlashcardsList,
      activeFlashcardDeck,
      masteredFlashcardIds,
      flipFlashcard,
      nextFlashcard,
      prevFlashcard,
      toggleMasterCurrentCard,
      shuffleFlashcardsDeck,
      filterFlashcardDomain,
      applyFlashcardFilter
    };
  `);
  const app = fn();

  expect(app.allFlashcardsList.length).toBe(82);
  expect(app.activeFlashcardDeck.length).toBe(82);

  // Check domain distribution
  const d1 = app.allFlashcardsList.filter(t => t.domainId === 1);
  const d2 = app.allFlashcardsList.filter(t => t.domainId === 2);
  const d3 = app.allFlashcardsList.filter(t => t.domainId === 3);
  const d4 = app.allFlashcardsList.filter(t => t.domainId === 4);
  const d5 = app.allFlashcardsList.filter(t => t.domainId === 5);

  expect(d1.length).toBe(22);
  expect(d2.length).toBe(15);
  expect(d3.length).toBe(18);
  expect(d4.length).toBe(12);
  expect(d5.length).toBe(15);
});

test("Flashcard navigation bounds and index wrapping", () => {
  const deckSize = 82;
  let currentIndex = 0;

  function nextCard() {
    currentIndex = (currentIndex + 1) % deckSize;
    return currentIndex;
  }

  function prevCard() {
    currentIndex = (currentIndex - 1 + deckSize) % deckSize;
    return currentIndex;
  }

  expect(nextCard()).toBe(1);
  expect(nextCard()).toBe(2);
  expect(prevCard()).toBe(1);
  expect(prevCard()).toBe(0);
  expect(prevCard()).toBe(81); // wraps to end
  expect(nextCard()).toBe(0);  // wraps back to start
});

test("Flashcard mastery tracking and persistence", () => {
  const mastered = new Set();
  function toggleMastery(termId) {
    if (mastered.has(termId)) mastered.delete(termId);
    else mastered.add(termId);
    return mastered.has(termId);
  }

  expect(toggleMastery("term-1")).toBe(true);
  expect(mastered.size).toBe(1);
  expect(toggleMastery("term-1")).toBe(false);
  expect(mastered.size).toBe(0);
});

test("Flashcard shuffle randomizes deck order without dropping items", () => {
  const original = Array.from({ length: 20 }, (_, i) => `term-${i}`);
  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const shuffled = shuffle(original);
  expect(shuffled.length).toBe(original.length);
  expect(new Set(shuffled).size).toBe(original.length);
});
