import { expect, test } from "bun:test";
import fs from "fs";

// Mock localStorage
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear()
};

test("localStorage persistence and bookmark management", () => {
  // Test basic save & load logic
  const mockUserAnswers = { "d1-q1": ["B"], "d1-q2": ["A"] };
  const mockBookmarks = new Set(["d1-q1", "d3-q5"]);
  const mockRevealed = new Set(["d1-q2"]);

  localStorage.setItem("aif_user_answers", JSON.stringify(mockUserAnswers));
  localStorage.setItem("aif_bookmarked_ids", JSON.stringify(Array.from(mockBookmarks)));
  localStorage.setItem("aif_revealed_cards", JSON.stringify(Array.from(mockRevealed)));

  const loadedAns = JSON.parse(localStorage.getItem("aif_user_answers"));
  expect(loadedAns["d1-q1"]).toEqual(["B"]);

  const loadedBk = new Set(JSON.parse(localStorage.getItem("aif_bookmarked_ids")));
  expect(loadedBk.has("d3-q5")).toBe(true);
  expect(loadedBk.has("d2-q1")).toBe(false);
});

test("Wrong answer filter logic identifies incorrect and incomplete answers", () => {
  const sampleQuestions = [
    { id: "q1", isMultiple: false, correctAnswer: "B" },
    { id: "q2", isMultiple: false, correctAnswer: "C" },
    { id: "q3", isMultiple: true, correctAnswer: "B, D" },
    { id: "q4", isMultiple: false, correctAnswer: "A" }
  ];

  const userAnswers = {
    "q1": ["B"], // Correct
    "q2": ["A"], // Wrong
    "q3": ["B"], // Incomplete / Wrong
    // q4 unattempted
  };

  function isQuestionWrong(q, answers) {
    const sel = answers[q.id] || [];
    if (sel.length === 0) return false; // Unanswered
    const correct = q.correctAnswer.match(/\b[A-E]\b/g) || [];
    if (q.isMultiple) {
      if (sel.length !== correct.length) return true;
      return !sel.every(k => correct.includes(k));
    } else {
      return sel[0] !== correct[0];
    }
  }

  expect(isQuestionWrong(sampleQuestions[0], userAnswers)).toBe(false);
  expect(isQuestionWrong(sampleQuestions[1], userAnswers)).toBe(true);
  expect(isQuestionWrong(sampleQuestions[2], userAnswers)).toBe(true);
  expect(isQuestionWrong(sampleQuestions[3], userAnswers)).toBe(false);
});
