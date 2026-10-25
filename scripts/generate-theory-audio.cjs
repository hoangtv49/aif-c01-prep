const fs = require("fs");
const path = require("path");
const { EdgeTTS } = require("node-edge-tts");

const BASE_DIR = path.resolve(__dirname, "../aif-c01-study-guide");
const AUDIO_DIR = path.resolve(__dirname, "../audio/theory");
const SUB_AUDIO_DIR = path.resolve(__dirname, "../aif-c01-study-guide/audio/theory");
const EN_CACHE_DIR = path.resolve(__dirname, "../audio/cache/en");

const DOMAIN_FILES = {
  1: "domain-1-fundamentals-ai-ml.md",
  2: "domain-2-generative-ai.md",
  3: "domain-3-fm-applications.md",
  4: "domain-4-responsible-ai.md",
  5: "domain-5-security-compliance-governance.md"
};

const DOMAIN_TITLES = {
  1: "Domain 1: Nguyên lý cơ bản về Trí tuệ nhân tạo và Học máy, chiếm 20% bài thi AIF-C01",
  2: "Domain 2: Nguyên lý cơ bản về Trí tuệ nhân tạo tạo sinh Generative AI, chiếm 24% bài thi AIF-C01",
  3: "Domain 3: Ứng dụng các Mô hình nền tảng Foundation Models, chiếm tỷ trọng cao nhất 28% bài thi AIF-C01",
  4: "Domain 4: Hướng dẫn về Trí tuệ nhân tạo có trách nhiệm Responsible AI, chiếm 14% bài thi AIF-C01",
  5: "Domain 5: Bảo mật, Tuân thủ và Quản trị cho các giải pháp AI, chiếm 14% bài thi AIF-C01"
};

const DIAGRAM_TRANSCRIPTIONS = {
  1: "Sơ đồ phân cấp: Trí tuệ nhân tạo AI là tập hợp lớn nhất. Bên trong AI là Học máy Machine Learning, nơi hệ thống tự học từ dữ liệu. Và trong cùng của Machine Learning là Học sâu Deep Learning, sử dụng mạng nơ-ron nhiều tầng để xử lý dữ liệu phức tạp.",
  2: "Sơ đồ các phương pháp tiếp cận Generative AI xếp theo chiều tăng dần về chi phí và độ phức tạp kỹ thuật: Tiết kiệm và nhanh nhất là Prompt Engineering kỹ nghệ câu lệnh; tiếp theo là RAG kết nối cơ sở tri thức; tiếp đến là Fine-Tuning tinh chỉnh mô hình; và tốn kém, phức tạp nhất là Pre-Training huấn luyện mô hình nền tảng từ đầu.",
  3: "Sơ đồ ba tầng công nghệ Generative AI của AWS: Tầng dưới cùng là Hạ tầng máy chủ dành cho chuyên gia với chip chuyên dụng AWS Trainium và Inferentia. Tầng giữa là Công cụ dành cho nhà phát triển xây dựng ứng dụng với Amazon Bedrock và SageMaker JumpStart. Tầng trên cùng là Ứng dụng AI dựng sẵn cho người dùng doanh nghiệp như trợ lý thông minh Amazon Q.",
  4: "Sơ đồ luồng hoạt động của Amazon Bedrock Guardrails: Khi người dùng nhập câu lệnh, Guardrails sẽ kiểm duyệt bộ lọc nội dung, chặn chủ đề cấm, che giấu thông tin cá nhân nhạy cảm PII trước khi gửi đến mô hình, và sau đó kiểm tra tính trung thực của câu trả lời trước khi gửi lại cho người dùng.",
  5: "Sơ đồ Mô hình trách nhiệm chia sẻ theo ba nhóm dịch vụ: Với AI Services Serverless như Amazon Rekognition hay Amazon Bedrock, AWS quản lý toàn bộ hạ tầng và mô hình nền tảng, khách hàng quản lý dữ liệu đầu vào và phân quyền IAM. Với ML Services như SageMaker, AWS quản lý nền tảng tính toán, khách hàng quản lý mã nguồn, cấu hình mô hình và dữ liệu."
};

