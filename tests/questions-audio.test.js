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
    options: ["A. Amazon Rekognition", "B. Amazon Textract", "C. Amazon Comprehend", "D. Amazon Transcribe"],
    correctAnswer: "B. Amazon Textract",
    reason: "Từ khóa: extract tabular data $\\rightarrow$ Amazon Textract đọc hiểu bảng biểu và form mẫu.",
    trap: "Đề bài nhắc đến ảnh scan rất dễ chọn Amazon Rekognition $\\rightarrow$ Lưu ý: đọc bảng biểu luôn chọn Textract."
  };

  const script = formatQuestionSpeechScript(sampleQuestion, "Domain 1: Nguyên lý cơ bản về AI và Học máy (20%)");

  expect(script).toContain("Câu hỏi số 1 của Domain 1");
  expect(script).toContain("Các phương án lựa chọn: Phương án A: Amazon Rekognition");
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

test("index.html contains audio buttons and AudioManager for questions", () => {
  const html = fs.readFileSync("index.html", "utf8");

  // Question cards template should have toggleQuestionAudio call
  expect(html).toContain("toggleQuestionAudio");
  expect(html).toContain("toggleQuestionAudio('${q.id}', event)");

  // Client JS AudioManager
  expect(html).toContain("class QuestionAudioManager");
  expect(html).toContain("audio-questions-manager");
});

test("Playlist Toolbar exists and controls auto-play next", () => {
  const html = fs.readFileSync("index.html", "utf8");

  expect(html).toContain("playlist-toolbar");
  expect(html).toContain("toggleAutoPlayNext");
  expect(html).toContain("playNextQuestion");
  expect(html).toContain("playPrevQuestion");
  expect(html).toContain("Tự động chuyển câu");
});

test("formatQuestionSpeechScript never overrides correct answer with distractor option A", () => {
  const { formatQuestionSpeechScript } = require("../scripts/generate-questions-audio.cjs");

  const questionWithOptionAWordAmazon = {
    id: "d1-q1",
    domainId: 1,
    number: 1,
    stem: "A company needs to extract tabular data from PDF contracts...",
    options: [
      { key: "A", text: "Amazon Rekognition" },
      { key: "B", text: "Amazon Textract" },
      { key: "C", text: "Amazon Comprehend" },
      { key: "D", text: "Amazon Transcribe" }
    ],
    correctAnswer: "B. Amazon Textract",
    reason: "Amazon Textract là dịch vụ chuyên biệt...",
    trap: "Đề bài nhắc đến ảnh scan rất dễ chọn Rekognition..."
  };

  const script = formatQuestionSpeechScript(questionWithOptionAWordAmazon, "Domain 1");
  expect(script).toContain("Phương án đúng là: B");
  expect(script).not.toContain("Phương án đúng là: A");
});

test("All 57 question audio files are complete and exceed 180KB", () => {
  const manifest = JSON.parse(fs.readFileSync("audio/questions/manifest.json", "utf8"));
  const keys = Object.keys(manifest);
  expect(keys.length).toBe(57);

  const truncated = [];
  keys.forEach(qId => {
    const rootPath = path.resolve(`audio/questions/${qId}.mp3`);
    const size = fs.existsSync(rootPath) ? fs.statSync(rootPath).size : 0;
    if (size <= 180000) {
      truncated.push({ qId, size });
    }
  });

  expect(truncated).toEqual([]);
});

test("index.html includes complete MediaSession handlers and fixed speed matching", () => {
  const html = fs.readFileSync("index.html", "utf8");
  expect(html).toContain("setActionHandler('play'");
  expect(html).toContain("setActionHandler('pause'");
  expect(html).toContain("setActionHandler('nexttrack'");
  expect(html).toContain("rate.toFixed(1) + 'x'");
});

test("Speech scripts use 100% natural Vietnamese translations for all 57 question stems", () => {
  const { getVietnameseScenario, VIETNAMESE_SCENARIOS } = require("../scripts/generate-questions-audio.cjs");

  expect(typeof getVietnameseScenario).toBe("function");
  expect(Object.keys(VIETNAMESE_SCENARIOS).length).toBe(57);

  const manifest = JSON.parse(fs.readFileSync("audio/questions/manifest.json", "utf8"));
  Object.keys(manifest).forEach(qId => {
    const vnScenario = getVietnameseScenario(qId);
    expect(vnScenario).toBeDefined();
    expect(vnScenario.length).toBeGreaterThan(25);
    expect(vnScenario).not.toContain("Which AWS service should");
    expect(vnScenario).not.toContain("What should the company do");
    expect(vnScenario).not.toContain("wants to automate");
  });
});
