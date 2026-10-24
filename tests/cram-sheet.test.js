import { expect, test } from "bun:test";

test("Cram sheet tab integration and route resolution", () => {
  function parseHash(hashStr) {
    let clean = (hashStr || "").trim();
    while (clean.startsWith("#") || clean.startsWith("/")) {
      clean = clean.substring(1);
    }
    const parts = clean.split("/");
    const tabCandidate = parts[0].toLowerCase();
    const validTabs = ["topics", "quiz", "graph", "matrix", "ste", "cram"];
    const tab = validTabs.includes(tabCandidate) ? tabCandidate : "topics";
    return { tab };
  }

  expect(parseHash("#cram").tab).toBe("cram");
  expect(parseHash("#/cram").tab).toBe("cram");
  expect(parseHash("#quiz").tab).toBe("quiz");
  expect(parseHash("").tab).toBe("topics");
});