const ENGLISH_TERMS = [
  // AWS Services & Tools
  "AWS Certified AI Practitioner", "Amazon Bedrock", "Bedrock Knowledge Bases",
  "Bedrock Guardrails", "Bedrock Agents", "Amazon SageMaker", "SageMaker JumpStart",
  "SageMaker Canvas", "SageMaker Clarify", "SageMaker Data Wrangler", "SageMaker Ground Truth",
  "SageMaker Model Cards", "SageMaker", "Amazon Kendra", "Amazon Q Business", "Amazon Q Developer",
  "Amazon Q", "PartyRock", "Amazon Rekognition", "Amazon Textract", "Amazon Transcribe",
  "Amazon Polly", "Amazon Comprehend", "Amazon Translate", "Amazon Lex", "Amazon Personalize",
  "Amazon Forecast", "Amazon Fraud Detector", "Amazon CodeWhisperer", "Amazon OpenSearch Service",
  "Amazon OpenSearch", "Amazon S3", "Amazon EC2", "AWS Lambda", "AWS CloudTrail", "CloudTrail",
  "AWS CloudWatch", "CloudWatch", "AWS Config", "Config", "AWS Artifact", "Artifact",
  "AWS Audit Manager", "Audit Manager", "AWS IAM", "IAM", "AWS KMS", "KMS", "Amazon Macie",
  "Macie", "Amazon GuardDuty", "GuardDuty", "AWS WAF", "WAF", "AWS Shield", "Shield",
  "AWS PrivateLink", "PrivateLink", "Amazon VPC", "VPC", "AWS AI Service Cards", "AI Service Cards",
  "AWS", "Trainium", "Inferentia",

  // Core AI / ML / GenAI Concepts
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "Generative AI",
  "Discriminative AI", "Foundation Models", "Foundation Model", "Large Language Models",
  "Large Language Model", "LLMs", "LLM", "Retrieval-Augmented Generation", "RAG",
  "Prompt Engineering", "Fine-Tuning", "Pre-training", "Transfer Learning", "Supervised Learning",
  "Unsupervised Learning", "Reinforcement Learning", "Overfitting", "Underfitting",
  "Confusion Matrix", "Precision", "Recall", "F1-score", "ROC-AUC", "Accuracy", "Serverless",
  "Provisioned Throughput", "On-Demand", "Context Window", "Tokenization", "Tokens", "Token",
  "Embeddings", "Embedding", "Vector Database", "Vector Search", "Cosine Similarity",
  "Temperature", "Top-P", "Top-K", "Max Tokens", "Stop Sequences", "System Prompt",
  "User Prompt", "Few-shot", "Zero-shot", "Chain-of-Thought", "Hallucination", "Jailbreak",
  "Prompt Injection", "Data Poisoning", "Responsible AI", "Explainability", "Transparency",
  "Fairness", "Robustness", "EU AI Act", "OWASP Top 10 for LLMs", "OWASP",
  "Shared Responsibility Model", "Multi-layer Neural Networks", "Neural Networks",
  "Transformer", "Self-Attention", "Text-to-Image", "Diffusion Models", "Diffusion"
];

// Sort terms descending by length so longer phrases match first
ENGLISH_TERMS.sort((a, b) => b.length - a.length);
const termRegex = new RegExp(`\\b(${ENGLISH_TERMS.map(t => t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")).join("|")})\\b`, "gi");

const ttsVN = new EdgeTTS({ voice: "vi-VN-NamMinhNeural", lang: "vi-VN", outputFormat: "audio-24khz-48kbitrate-mono-mp3", saveSubtitles: true });
const ttsEN = new EdgeTTS({ voice: "en-US-GuyNeural", lang: "en-US", outputFormat: "audio-24khz-48kbitrate-mono-mp3", saveSubtitles: true });

