const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const EXAMS = [
  { url: 'https://cloudexam.pro/course-review?course=6&exam=51&attempt=22123', outputName: 'raw-exam-2.json', name: 'Practice Test 02' },
  { url: 'https://cloudexam.pro/course-review?course=6&exam=52&attempt=22124', outputName: 'raw-exam-3.json', name: 'Practice Test 03' },
];

const OUTPUT_DIR = path.resolve(__dirname, '../aif-c01-study-guide/mock-exams');

(async () => {
  console.log('🚀 Launching browser...');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--no-first-run', '--no-default-browser-check']
  });
  
  const context = await browser.newContext({ viewport: { width: 1400, height: 900 } });
  const page = await context.newPage();
  
  // Navigate to CloudExam to check login
  console.log('📄 Navigating to CloudExam...');
  await page.goto('https://cloudexam.pro/', { waitUntil: 'networkidle' });
  
  const currentUrl = page.url();
  if (!currentUrl.includes('course-review')) {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  👉 Hãy ĐĂNG NHẬP vào tài khoản CloudExam Pro');
    console.log('  👉 Sau đó navigate tới BẤT KỲ trang review nào');
    console.log('  👉 Ví dụ: ' + EXAMS[0].url);
    console.log('  👉 Script sẽ tự động detect khi bạn vào đúng trang');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    
    await page.waitForURL('**/course-review**', { timeout: 300000 });
    console.log('✅ Detected review page! Starting extraction...');
  }

  for (const exam of EXAMS) {
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📝 Extracting: ${exam.name}`);
    console.log(`   URL: ${exam.url}`);
    console.log(`${'═'.repeat(60)}`);

    await page.goto(exam.url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Scroll to bottom to load all content
    console.log('📜 Scrolling to load all questions...');
    let previousHeight = 0;
    let currentHeight = await page.evaluate(() => document.body.scrollHeight);
    while (currentHeight > previousHeight) {
      previousHeight = currentHeight;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(800);
      currentHeight = await page.evaluate(() => document.body.scrollHeight);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);

    // Extract raw text
    console.log('🔍 Extracting text...');
    const rawText = await page.evaluate(() => document.body.innerText);

    // Save raw text
    const rawTextFile = path.join(OUTPUT_DIR, exam.outputName.replace('.json', '-text.txt'));
    fs.writeFileSync(rawTextFile, rawText);
    console.log(`💾 Raw text saved: ${rawTextFile}`);

    // Parse questions
    const blocks = rawText.split(/(?=^Question \d+:\s*$)/m);
    const questions = [];

    for (const block of blocks) {
      const headerMatch = block.match(/^Question (\d+):\s*\n(Correct|Skipped|Wrong|Incorrect)\s*\n/m);
      if (!headerMatch) continue;

      const qNum = parseInt(headerMatch[1]);
      const status = headerMatch[2];
      const bodyText = block.slice(headerMatch[0].length);
      const explSplit = bodyText.split(/^Explanation\s*$/m);
      const stemAndOptions = explSplit[0] || '';
      const explanationRaw = explSplit.slice(1).join('\nExplanation\n') || '';

      const lines = stemAndOptions.split('\n');
      const stemLines = [];
      const options = [];
      let currentOptionKey = null;
      let currentOptionText = [];

      for (const line of lines) {
        const trimmed = line.trim();
        const optLetterMatch = trimmed.match(/^([A-F])\.$/);
        if (optLetterMatch) {
          if (currentOptionKey) {
            options.push({ key: currentOptionKey, text: currentOptionText.join(' ').trim() });
          }
          currentOptionKey = optLetterMatch[1];
          currentOptionText = [];
          continue;
        }
        if (currentOptionKey) {
          if (trimmed.length > 0) currentOptionText.push(trimmed);
        } else {
          if (trimmed.length > 0) stemLines.push(trimmed);
        }
      }
      if (currentOptionKey) {
        options.push({ key: currentOptionKey, text: currentOptionText.join(' ').trim() });
      }

      // Parse explanation
      const explanation = { summary: '', correct: '', incorrect: [], tips: '' };
      let correctAnswer = [];

      const summaryMatch = explanationRaw.match(/📝 Tóm tắt đề:\s*\n([\s\S]*?)(?=✅ Đáp án đúng:|$)/);
      if (summaryMatch) explanation.summary = summaryMatch[1].trim();

      const correctMatch = explanationRaw.match(/✅ Đáp án đúng:\s*\n\n([\s\S]*?)(?=\nCác đáp án sai:|$)/);
      if (correctMatch) {
        explanation.correct = correctMatch[1].trim();
        const correctText = correctMatch[1].trim().split('\n')[0].trim();
        for (const opt of options) {
          if (correctText.toLowerCase().includes(opt.text.toLowerCase().substring(0, 20)) ||
              opt.text.toLowerCase().includes(correctText.toLowerCase().substring(0, 20))) {
            correctAnswer.push(opt.key);
          }
        }
      }

      const incorrectMatch = explanationRaw.match(/Các đáp án sai:\s*\n([\s\S]*?)(?=🔑 Tips and tricks:|$)/);
      if (incorrectMatch) {
        const items = incorrectMatch[1].split(/(?=❌ )/);
        for (const item of items) {
          const cleaned = item.trim();
          if (cleaned.startsWith('❌')) explanation.incorrect.push(cleaned);
        }
      }

      const tipsMatch = explanationRaw.match(/🔑 Tips and tricks:\s*\n([\s\S]*?)$/);
      if (tipsMatch) explanation.tips = tipsMatch[1].trim();

      // Fallback answer matching
      if (correctAnswer.length === 0 && explanation.correct) {
        const firstLine = explanation.correct.split('\n')[0].trim();
        for (const opt of options) {
          const optClean = opt.text.replace(/^Use\s+/i, '').toLowerCase();
          const corrClean = firstLine.replace(/^Use\s+/i, '').toLowerCase();
          if (optClean.includes(corrClean.substring(0, 15)) || corrClean.includes(optClean.substring(0, 15))) {
            correctAnswer.push(opt.key);
            break;
          }
        }
      }

      if (stemLines.join(' ').length > 10) {
        questions.push({ number: qNum, status, stem: stemLines.join(' ').trim(), options, correctAnswer: [...new Set(correctAnswer)], explanation });
      }
    }

    questions.sort((a, b) => a.number - b.number);

    const result = {
      extractedAt: new Date().toISOString(),
      sourceUrl: exam.url,
      examName: exam.name + ' - AWS AIF-C01',
      totalQuestions: questions.length,
      questions
    };

    const outputFile = path.join(OUTPUT_DIR, exam.outputName);
    fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

    const withAnswer = questions.filter(q => q.correctAnswer.length > 0).length;
    console.log(`✅ Parsed ${questions.length} questions (${withAnswer} with answer mapped)`);
    console.log(`💾 Saved to: ${outputFile}`);
  }

  console.log('\n✅ All exams extracted! Closing browser in 3 seconds...');
  await page.waitForTimeout(3000);
  await browser.close();
})().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
