import { expect, test } from "bun:test";
import fs from "fs";

test("Reading time estimation calculation algorithm", () => {
  function calcReadingTime(text, wpm = 200) {
    if (!text) return 1;
    // Strip markdown formatting and count words
    const cleanText = text.replace(/[#*`_~\[\]()>-]/g, " ").replace(/\s+/g, " ").trim();
    const words = cleanText ? cleanText.split(" ").length : 0;
    return Math.max(1, Math.round(words / wpm));
  }

  function calcQuestionPracticeTime(questionCount, minPerQ = 1.5) {
    return Math.round(questionCount * minPerQ);
  }

  // 1000 words -> ~5 mins
  const sample1000Words = Array(1000).fill("test").join(" ");
  expect(calcReadingTime(sample1000Words)).toBe(5);

  // 200 words -> 1 min
  const sample200Words = Array(200).fill("word").join(" ");
  expect(calcReadingTime(sample200Words)).toBe(1);

  // 11 questions -> ~16-17 mins
  expect(calcQuestionPracticeTime(11)).toBe(17);
  // 57 questions -> ~86 mins (round to ~85 mins)
  expect(calcQuestionPracticeTime(57)).toBe(86);
});

test("Generated index.html contains reading time pills across all study pages", () => {
  const html = fs.readFileSync("index.html", "utf8");
  expect(html).toContain("reading-time-pill");
  
  // Tab 2 Exam reading time pill
  expect(html).toContain("85 phút");

  // Tab 4 Matrix & Confusing pairs reading time pills
  expect(html).toContain("~10p");
  expect(html).toContain("~12p");

  // Tab 5 STE Dictionary & Flashcards reading time pills
  expect(html).toContain("~18p");
  expect(html).toContain("~20p");

  // Tab 6 Cram sheet reading time
  expect(html).toContain("10 phút");
});