function parseDomainTheoryChunks(domainId) {
  const filePath = path.join(BASE_DIR, DOMAIN_FILES[domainId]);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");
  const p1Match = content.match(/## Phần 1: Trọng tâm lý thuyết & Decision Trees([\s\S]*?)## Phần 2/);
  if (!p1Match) {
    throw new Error(`Could not find Part 1 in Domain ${domainId}`);
  }

  const p1 = p1Match[1];
  let cleanP1 = p1.replace(/```[\s\S]*?```/g, DIAGRAM_TRANSCRIPTIONS[domainId] || "");

  const rawSections = cleanP1.split(/\n### /).slice(1);
  const chunks = [];

  const introText = `Chào mừng bạn đến với phần tóm tắt lý thuyết trọng tâm của ${DOMAIN_TITLES[domainId]}. Sau đây là các kiến thức cốt lõi và từ khóa ăn điểm bạn cần nắm chắc cho kỳ thi. `;

  rawSections.forEach((sec, sIdx) => {
    const lines = sec.split("\n");
    const rawTitle = lines[0].trim();
    const title = rawTitle.replace(/^\d+\.\s*/, "").replace(/\(.*?\)/g, "").trim();
    let body = lines.slice(1).join("\n");

    const bodyLines = body.split("\n");
    const parsedLines = [];
    let inTable = false;
    let headers = [];

    for (let line of bodyLines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed.split("|").slice(1, -1).map(c => c.trim().replace(/\*\*/g, ""));
        if (cells.every(c => /^:?-+:?$/.test(c))) continue;
        if (!inTable) {
          inTable = true;
          headers = cells;
          continue;
        }
        let rowSpoken = "";
        cells.forEach((cell, i) => {
          if (!cell || cell === "-" || cell === "N/A") return;
          const h = headers[i] || "";
          if (i === 0) rowSpoken += `${cell}. `;
          else if (h) rowSpoken += `${h}: ${cell}. `;
          else rowSpoken += `${cell}. `;
        });
        parsedLines.push(rowSpoken);
      } else {
        inTable = false;
        headers = [];
        parsedLines.push(line);
      }
    }

    body = parsedLines.join("\n")
      .replace(/\$\s*\\rightarrow\s*\$/g, " suy ra ")
      .replace(/\$\s*\\to\s*\$/g, " suy ra ")
      .replace(/\\rightarrow/g, " suy ra ")
      .replace(/\\to\b/g, " suy ra ")
      .replace(/\$\\le\s*(\d+)\$/g, " nhỏ hơn hoặc bằng $1 ")
      .replace(/\$([^\$]+)\$/g, "$1")
      .replace(/\\text\{([^}]+)\}/g, "$1")
      .replace(/\bvs\b/gi, "so với")
      .replace(/\(\s*([A-Za-z\s]+)\s*-\s*([A-Za-z]+)\s*\)/g, ", $1, $2,")
      .replace(/\(\s*([A-Za-z\s]+)\s*\)/g, ", $1,")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/^[-*]\s+/gm, "")
      .replace(/---/g, " ")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const prefix = (sIdx === 0 ? introText : "") + `Mục ${sIdx + 1}: ${title}. `;

    if (body.length > 1800) {
      const sentences = body.match(/[^.!?]+[.!?]+/g) || [body];
      let cur = prefix;
      sentences.forEach(s => {
        if ((cur + s).length > 1600) {
          chunks.push({ domainId, title, text: cur.trim() });
          cur = s + " ";
        } else {
          cur += s + " ";
        }
      });
      if (cur.trim()) chunks.push({ domainId, title, text: cur.trim() });
    } else {
      chunks.push({ domainId, title, text: `${prefix}${body}` });
    }
  });

  return chunks;
}

async function getOrSynthesizeEn(term, maxRetries = 3) {
  fs.mkdirSync(EN_CACHE_DIR, { recursive: true });
  const safe = term.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const mp3File = path.join(EN_CACHE_DIR, `${safe}.mp3`);
  const jsonFile = `${mp3File}.json`;

  if (!fs.existsSync(mp3File)) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await ttsEN.ttsPromise(term, mp3File);
        if (fs.existsSync(mp3File) && fs.statSync(mp3File).size > 1000) break;
        throw new Error("File empty");
      } catch (e) {
        if (attempt === maxRetries) throw e;
        await new Promise(r => setTimeout(r, attempt * 1000));
      }
    }
  }

  const rawBuf = fs.readFileSync(mp3File);
  let startMs = 0;
  let endMs = (rawBuf.length / 6000) * 1000;

  if (fs.existsSync(jsonFile)) {
    try {
      const subs = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
      if (subs && subs.length > 0) {
        startMs = Math.max(0, subs[0].start - 25);
        endMs = subs[subs.length - 1].end + 35;
      }
    } catch (e) {}
  }

  const frameSize = 144;
  const startByte = Math.max(0, Math.floor(startMs / 24) * frameSize);
  const endByte = Math.min(rawBuf.length, Math.ceil(endMs / 24) * frameSize);
  return rawBuf.subarray(startByte, endByte);
}

async function synthesizeViTrimmed(text, tempPrefix, maxRetries = 3) {
  const clean = text.replace(/^[,:\s-]+/, "").replace(/[,:\s-]+$/, "").trim();
  if (!clean || !/[a-zA-Z0-9\u00C0-\u1EF9]/.test(clean)) {
    return Buffer.alloc(0);
  }

  const mp3File = `${tempPrefix}.mp3`;
  const jsonFile = `${mp3File}.json`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await ttsVN.ttsPromise(clean, mp3File);
      if (fs.existsSync(mp3File) && fs.statSync(mp3File).size > 1000) break;
      throw new Error("File empty");
    } catch (e) {
      if (attempt === maxRetries) throw e;
      await new Promise(r => setTimeout(r, attempt * 1200));
    }
  }

  const rawBuf = fs.readFileSync(mp3File);
  let startMs = 0;
  let endMs = (rawBuf.length / 6000) * 1000;

  if (fs.existsSync(jsonFile)) {
    try {
      const subs = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
      if (subs && subs.length > 0) {
        startMs = Math.max(0, subs[0].start - 25);
        endMs = subs[subs.length - 1].end + 45;
      }
    } catch (e) {}
  }

  const frameSize = 144;
  const startByte = Math.max(0, Math.floor(startMs / 24) * frameSize);
  const endByte = Math.min(rawBuf.length, Math.ceil(endMs / 24) * frameSize);
  return rawBuf.subarray(startByte, endByte);
}

