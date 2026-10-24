import fs from "fs";
import path from "path";

const BASE_DIR = path.resolve("/home/hoangtv/Learning/aif-c01-study-guide");
const REQUIRED_FILES = [
  "README.md",
  "domain-1-fundamentals-ai-ml.md",
  "domain-2-generative-ai.md",
  "domain-3-fm-applications.md",
  "domain-4-responsible-ai.md",
  "domain-5-security-compliance-governance.md"
];

let errors = [];

// 1. Verify existence
for (const file of REQUIRED_FILES) {
  const filePath = path.join(BASE_DIR, file);
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${file}`);
  }
}

if (errors.length > 0) {
  console.error("Verification FAILED:\n" + errors.join("\n"));
  process.exit(1);
}

// 2. Validate Domain files content
for (const file of REQUIRED_FILES.filter(f => f.startsWith("domain-"))) {
  const filePath = path.join(BASE_DIR, file);
  const content = fs.readFileSync(filePath, "utf8");

  // Check questions count
  const questionMatches = content.match(/### Question \d+|#### Question \d+|\*\*Question \d+:\*\*/g) || [];
  if (questionMatches.length < 5) {
    errors.push(`${file}: Has only ${questionMatches.length} questions (minimum 5 required).`);
  }

  // Check distractor analysis presence
  const distractorCount = (content.match(/Phân tích.*(sai|bẫy|Distractor)/gi) || []).length;
  if (distractorCount < 5) {
    errors.push(`${file}: Missing distractor analysis sections for some questions.`);
  }

  // Check STE table sentence length
  const lines = content.split("\n");
  let inTable = false;
  lines.forEach((line, idx) => {
    if (line.includes("| Term") || line.includes("| Thuật ngữ")) inTable = true;
    if (inTable && line.startsWith("|") && !line.includes("---")) {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length >= 4) {
        const steDef = parts[2];
        if (steDef && !steDef.includes("ASD-STE100 Definition") && steDef.length > 0) {
          const sentences = steDef.split(/(?<=[.?!])\s+/);
          for (const s of sentences) {
            const wordCount = s.trim().split(/\s+/).filter(Boolean).length;
            if (wordCount > 25) {
              errors.push(`${file}:${idx + 1}: STE sentence exceeds 25 words (${wordCount} words): "${s}"`);
            }
          }
        }
      }
    }
    if (inTable && line.trim() === "") inTable = false;
  });
}

if (errors.length > 0) {
  console.error("Content verification FAILED:\n" + errors.join("\n"));
  process.exit(1);
}

console.log("All files verified successfully! ASD-STE100 and Exam Blueprint standards passed.");
