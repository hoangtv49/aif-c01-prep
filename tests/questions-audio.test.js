import { expect, test } from "bun:test";
import fs from "fs";
import path from "path";

test("Speech script builder sanitizes markdown and formats Option 1 structure", () => {
  const { formatQuestionSpeechScript, sanitizeSpeechText } = require("../scripts/generate-questions-audio.cjs");

  const sampleQuestion = {
    id: "d1-q1",
    domainId: 1,
    number: 1,
    stem: "A financial company needs to extract tabular data from scanned PDF contracts. Which AWS service should be used?",
    correctAnswer: "B. Amazon Textract",
    reason: "Từ khóa: extract tabular data $\\rightarrow$ Amazon Textract đọc hiểu bảng biểu và form mẫu.",
    trap: "Đề bài nhắc đến ảnh scan rất dễ chọn Amazon Rekognition $\\rightarrow$ Lưu ý: đọc bảng biểu luôn chọn Textract."
  };

  const script = formatQuestionSpeechScript(sampleQuestion, "Domain 1: Nguyên lý cơ bản về AI và Học máy (20%)");

  expect(script).toContain("Câu hỏi số 1 của Domain 1");
  expect(script).toContain("Phương án đúng là: B");
  expect(script).toContain("Amazon Textract");
  expect(script).not.toContain("$\\rightarrow$");
  expect(script).toContain("suy ra");
  expect(script).toContain("Lưu ý bẫy thi");
});

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