async function synthesizeDomainTheory(domainId, force = false) {
  const targetFile = path.join(AUDIO_DIR, `domain-${domainId}.mp3`);
  const subTargetFile = path.join(SUB_AUDIO_DIR, `domain-${domainId}.mp3`);

  if (!force && fs.existsSync(targetFile) && fs.statSync(targetFile).size > 100000) {
    console.log(`Domain ${domainId} theory audio already exists (${fs.statSync(targetFile).size} bytes). Skipping.`);
    const stat = fs.statSync(targetFile);
    return {
      domainId,
      size: stat.size,
      duration: Math.round(stat.size / 6000)
    };
  }

  const chunks = parseDomainTheoryChunks(domainId);
  console.log(`Synthesizing Domain ${domainId} with Dual-Voice (${chunks.length} chunks)...`);

  const tempDir = "/tmp/opencode/theory-build";
  fs.mkdirSync(tempDir, { recursive: true });

  const chunkBuffers = [];

  for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
    const chunkText = chunks[cIdx].text;
    const segments = [];
    let lastIdx = 0;
    let match;

    while ((match = termRegex.exec(chunkText)) !== null) {
      if (match.index > lastIdx) {
        const vi = chunkText.substring(lastIdx, match.index).trim();
        if (vi && /[a-zA-Z0-9\u00C0-\u1EF9]/.test(vi)) {
          segments.push({ lang: "vi", text: vi });
        }
      }
      segments.push({ lang: "en", text: match[0].trim() });
      lastIdx = termRegex.lastIndex;
    }

    if (lastIdx < chunkText.length) {
      const vi = chunkText.substring(lastIdx).trim();
      if (vi && /[a-zA-Z0-9\u00C0-\u1EF9]/.test(vi)) {
        segments.push({ lang: "vi", text: vi });
      }
    }

    process.stdout.write(`  Domain ${domainId} Chunk ${cIdx + 1}/${chunks.length} (${segments.length} segments)... `);
    const segBuffers = [];

    for (let sIdx = 0; sIdx < segments.length; sIdx++) {
      const seg = segments[sIdx];
      if (seg.lang === "en") {
        const b = await getOrSynthesizeEn(seg.text);
        segBuffers.push(b);
      } else {
        const p = path.join(tempDir, `d${domainId}-c${cIdx}-s${sIdx}`);
        const b = await synthesizeViTrimmed(seg.text, p);
        segBuffers.push(b);
        await new Promise(r => setTimeout(r, 100));
      }
    }

    const chunkMerged = Buffer.concat(segBuffers);
    chunkBuffers.push(chunkMerged);
    process.stdout.write(`done (${chunkMerged.length} bytes)\n`);
  }

  const mergedBuffer = Buffer.concat(chunkBuffers);
  fs.writeFileSync(targetFile, mergedBuffer);
  fs.writeFileSync(subTargetFile, mergedBuffer);

  const durationSec = Math.round(mergedBuffer.length / 6000);
  console.log(`Domain ${domainId} Dual-Voice theory audio finished: ${mergedBuffer.length} bytes (~${durationSec}s)`);

  return {
    domainId,
    size: mergedBuffer.length,
    duration: durationSec
  };
}

async function synthesizeAllTheoryDomains(force = false) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  fs.mkdirSync(SUB_AUDIO_DIR, { recursive: true });

  const manifest = {};
  console.log("Starting batch Dual-Voice theory audio synthesis for 5 domains...");

  // Pre-cache all unique English terms first
  console.log("Pre-caching unique English terms with American English voice (en-US-GuyNeural)...");
  for (const term of ENGLISH_TERMS) {
    await getOrSynthesizeEn(term);
  }
  console.log(`Pre-cached ${ENGLISH_TERMS.length} English terms successfully!`);

  for (let id = 1; id <= 5; id++) {
    const meta = await synthesizeDomainTheory(id, force);
    manifest[`domain-${id}`] = meta;
  }

  const manifestPath = path.join(AUDIO_DIR, "manifest.json");
  const subManifestPath = path.join(SUB_AUDIO_DIR, "manifest.json");

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  fs.writeFileSync(subManifestPath, JSON.stringify(manifest, null, 2));

  console.log("All 5 Dual-Voice theory audio tracks synthesized successfully!");
  return manifest;
}

module.exports = {
  parseDomainTheoryChunks,
  synthesizeDomainTheory,
  synthesizeAllTheoryDomains,
  getOrSynthesizeEn,
  ENGLISH_TERMS,
  DOMAIN_TITLES,
  DIAGRAM_TRANSCRIPTIONS
};

if (require.main === module) {
  const force = process.argv.includes("--force");
  synthesizeAllTheoryDomains(force).catch(err => {
    console.error("Theory audio synthesis failed:", err);
    process.exit(1);
  });
}
