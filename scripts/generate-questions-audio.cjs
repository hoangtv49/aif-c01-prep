const fs = require("fs");
const path = require("path");
const { EdgeTTS } = require("node-edge-tts");

function sanitizeSpeechText(text) {
  if (!text) return "";
  return text
    .replace(/\$\s*\\rightarrow\s*\$/g, " suy ra ")
    .replace(/\$\s*\\to\s*\$/g, " suy ra ")
    .replace(/\\rightarrow/g, " suy ra ")
    .replace(/\\to\b/g, " suy ra ")
    .replace(/\$\\le\s*(\d+)\$/g, " nhỏ hơn hoặc bằng $1 ")
    .replace(/\$([^\$]+)\$/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function formatQuestionSpeechScript(q, domainTitle) {
  const domainClean = (domainTitle || `Domain ${q.domainId}`).replace(/\s*\(\d+%\)/, "").trim();
  const stemClean = sanitizeSpeechText(q.stem);
  const answerClean = sanitizeSpeechText(q.correctAnswer);
  const reasonClean = sanitizeSpeechText(q.reason)
    .replace(/^Từ khóa quan trọng:?/i, "Từ khóa quan trọng:")
    .replace(/^-\s*/gm, "");
  const trapClean = sanitizeSpeechText(q.trap || q.distractor || "");

  let script = `Câu hỏi số ${q.number} của ${domainClean}. `;
  script += `Tình huống: ${stemClean}. `;
  script += `Phương án đúng là: ${answerClean}. `;
  if (reasonClean) {
    script += `Phân tích: ${reasonClean}. `;
  }
  if (trapClean) {
    script += `Lưu ý bẫy thi: ${trapClean}. `;
  }
  return script.replace(/\s+/g, " ").trim();
}

module.exports = {
  sanitizeSpeechText,
  formatQuestionSpeechScript
};
