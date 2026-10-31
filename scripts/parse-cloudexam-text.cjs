const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.resolve(__dirname, '../aif-c01-study-guide/mock-exams/raw-text-backup.txt');
const OUTPUT_FILE = path.resolve(__dirname, '../aif-c01-study-guide/mock-exams/raw-exam-1.json');

const rawText = fs.readFileSync(INPUT_FILE, 'utf8');

// Split by "Question N:" pattern
const blocks = rawText.split(/(?=^Question \d+:\s*$)/m);

const questions = [];

for (const block of blocks) {
  const headerMatch = block.match(/^Question (\d+):\s*\n(Correct|Skipped|Wrong|Incorrect)\s*\n/m);
  if (!headerMatch) continue;

  const qNum = parseInt(headerMatch[1]);
  const status = headerMatch[2];

  // Remove header lines
  const bodyText = block.slice(headerMatch[0].length);

  // Split body into stem+options and explanation
  const explSplit = bodyText.split(/^Explanation\s*$/m);
  const stemAndOptions = explSplit[0] || '';
  const explanationRaw = explSplit.slice(1).join('\nExplanation\n') || '';

  // Parse stem and options from stemAndOptions
  // Options are on separate lines: "A.\n\n<text>\n\nB.\n\n<text>" etc.
  const lines = stemAndOptions.split('\n');
  
  const stemLines = [];
  const options = [];
  let currentOptionKey = null;
  let currentOptionText = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Check if this line is just an option letter (e.g. "A." or "B.")
    const optLetterMatch = trimmed.match(/^([A-F])\.$/);
    if (optLetterMatch) {
      // Save previous option if exists
      if (currentOptionKey) {
        options.push({ key: currentOptionKey, text: currentOptionText.join(' ').trim() });
      }
      currentOptionKey = optLetterMatch[1];
      currentOptionText = [];
      continue;
    }
    
    if (currentOptionKey) {
      // We're collecting option text
      if (trimmed.length > 0) {
        currentOptionText.push(trimmed);
      }
    } else {
      // We're collecting stem text
      if (trimmed.length > 0) {
        stemLines.push(trimmed);
      }
    }
  }
  // Don't forget the last option
  if (currentOptionKey) {
    options.push({ key: currentOptionKey, text: currentOptionText.join(' ').trim() });
  }

  // Parse explanation sections
  const explanation = {
    summary: '',      // 📝 Tóm tắt đề
    correct: '',      // ✅ Đáp án đúng
    incorrect: [],    // ❌ Các đáp án sai
    tips: ''          // 🔑 Tips and tricks
  };

  // Extract correct answer from explanation
  let correctAnswer = [];
  const correctMatch = explanationRaw.match(/✅ Đáp án đúng:\s*\n\n([\s\S]*?)(?=\nCác đáp án sai:|$)/);
  if (correctMatch) {
    explanation.correct = correctMatch[1].trim();
    // Extract the answer text to map back to option key
    const correctText = correctMatch[1].trim().split('\n')[0].trim();
    for (const opt of options) {
      if (correctText.toLowerCase().includes(opt.text.toLowerCase().substring(0, 20)) ||
          opt.text.toLowerCase().includes(correctText.toLowerCase().substring(0, 20))) {
        correctAnswer.push(opt.key);
      }
    }
  }

  // Extract summary
  const summaryMatch = explanationRaw.match(/📝 Tóm tắt đề:\s*\n([\s\S]*?)(?=✅ Đáp án đúng:|$)/);
  if (summaryMatch) {
    explanation.summary = summaryMatch[1].trim();
  }

  // Extract incorrect answers
  const incorrectMatch = explanationRaw.match(/Các đáp án sai:\s*\n([\s\S]*?)(?=🔑 Tips and tricks:|$)/);
  if (incorrectMatch) {
    const incorrectBlock = incorrectMatch[1];
    const incorrectItems = incorrectBlock.split(/(?=❌ )/);
    for (const item of incorrectItems) {
      const cleaned = item.trim();
      if (cleaned.startsWith('❌')) {
        explanation.incorrect.push(cleaned);
      }
    }
  }

  // Extract tips
  const tipsMatch = explanationRaw.match(/🔑 Tips and tricks:\s*\n([\s\S]*?)$/);
  if (tipsMatch) {
    explanation.tips = tipsMatch[1].trim();
  }

  // Try harder to find correct answer if not found yet
  if (correctAnswer.length === 0 && explanation.correct) {
    const firstLine = explanation.correct.split('\n')[0].trim();
    // Try exact match or partial match
    for (const opt of options) {
      // Remove common prefixes like "Use " for matching
      const optClean = opt.text.replace(/^Use\s+/i, '').toLowerCase();
      const corrClean = firstLine.replace(/^Use\s+/i, '').toLowerCase();
      if (optClean.includes(corrClean.substring(0, 15)) || corrClean.includes(optClean.substring(0, 15))) {
        correctAnswer.push(opt.key);
        break;
      }
    }
  }

  // If still no match, try to find from the full explanation block
  if (correctAnswer.length === 0) {
    const firstCorrectLine = (explanation.correct || '').split('\n')[0].trim();
    for (const opt of options) {
      if (firstCorrectLine && opt.text.includes(firstCorrectLine.substring(0, Math.min(20, firstCorrectLine.length)))) {
        correctAnswer.push(opt.key);
        break;
      }
    }
  }

  questions.push({
    number: qNum,
    status,
    stem: stemLines.join(' ').trim(),
    options,
    correctAnswer: [...new Set(correctAnswer)],
    explanation
  });
}

// Sort by question number
questions.sort((a, b) => a.number - b.number);

const result = {
  extractedAt: new Date().toISOString(),
  sourceUrl: 'https://cloudexam.pro/course-review?course=6&exam=50&attempt=22120',
  examName: 'Practice Test 01 - AWS AIF-C01',
  totalQuestions: questions.length,
  questions
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));

console.log(`✅ Parsed ${questions.length} questions`);
console.log(`💾 Saved to: ${OUTPUT_FILE}`);

// Stats
const withAnswer = questions.filter(q => q.correctAnswer.length > 0).length;
const withExplanation = questions.filter(q => q.explanation.correct.length > 0).length;
console.log(`📊 ${withAnswer}/${questions.length} questions have correct answer mapped`);
console.log(`📊 ${withExplanation}/${questions.length} questions have explanations`);

// Show first 3 questions as sample
console.log('\n--- Sample (first 3 questions) ---');
for (const q of questions.slice(0, 3)) {
  console.log(`\nQ${q.number} [${q.status}] (Answer: ${q.correctAnswer.join(',')})`);
  console.log(`  Stem: ${q.stem.substring(0, 100)}...`);
  console.log(`  Options: ${q.options.map(o => `${o.key}. ${o.text.substring(0, 40)}`).join(' | ')}`);
}
