import { expect, test } from "bun:test";

test("AWS Scaled Score calculation adheres to 100-1000 scale with 700 pass threshold", () => {
  function calcScore(correct, total) {
    if (total === 0) return 100;
    return 100 + Math.round((correct / total) * 900);
  }

  expect(calcScore(0, 57)).toBe(100);
  expect(calcScore(57, 57)).toBe(1000);

  // Passing threshold: 700+
  // 38/57 = 66.6% -> 100 + 600 = 700
  expect(calcScore(38, 57)).toBe(700);
  expect(calcScore(37, 57)).toBe(684);
  expect(calcScore(45, 57)).toBe(811);
});

test("Timer formatting HH:MM:SS", () => {
  function formatTimer(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    const pad = (n) => String(n).padStart(2, "0");
    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  }

  expect(formatTimer(5100)).toBe("01:25:00");
  expect(formatTimer(900)).toBe("15:00");
  expect(formatTimer(45)).toBe("00:45");
});

test("Domain breakdown computes correct domain percentages", () => {
  const questions = [
    { id: "d1-1", domainId: 1, correctAnswer: "A" },
    { id: "d1-2", domainId: 1, correctAnswer: "B" },
    { id: "d2-1", domainId: 2, correctAnswer: "C" },
    { id: "d2-2", domainId: 2, correctAnswer: "D" },
  ];
  const userAnswers = {
    "d1-1": ["A"], // correct
    "d1-2": ["C"], // wrong
    "d2-1": ["C"], // correct
    "d2-2": ["D"], // correct
  };

  const domainStats = {};
  [1, 2].forEach(dId => {
    domainStats[dId] = { total: 0, correct: 0 };
  });

  questions.forEach(q => {
    domainStats[q.domainId].total++;
    const sel = userAnswers[q.id] || [];
    if (sel.join("") === q.correctAnswer) {
      domainStats[q.domainId].correct++;
    }
  });

  expect(domainStats[1].correct).toBe(1);
  expect(domainStats[1].total).toBe(2);
  expect(Math.round((domainStats[1].correct / domainStats[1].total) * 100)).toBe(50);

  expect(domainStats[2].correct).toBe(2);
  expect(domainStats[2].total).toBe(2);
  expect(Math.round((domainStats[2].correct / domainStats[2].total) * 100)).toBe(100);
});
