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
