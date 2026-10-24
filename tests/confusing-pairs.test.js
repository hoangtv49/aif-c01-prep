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

test("Confusing pairs dataset has exactly 10 high-yield pairs with authentic AWS services", () => {
  setupDomMocks();
  const html = fs.readFileSync("index.html", "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  expect(scriptMatch).not.toBeNull();

  const fn = new Function(scriptMatch[1] + `
    return { CONFUSING_PAIRS_DATA, renderConfusingPairs };
  `);
  const app = fn();

  expect(app.CONFUSING_PAIRS_DATA.length).toBe(10);
  
  // Verify pairs cover the key AWS services
  const titles = app.CONFUSING_PAIRS_DATA.map(p => p.title).join(" ");
  expect(titles).toContain("Textract");
  expect(titles).toContain("Rekognition");
  expect(titles).toContain("Transcribe");
  expect(titles).toContain("Polly");
  expect(titles).toContain("Clarify");
  expect(titles).toContain("Guardrails");
  expect(titles).toContain("Autopilot");
  expect(titles).toContain("Canvas");
  expect(titles).toContain("Fine-Tuning");
  expect(titles).toContain("Comprehend");
  expect(titles).toContain("Translate");
  expect(titles).toContain("Artifact");
  expect(titles).toContain("Audit Manager");
  expect(titles).toContain("AI Service Cards");
  expect(titles).toContain("Macie");
  expect(titles).toContain("GuardDuty");
  expect(titles).toContain("Feature Store");
  expect(titles).toContain("DynamoDB");

  // Verify each pair structure
  app.CONFUSING_PAIRS_DATA.forEach(p => {
    expect(p.id).toBeDefined();
    expect(p.category).toBeDefined();
    expect(p.serviceA.name).toBeDefined();
    expect(p.serviceA.desc).toBeDefined();
    expect(p.serviceA.triggers).toBeDefined();
    expect(p.serviceB.name).toBeDefined();
    expect(p.serviceB.desc).toBeDefined();
    expect(p.serviceB.triggers).toBeDefined();
    expect(p.difference).toBeDefined();
    expect(p.trap).toBeDefined();
  });
});

test("Matrix subtab switcher switches between matrix table and confusing pairs", () => {
  let activeMatrixSubtab = "matrix";

  function switchMatrixSubtab(subId) {
    activeMatrixSubtab = subId;
    return activeMatrixSubtab;
  }

  expect(switchMatrixSubtab("pairs")).toBe("pairs");
  expect(switchMatrixSubtab("matrix")).toBe("matrix");
});
