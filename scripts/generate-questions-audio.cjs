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
    .replace(/---/g, " ")
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

async function synthesizeAllQuestions(force = false) {
  const BASE_DIR = path.resolve(__dirname, "../aif-c01-study-guide");
  const audioDir = path.resolve(__dirname, "../audio/questions");
  const subAudioDir = path.resolve(__dirname, "../aif-c01-study-guide/audio/questions");

  if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
  if (!fs.existsSync(subAudioDir)) fs.mkdirSync(subAudioDir, { recursive: true });

  const domainFiles = [1, 2, 3, 4, 5].map(id => {
    return fs.readdirSync(BASE_DIR).find(f => f.startsWith(`domain-${id}`));
  });

  const manifest = {};
  const tts = new EdgeTTS({
    voice: "vi-VN-NamMinhNeural",
    lang: "vi-VN",
    outputFormat: "audio-24khz-48kbitrate-mono-mp3"
  });

  console.log("Starting batch audio synthesis for 57 scenario questions...");

  for (const filename of domainFiles) {
    const domainId = parseInt(filename.match(/domain-(\d+)/)[1]);
    const content = fs.readFileSync(path.join(BASE_DIR, filename), "utf8");
    const titleMatch = content.match(/^# (.*)/m);
    const domainTitle = titleMatch ? titleMatch[1] : `Domain ${domainId}`;

    const qBlocks = content.split(/### Question \d+/);
    for (let qIdx = 1; qIdx < qBlocks.length; qIdx++) {
      const qNum = qIdx;
      const block = qBlocks[qIdx];
      const qId = `d${domainId}-q${qNum}`;

      const stemAndOpts = block.split(/\*\*Đáp án đúng:\*\*/);
      const stemRaw = stemAndOpts[0].trim();
      const optionLines = [];
      const stemLines = [];
      stemRaw.split("\n").forEach(l => {
        const trimmed = l.trim();
        if (/^[-*]\s+[A-E]\./.test(trimmed)) {
          optionLines.push(trimmed.replace(/^[-*]\s+/, ""));
        } else if (optionLines.length === 0 && trimmed.length > 0) {
          stemLines.push(trimmed);
        }
      });

      const options = optionLines.map(opt => {
        const key = opt.slice(0, 1);
        const text = opt.slice(3).trim();
        return { key, text };
      });

      const answerPart = stemAndOpts[1] || "";
      const answerMatch = answerPart.match(/^\s*\*?\*?(.*?)\*?\*?\s*\n/);
      const correctAnswer = answerMatch ? answerMatch[1].trim() : "";
      const reasonMatch = answerPart.match(/\*\*Lý do chọn.*?\*\*([\s\S]*?)(?=\*\*Phân tích|\*\*Cảnh báo|$)/i);
      const reason = reasonMatch ? reasonMatch[1].trim() : "";
      const trapMatch = answerPart.match(/\*\*Cảnh báo.*?\*\*([\s\S]*?)(?=---|###|$)/i);
      const trap = trapMatch ? trapMatch[1].trim() : "";
      const distractorMatch = answerPart.match(/\*\*Phân tích.*?\*\*([\s\S]*?)(?=\*\*Cảnh báo|$)/i);
      const distractor = distractorMatch ? distractorMatch[1].trim() : "";

      const qObj = {
        id: qId,
        domainId,
        number: qNum,
        stem: stemLines.join(" "),
        options,
        correctAnswer,
        reason,
        distractor,
        trap
      };

      const script = formatQuestionSpeechScript(qObj, domainTitle);
      const targetFile = path.join(audioDir, `${qId}.mp3`);
      const subTargetFile = path.join(subAudioDir, `${qId}.mp3`);

      // Check cache (>180KB)
      if (!force && fs.existsSync(targetFile) && fs.statSync(targetFile).size > 180000) {
        const size = fs.statSync(targetFile).size;
        const estDuration = Math.round(size / 6000); // 48kbps ~ 6KB/s
        manifest[qId] = { duration: estDuration, size, title: `Câu ${qNum} (Domain ${domainId})` };
        if (!fs.existsSync(subTargetFile)) fs.copyFileSync(targetFile, subTargetFile);
        continue;
      }

      console.log(`Synthesizing [${qId}] (Domain ${domainId} Q${qNum})...`);
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        try {
          attempts++;
          await tts.ttsPromise(script, targetFile);
          const size = fs.statSync(targetFile).size;
          if (size > 180000) {
            fs.copyFileSync(targetFile, subTargetFile);
            success = true;
          } else {
            console.warn(`File ${qId} too small (${size} bytes), retrying...`);
            await new Promise(r => setTimeout(r, 1200));
          }
        } catch (e) {
          console.warn(`Retry ${qId} attempt ${attempts}:`, e.message);
          await new Promise(r => setTimeout(r, 1200));
        }
      }

      if (success) {
        const size = fs.statSync(targetFile).size;
        const estDuration = Math.round(size / 6000);
        manifest[qId] = { duration: estDuration, size, title: `Câu ${qNum} (Domain ${domainId})` };
      } else {
        throw new Error(`Failed to synthesize audio for question ${qId}`);
      }
    }
  }

  const manifestPath = path.join(audioDir, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(subAudioDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Batch audio synthesis completed: 57/57 files saved to ${audioDir}`);
}

module.exports = {
  sanitizeSpeechText,
  formatQuestionSpeechScript,
  synthesizeAllQuestions
};

if (require.main === module) {
  const force = process.argv.includes("--force");
  synthesizeAllQuestions(force).catch(err => {
    console.error("Batch synthesis failed:", err);
    process.exit(1);
  });
}
