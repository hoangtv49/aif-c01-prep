import fs from "fs";
import path from "path";
import { marked } from "marked";

const BASE_DIR = path.resolve("aif-c01-study-guide");

function cleanMath(text) {
  return text
    .replace(/\$\\rightarrow\$/g, " &rarr; ")
    .replace(/\\rightarrow/g, " &rarr; ")
    .replace(/\$\\le\s*(\d+)\$/g, " &le; $1 ")
    .replace(/\$([^\$]+)\$/g, (m, expr) => {
      const cleaned = expr.replace(/\\text\{([^}]+)\}/g, "$1").replace(/\\rightarrow/g, "&rarr;");
      return `<code class="math-tag">${cleaned}</code>`;
    });
}

function parseDomainFile(filename) {
  const content = fs.readFileSync(path.join(BASE_DIR, filename), "utf8");
  const domainId = parseInt(filename.match(/domain-(\d+)/)[1]);
  const titleMatch = content.match(/^# (.*)/m);
  const title = titleMatch ? titleMatch[1] : filename;

  // Extract Theory (Phần 1)
  const p1Match = content.match(/## Phần 1: Trọng tâm lý thuyết & Decision Trees([\s\S]*?)(?=## Phần 2:)/);
  const theoryHtml = p1Match ? marked.parse(cleanMath(p1Match[1])) : "";

  // Extract STE Table (Phần 2)
  const steTerms = [];
  const lines = content.split("\n");
  let inTable = false;
  lines.forEach(line => {
    if (line.includes("| Term") || line.includes("| Thuật ngữ")) inTable = true;
    else if (inTable && line.startsWith("|") && !line.includes("---")) {
      const parts = line.split("|").map(p => p.trim());
      if (parts.length >= 5) {
        steTerms.push({
          term: parts[1].replace(/\*\*/g, ""),
          definition: parts[2],
          keywords: parts[3],
          note: parts[4]
        });
      }
    } else if (inTable && line.trim() === "") {
      inTable = false;
    }
  });

  // Extract Questions (Phần 3)
  const questions = [];
  const qBlocks = content.split(/### Question \d+/);
  qBlocks.slice(1).forEach((block, qIdx) => {
    const qNum = qIdx + 1;
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

    const isMultiple = /choose two|select two|choose three/i.test(stemRaw);
    let answerPart = stemAndOpts[1] || "";
    const answerMatch = answerPart.match(/^\s*\*?\*?(.*?)\*?\*?\s*\n/);
    const correctAnswer = answerMatch ? answerMatch[1].trim() : "";
    const reasonMatch = answerPart.match(/\*\*Lý do chọn.*?\*\*([\s\S]*?)(?=\*\*Phân tích|\*\*Cảnh báo|$)/i);
    const reason = reasonMatch ? reasonMatch[1].trim() : "";
    const distractorMatch = answerPart.match(/\*\*Phân tích.*?\*\*([\s\S]*?)(?=\*\*Cảnh báo|$)/i);
    const distractor = distractorMatch ? distractorMatch[1].trim() : "";
    const trapMatch = answerPart.match(/\*\*Cảnh báo.*?\*\*([\s\S]*?)(?=---|###|$)/i);
    const trap = trapMatch ? trapMatch[1].trim() : "";

    questions.push({
      id: `d${domainId}-q${qNum}`,
      domainId,
      number: qNum,
      isMultiple,
      stem: stemLines.join(" "),
      options: optionLines.map(opt => {
        const key = opt.slice(0, 1);
        const text = opt.slice(3).trim();
        return { key, text };
      }),
      correctAnswer,
      reason,
      distractor,
      trap
    });
  });

  return { domainId, title, theoryHtml, steTerms, questions };
}

const domains = [1, 2, 3, 4, 5].map(id => {
  const file = fs.readdirSync(BASE_DIR).find(f => f.startsWith(`domain-${id}`));
  return parseDomainFile(file);
});

// Parse Decision Matrix from README
const readme = fs.readFileSync(path.join(BASE_DIR, "README.md"), "utf8");
const matrixRows = [];
const rLines = readme.split("\n");
let inMatrix = false;
rLines.forEach(l => {
  if (l.includes("| Yêu cầu tình huống trong đề thi |")) inMatrix = true;
  else if (inMatrix && l.startsWith("|") && !l.includes("---")) {
    const parts = l.split("|").map(p => p.trim());
    if (parts.length >= 4) {
      matrixRows.push({
        scenario: parts[1],
        service: parts[2].replace(/\*\*/g, ""),
        trap: parts[3]
      });
    }
  } else if (inMatrix && l.trim() === "") {
    inMatrix = false;
  }
});

const data = { domains, decisionMatrix: matrixRows };
fs.writeFileSync(path.join(BASE_DIR, "data.json"), JSON.stringify(data, null, 2));

// Define Concept Graph Nodes & Edges
const graphData = {
  nodes: [
    { id: "bedrock", label: "Amazon Bedrock", domain: 3, group: "platform", x: 420, y: 180, desc: "Serverless unified API for leading foundation models." },
    { id: "knowledge_bases", label: "Bedrock Knowledge Bases", domain: 3, group: "rag", x: 200, y: 100, desc: "Fully managed RAG connecting FMs to enterprise data sources." },
    { id: "bedrock_agents", label: "Bedrock Agents", domain: 3, group: "automation", x: 640, y: 100, desc: "Autonomous multi-step reasoning and API execution." },
    { id: "bedrock_guardrails", label: "Bedrock Guardrails", domain: 4, group: "safety", x: 420, y: 320, desc: "Content moderation, PII masking, and hallucination filters." },
    { id: "model_eval", label: "Bedrock Model Evaluation", domain: 3, group: "evaluation", x: 620, y: 260, desc: "Automatic and human-in-the-loop FM benchmarks." },
    { id: "rag", label: "RAG Architecture", domain: 2, group: "rag", x: 80, y: 190, desc: "Retrieves external facts to ground responses without retraining." },
    { id: "fine_tuning", label: "PEFT / LoRA Fine-Tuning", domain: 3, group: "customization", x: 640, y: 180, desc: "Parameter-efficient adaptation; requires Provisioned Throughput." },
    { id: "vector_db", label: "Vector Database (OpenSearch)", domain: 2, group: "rag", x: 80, y: 290, desc: "Indexes high-dimensional vector embeddings for fast similarity search." },
    { id: "s3", label: "Amazon S3 Data Lake", domain: 5, group: "storage", x: 220, y: 240, desc: "Object storage for training datasets, knowledge base docs, and audit logs." },
    { id: "lambda", label: "AWS Lambda", domain: 3, group: "automation", x: 820, y: 80, desc: "Serverless code execution triggered by Bedrock Agents." },
    { id: "openapi", label: "OpenAPI Schema", domain: 3, group: "automation", x: 820, y: 150, desc: "JSON/YAML API definition required by Bedrock Action Groups." },
    { id: "pii_redaction", label: "PII Masking & Redaction", domain: 4, group: "safety", x: 240, y: 400, desc: "Automatically masks SSNs, credit cards, and sensitive identifiers." },
    { id: "denied_topics", label: "Denied Topics", domain: 4, group: "safety", x: 420, y: 440, desc: "Natural language boundary rules prohibiting specific conversation subjects." },
    { id: "grounding_check", label: "Contextual Grounding", domain: 4, group: "safety", x: 600, y: 400, desc: "Detects hallucinations by verifying factual backing against RAG sources." },
    { id: "sagemaker", label: "Amazon SageMaker AI", domain: 1, group: "ml", x: 220, y: 550, desc: "End-to-end managed ML platform to build, train, and deploy models." },
    { id: "data_wrangler", label: "SageMaker Data Wrangler", domain: 1, group: "ml", x: 80, y: 480, desc: "Visual data preparation with 300+ built-in transformations." },
    { id: "jumpstart", label: "SageMaker JumpStart", domain: 1, group: "ml", x: 420, y: 550, desc: "Pre-trained open models deployed on dedicated EC2 ML instances in VPC." },
    { id: "clarify", label: "SageMaker Clarify", domain: 4, group: "responsible", x: 220, y: 680, desc: "Measures pre/post-training bias metrics and explains decisions with SHAP." },
    { id: "bias_detection", label: "Bias Metrics (DPPL / Disparate Impact)", domain: 4, group: "responsible", x: 80, y: 640, desc: "Quantifies algorithmic bias across sensitive demographic groups." },
    { id: "shap", label: "SHAP Explainability", domain: 4, group: "responsible", x: 80, y: 730, desc: "Local and global feature attribution explaining prediction drivers." },
    { id: "model_cards", label: "SageMaker Model Cards", domain: 4, group: "governance", x: 420, y: 680, desc: "Standardized governance documentation for custom ML models." },
    { id: "service_cards", label: "AWS AI Service Cards", domain: 4, group: "governance", x: 600, y: 680, desc: "Official AWS transparency docs detailing intended use and limits." },
    { id: "kms", label: "AWS KMS Encryption", domain: 5, group: "security", x: 420, y: 50, desc: "Envelope encryption for S3, Bedrock custom models, and EBS volumes." },
    { id: "privatelink", label: "AWS PrivateLink (VPC Endpoints)", domain: 5, group: "security", x: 220, y: 30, desc: "Private connectivity to Bedrock APIs without traversing public internet." },
    { id: "audit_manager", label: "AWS Audit Manager", domain: 5, group: "compliance", x: 780, y: 550, desc: "Automates continuous evidence collection for AI/ML compliance frameworks." },
    { id: "artifact", label: "AWS Artifact", domain: 5, group: "compliance", x: 780, y: 650, desc: "On-demand portal to download AWS SOC 2, ISO, and PCI DSS audit reports." },
    { id: "config", label: "AWS Config", domain: 5, group: "compliance", x: 620, y: 550, desc: "Tracks resource configuration changes and audits compliance rules." },
    { id: "cloudtrail", label: "AWS CloudTrail", domain: 5, group: "compliance", x: 620, y: 620, desc: "Records all API calls made in the AWS account for forensic investigation." },
    { id: "waf", label: "AWS WAF", domain: 5, group: "security", x: 600, y: 30, desc: "Layer 7 firewall defending AI endpoints from bot token exhaustion and DDoS." },
    { id: "textract", label: "Amazon Textract", domain: 1, group: "core_ai", x: 80, y: 840, desc: "OCR and intelligent table extraction from scanned PDF documents." },
    { id: "comprehend", label: "Amazon Comprehend", domain: 1, group: "core_ai", x: 260, y: 840, desc: "NLP sentiment analysis, entity extraction, and PII detection." },
    { id: "transcribe", label: "Amazon Transcribe", domain: 1, group: "core_ai", x: 440, y: 840, desc: "Speech-to-text with speaker diarization and call analytics." },
    { id: "polly", label: "Amazon Polly", domain: 1, group: "core_ai", x: 620, y: 840, desc: "Text-to-speech converting written words into natural lifelike voices." },
    { id: "q_business", label: "Amazon Q Business", domain: 3, group: "enterprise", x: 800, y: 350, desc: "Enterprise conversational assistant with 40+ connectors and ACL enforcement." },
    { id: "kendra", label: "Amazon Kendra", domain: 3, group: "search", x: 800, y: 440, desc: "Intelligent search engine returning source document excerpts and links." }
  ],
  edges: [
    { from: "bedrock", to: "knowledge_bases", label: "RAG Knowledge Base" },
    { from: "bedrock", to: "bedrock_agents", label: "Action Orchestration" },
    { from: "bedrock", to: "bedrock_guardrails", label: "Safety & Policy Filter" },
    { from: "bedrock", to: "model_eval", label: "Benchmark Evaluation" },
    { from: "bedrock", to: "fine_tuning", label: "Custom Models (Provisioned)" },
    { from: "knowledge_bases", to: "rag", label: "Implements RAG" },
    { from: "knowledge_bases", to: "vector_db", label: "Vector Search Queries" },
    { from: "knowledge_bases", to: "s3", label: "Ingests S3 Documents" },
    { from: "bedrock_agents", to: "openapi", label: "Defines API Schema" },
    { from: "bedrock_agents", to: "lambda", label: "Executes API Business Logic" },
    { from: "bedrock_guardrails", to: "pii_redaction", label: "Masks Sensitive Data" },
    { from: "bedrock_guardrails", to: "denied_topics", label: "Blocks Restricted Topics" },
    { from: "bedrock_guardrails", to: "grounding_check", label: "Detects Hallucinations" },
    { from: "sagemaker", to: "data_wrangler", label: "Visual Data Preparation" },
    { from: "sagemaker", to: "jumpstart", label: "Model Hub (Dedicated EC2)" },
    { from: "sagemaker", to: "clarify", label: "Evaluates Bias & Explainability" },
    { from: "clarify", to: "bias_detection", label: "Computes DPPL Metrics" },
    { from: "clarify", to: "shap", label: "Computes SHAP Values" },
    { from: "sagemaker", to: "model_cards", label: "Custom Model Documentation" },
    { from: "model_cards", to: "service_cards", label: "Contrast with AWS AI Cards" },
    { from: "kms", to: "s3", label: "Server-side Encryption (CMK)" },
    { from: "kms", to: "bedrock", label: "Encrypts Custom Models & Data" },
    { from: "privatelink", to: "bedrock", label: "Private VPC Traffic (No Internet)" },
    { from: "audit_manager", to: "artifact", label: "Active Evidence vs Static SOC Reports" },
    { from: "config", to: "cloudtrail", label: "Config Drift vs API Audit Logs" },
    { from: "waf", to: "bedrock", label: "Protects Endpoints & Rate Limits" },
    { from: "transcribe", to: "comprehend", label: "Audio -> Text -> Sentiment" },
    { from: "transcribe", to: "polly", label: "Speech-to-Text & Text-to-Speech" },
    { from: "kendra", to: "q_business", label: "Search Index vs GenAI Chatbot" }
  ]
};

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AWS Certified AI Practitioner (AIF-C01) - Interactive Mastery Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --bg-panel: #111827;
      --bg-card: #162032;
      --bg-card-hover: #1e293b;
      --border: #243047;
      --border-highlight: #3b82f6;
      --primary: #00a4e4;
      --primary-glow: rgba(0, 164, 228, 0.25);
      --indigo: #6366f1;
      --indigo-glow: rgba(99, 102, 241, 0.25);
      --success: #10b981;
      --success-bg: rgba(16, 185, 129, 0.12);
      --error: #ef4444;
      --error-bg: rgba(239, 68, 68, 0.12);
      --warning: #f59e0b;
      --warning-bg: rgba(245, 158, 11, 0.12);
      --text: #f1f5f9;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', ui-monospace, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* Container & Layout */
    .app-header {
      background: linear-gradient(180deg, #111928 0%, #0d1321 100%);
      border-bottom: 1px solid var(--border);
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
    }
    .header-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .brand-badge {
      background: linear-gradient(135deg, #00a4e4, #6366f1);
      color: #fff;
      font-weight: 700;
      font-size: 0.8rem;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      letter-spacing: 0.05em;
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #fff;
    }
    .brand-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Nav Tabs */
    .nav-tabs {
      display: flex;
      background: #0d1321;
      padding: 0.3rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      gap: 0.25rem;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .nav-tabs::-webkit-scrollbar {
      display: none;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.5rem 1rem;
      font-family: var(--font-sans);
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .tab-btn:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.04);
    }
    .tab-btn.active {
      color: #fff;
      background: #1e293b;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }

    /* Stats Pill */
    .stats-pill {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #162032;
      border: 1px solid var(--border);
      padding: 0.4rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.825rem;
    }
    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .stat-label { color: var(--text-dim); }
    .stat-value { font-family: var(--font-mono); font-weight: 600; color: #fff; }

    /* Main Container */
    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem 1.5rem 5rem;
    }

    .tab-panel {
      display: none;
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .tab-panel.active { display: block; }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Quiz Header Toolbar */
    .quiz-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2rem;
      background: var(--bg-panel);
      padding: 1rem 1.25rem;
      border-radius: 12px;
      border: 1px solid var(--border);
      flex-wrap: wrap;
    }
    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .filter-chip {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      font-size: 0.825rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-chip:hover { color: #fff; border-color: var(--text-dim); }
    .filter-chip.active {
      background: #00a4e4;
      color: #fff;
      border-color: #00a4e4;
    }

    .search-box {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.45rem 0.85rem;
      color: #fff;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      width: 240px;
      transition: border-color 0.2s ease;
    }
    .search-box:focus {
      outline: none;
      border-color: var(--primary);
    }

    /* Mode Switcher Group */
    .mode-switch-group {
      display: flex;
      background: #090e1a;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.25rem;
      gap: 0.25rem;
    }
    .mode-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.5rem 0.95rem;
      font-family: var(--font-sans);
      font-size: 0.825rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mode-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .mode-btn.active.exam-mode {
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #0284c7;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.25);
    }
    .mode-btn.active.study-mode {
      background: #312e81;
      color: #c7d2fe;
      border: 1px solid #6366f1;
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.25);
    }
    .mode-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-dim);
    }
    .mode-btn.active.exam-mode .mode-dot {
      background: #38bdf8;
      box-shadow: 0 0 8px #38bdf8;
    }
    .mode-btn.active.study-mode .mode-dot {
      background: #818cf8;
      box-shadow: 0 0 8px #818cf8;
    }

    /* Per-question toggle button */
    .q-toggle-btn {
      margin-left: auto;
      background: #111a2e;
      border: 1px solid var(--border);
      color: #94a3b8;
      font-family: var(--font-sans);
      font-size: 0.775rem;
      font-weight: 600;
      padding: 0.3rem 0.7rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .q-toggle-btn:hover {
      color: #38bdf8;
      border-color: #38bdf8;
      background: #1e293b;
    }

    /* Action Buttons (Shuffle / Revert) */
    .action-btn {
      background: #162032;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.5rem 0.95rem;
      border-radius: 8px;
      font-family: var(--font-sans);
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .action-btn:hover {
      color: #fff;
      border-color: #3b82f6;
      background: #1e293b;
    }
    .action-btn.shuffle-active {
      background: rgba(245, 158, 11, 0.15);
      border-color: #f59e0b;
      color: #fbbf24;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
    }
    .action-btn.shuffle-active:hover {
      background: rgba(245, 158, 11, 0.25);
    }

    /* Toast Notification */
    .quiz-toast {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(30px);
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #3b82f6;
      padding: 0.65rem 1.25rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(59, 130, 246, 0.3);
      z-index: 9999;
      opacity: 0;
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .quiz-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    /* Question Cards */
    .questions-grid {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .q-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.5rem;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }
    .q-card:hover {
      border-color: #3b82f6;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }
    .q-meta {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }
    .q-badge {
      font-size: 0.75rem;
      font-weight: 700;
      font-family: var(--font-mono);
      padding: 0.25rem 0.55rem;
      border-radius: 6px;
      background: #0f172a;
      color: #38bdf8;
      border: 1px solid #1e293b;
    }
    .q-domain-tag {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .q-type-tag {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .q-stem {
      font-size: 1.05rem;
      font-weight: 500;
      color: #f8fafc;
      margin-bottom: 1.25rem;
      line-height: 1.6;
    }

    /* Options List */
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-bottom: 1.25rem;
    }
    .option-item {
      background: #0d1522;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
    }
    .option-item:hover {
      background: #152238;
      border-color: #475569;
    }
    .opt-key {
      font-family: var(--font-mono);
      font-weight: 600;
      font-size: 0.85rem;
      background: #1e293b;
      color: #94a3b8;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .opt-text {
      font-size: 0.925rem;
      color: #cbd5e1;
      padding-top: 1px;
    }

    /* Option States */
    .option-item.selected-correct {
      background: var(--success-bg) !important;
      border-color: var(--success) !important;
    }
    .option-item.selected-correct .opt-key {
      background: var(--success);
      color: #fff;
    }
    .option-item.selected-correct .opt-text {
      color: #ecfdf5;
      font-weight: 600;
    }

    .option-item.selected-wrong {
      background: var(--error-bg) !important;
      border-color: var(--error) !important;
    }
    .option-item.selected-wrong .opt-key {
      background: var(--error);
      color: #fff;
    }
    .option-item.selected-wrong .opt-text {
      color: #fef2f2;
    }

    .option-item.highlight-correct {
      border-color: var(--success);
      background: rgba(16, 185, 129, 0.08);
    }
    .option-item.highlight-correct .opt-key {
      background: var(--success);
      color: #fff;
    }

    /* Explanation Drawer */
    .explanation-drawer {
      display: none;
      overflow: hidden;
      margin-top: 1rem;
      background: #0d1522;
      border-radius: 10px;
      border: 1px solid #1e293b;
      padding: 1.25rem;
      animation: expandDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .explanation-drawer.revealed { display: block; }
    @keyframes expandDrawer {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .exp-section { margin-bottom: 1rem; }
    .exp-section:last-child { margin-bottom: 0; }
    .exp-title {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.4rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .exp-title.correct { color: #34d399; }
    .exp-title.reason { color: #60a5fa; }
    .exp-title.distractor { color: #f87171; }
    .exp-title.trap { color: #fbbf24; }

    .exp-body {
      font-size: 0.885rem;
      color: #cbd5e1;
      line-height: 1.6;
    }
    .exp-body strong {
      color: #f8fafc;
      font-weight: 600;
    }
    .exp-bullet {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }
    .exp-bullet::before {
      content: "•";
      color: var(--primary);
      font-weight: 700;
      font-size: 1.1rem;
      line-height: 1.2;
      flex-shrink: 0;
    }

    /* Concept Graph Container */
    .graph-container {
      background: #0d1424;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
    }
    .graph-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .graph-legend {
      display: flex;
      gap: 1rem;
      font-size: 0.8rem;
      flex-wrap: wrap;
    }
    .legend-item { display: flex; align-items: center; gap: 0.4rem; }
    .legend-dot { width: 10px; height: 10px; border-radius: 50%; }

    .graph-svg-wrapper {
      width: 100%;
      height: 700px;
      position: relative;
      background: radial-gradient(circle at center, #111d33 0%, #0a0f1d 100%);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #1a263c;
    }
    #concept-svg {
      width: 100%;
      height: 100%;
      cursor: grab;
    }
    .graph-edge {
      stroke: #334155;
      stroke-width: 2;
      fill: none;
      transition: stroke 0.3s ease, stroke-width 0.3s ease;
    }
    .graph-edge.active {
      stroke: #00a4e4;
      stroke-width: 3.5;
      stroke-dasharray: 6 3;
      animation: dash 1s linear infinite;
    }
    @keyframes dash {
      to { stroke-dashoffset: -18; }
    }
    .node-group {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .node-group:hover { transform: scale(1.05); }
    .node-rect {
      rx: 8;
      stroke-width: 1.5;
      transition: all 0.2s ease;
    }
    .node-text {
      font-family: var(--font-sans);
      font-size: 11px;
      font-weight: 600;
      fill: #f8fafc;
      pointer-events: none;
      text-anchor: middle;
    }

    /* Inspector Drawer for Graph */
    .graph-inspector {
      position: absolute;
      right: 2rem;
      bottom: 2rem;
      width: 380px;
      background: #111a2e;
      border: 1px solid #2b3b55;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      display: none;
      z-index: 10;
      backdrop-filter: blur(10px);
    }
    .graph-inspector.open { display: block; animation: fadeIn 0.2s ease; }
    .inspector-title { font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.4rem; }
    .inspector-desc { font-size: 0.85rem; color: #cbd5e1; margin-bottom: 0.8rem; }
    .inspector-links-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--primary); margin-bottom: 0.4rem; }
    .inspector-links { list-style: none; font-size: 0.8rem; color: #94a3b8; }
    .inspector-links li { margin-bottom: 0.25rem; }

    /* Responsive Table Container */
    .table-container {
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin: 1.25rem 0;
      background: var(--bg-card);
    }
    .table-container::-webkit-scrollbar {
      height: 6px;
    }
    .table-container::-webkit-scrollbar-thumb {
      background: #243047;
      border-radius: 9999px;
    }
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 620px;
    }
    .matrix-table th {
      background: #0d1522;
      color: #94a3b8;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      padding: 0.9rem 1.15rem;
      border-bottom: 1px solid var(--border);
    }
    .matrix-table td {
      padding: 0.9rem 1.15rem;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--border);
      color: #e2e8f0;
    }
    .matrix-table tr:hover td { background: #162238; }
    
    /* Topic Study Styles */
    .topic-domain-nav {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .topic-domain-btn {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem 1.15rem;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .topic-domain-btn:hover {
      background: #1b263b;
      border-color: #3b82f6;
      transform: translateY(-2px);
    }
    .topic-domain-btn.active {
      background: linear-gradient(145deg, #162544, #121d33);
      border-color: #00a4e4;
      box-shadow: 0 4px 18px rgba(0, 164, 228, 0.22);
    }
    .topic-domain-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .topic-domain-badge {
      font-size: 0.725rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      background: rgba(0, 164, 228, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(0, 164, 228, 0.3);
    }
    .topic-domain-weight {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      font-weight: 700;
      color: #fbbf24;
    }
    .topic-domain-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: #f1f5f9;
      line-height: 1.35;
    }

    .topic-anchor-bar {
      display: flex;
      gap: 0.5rem;
      background: #0d1522;
      padding: 0.5rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      margin-bottom: 2rem;
      overflow-x: auto;
      position: sticky;
      top: 75px;
      z-index: 30;
      backdrop-filter: blur(10px);
    }
    .topic-anchor-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.5rem 0.95rem;
      font-family: var(--font-sans);
      font-size: 0.825rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .topic-anchor-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .topic-anchor-btn.active {
      color: #38bdf8;
      background: #1e293b;
    }

    .topic-domain-header {
      background: linear-gradient(180deg, #131d31 0%, #0d1522 100%);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 1.5rem 1.75rem;
      margin-bottom: 2rem;
    }
    .topic-domain-title {
      font-size: 1.45rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
    }

    .topic-section-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 2rem;
      margin-bottom: 2.5rem;
      scroll-margin-top: 140px;
    }
    .topic-sec-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    .topic-sec-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
    }
    .topic-sec-num {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      background: #0284c7;
      color: #fff;
    }

    /* Theory Content Markdown Styling */
    .theory-content {
      color: #cbd5e1;
      font-size: 0.95rem;
      line-height: 1.7;
    }
    .theory-content h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin: 2rem 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    .theory-content h3:first-child {
      margin-top: 0;
    }
    .theory-content h4 {
      font-size: 1.05rem;
      font-weight: 600;
      color: #38bdf8;
      margin: 1.5rem 0 0.75rem;
    }
    .theory-content p {
      margin-bottom: 1rem;
    }
    .theory-content ul, .theory-content ol {
      margin-bottom: 1.25rem;
      padding-left: 1.5rem;
    }
    .theory-content li {
      margin-bottom: 0.5rem;
    }
    .theory-content strong {
      color: #f8fafc;
      font-weight: 600;
    }
    .theory-content hr {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 2rem 0;
    }
    .theory-content pre {
      background: #080d18;
      border: 1px solid #1e293b;
      border-radius: 10px;
      padding: 1.25rem;
      overflow-x: auto;
      margin: 1.25rem 0;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: #38bdf8;
      line-height: 1.5;
    }
    .theory-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      background: #0d1522;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid var(--border);
      display: block;
      overflow-x: auto;
      max-width: 100%;
      -webkit-overflow-scrolling: touch;
    }
    .theory-content th {
      background: #111a2e;
      color: #94a3b8;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--border);
    }
    .theory-content td {
      padding: 0.85rem 1rem;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--border);
      color: #e2e8f0;
      vertical-align: top;
    }
    .theory-content tr:hover td {
      background: #162238;
    }
    .math-tag {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }
    .service-tag {
      font-weight: 700;
      color: #38bdf8;
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }
    .trap-tag {
      color: #f87171;
      font-size: 0.85rem;
    }

    /* Floating Back-To-Top Button */
    .back-to-top-btn {
      position: fixed;
      right: 1.5rem;
      bottom: 2rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #1e293b;
      border: 1px solid #3b82f6;
      color: #fff;
      font-size: 1.1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 10px rgba(59, 130, 246, 0.25);
      z-index: 80;
      opacity: 0;
      pointer-events: none;
      transform: translateY(10px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .back-to-top-btn.visible {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .back-to-top-btn:hover {
      background: #2563eb;
      transform: translateY(-2px);
    }

    /* Mobile Bottom Navigation Bar */
    .bottom-nav-bar {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: rgba(13, 21, 34, 0.96);
      backdrop-filter: blur(16px);
      border-top: 1px solid var(--border);
      z-index: 90;
      justify-content: space-around;
      align-items: center;
      padding: 0 0.25rem;
    }
    .bottom-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.15rem;
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-family: var(--font-sans);
      font-size: 0.68rem;
      font-weight: 600;
      padding: 0.35rem 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      flex: 1;
      transition: all 0.2s ease;
    }
    .bottom-nav-item .b-icon {
      font-size: 1.1rem;
      line-height: 1;
    }
    .bottom-nav-item.active {
      color: #38bdf8;
    }
    .bottom-nav-item.active .b-icon {
      transform: scale(1.1);
    }

    /* Question Palette Styles */
    .palette-container {
      background: var(--bg-panel);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.75rem;
      animation: fadeIn 0.25s ease;
    }
    .palette-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .palette-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .palette-filters {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
    }
    .palette-filter-btn {
      background: #162032;
      border: 1px solid var(--border);
      color: var(--text-muted);
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .palette-filter-btn:hover {
      color: #fff;
      border-color: #475569;
    }
    .palette-filter-btn.active {
      background: #0284c7;
      color: #fff;
      border-color: #0284c7;
    }
    .palette-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(36px, 1fr));
      gap: 0.45rem;
    }
    .palette-pill {
      height: 36px;
      border-radius: 8px;
      background: #111a2e;
      border: 1px solid var(--border);
      color: #94a3b8;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .palette-pill:hover {
      border-color: #38bdf8;
      color: #fff;
      transform: translateY(-2px);
    }
    .palette-pill.correct {
      background: rgba(16, 185, 129, 0.2);
      border-color: #10b981;
      color: #34d399;
    }
    .palette-pill.wrong {
      background: rgba(239, 68, 68, 0.2);
      border-color: #ef4444;
      color: #f87171;
    }
    .palette-pill.active-q {
      box-shadow: 0 0 10px #38bdf8;
      border-color: #38bdf8;
      font-weight: 700;
    }

    /* Sub-tabs for Topic Study */
    .topic-subtab-bar {
      display: flex;
      gap: 0.5rem;
      background: #0d1522;
      padding: 0.4rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      margin-bottom: 2rem;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      position: sticky;
      top: 65px;
      z-index: 30;
      backdrop-filter: blur(12px);
    }
    .topic-subtab-bar::-webkit-scrollbar { display: none; }
    .topic-subtab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 0.55rem 1rem;
      font-family: var(--font-sans);
      font-size: 0.825rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      white-space: nowrap;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .topic-subtab-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .topic-subtab-btn.active {
      color: #fff;
      background: #1e293b;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      border: 1px solid #3b82f6;
    }

    /* Comprehensive Mobile Responsive Styles */
    @media (max-width: 768px) {
      .header-inner {
        padding: 0.75rem 1rem;
        gap: 0.75rem;
        flex-direction: column;
        align-items: stretch;
      }
      .brand {
        justify-content: flex-start;
      }
      .brand-title {
        font-size: 1.1rem;
      }
      .brand-subtitle {
        font-size: 0.75rem;
      }
      .nav-tabs {
        width: 100%;
        max-width: 100%;
        padding: 0.25rem;
        gap: 0.2rem;
      }
      .tab-btn {
        padding: 0.45rem 0.75rem;
        font-size: 0.8rem;
      }
      .stats-pill {
        width: 100%;
        justify-content: space-between;
        padding: 0.4rem 0.85rem;
        font-size: 0.775rem;
      }
      .main-content {
        padding: 1rem 0.85rem 4rem;
      }
      .topic-domain-nav {
        grid-template-columns: 1fr;
        gap: 0.65rem;
      }
      .topic-domain-btn {
        padding: 0.85rem 1rem;
      }
      .topic-domain-header {
        padding: 1.15rem 1rem;
        margin-bottom: 1.5rem;
      }
      .topic-domain-title {
        font-size: 1.2rem;
      }
      .topic-anchor-bar {
        top: 60px;
        margin-bottom: 1.25rem;
        padding: 0.4rem;
      }
      .topic-anchor-btn {
        font-size: 0.775rem;
        padding: 0.4rem 0.75rem;
      }
      .topic-section-card {
        padding: 1.25rem 0.85rem;
        margin-bottom: 1.5rem;
      }
      .topic-sec-title {
        font-size: 1.1rem;
        flex-wrap: wrap;
      }
      .quiz-toolbar {
        flex-direction: column;
        align-items: stretch;
        padding: 0.85rem 1rem;
        gap: 0.85rem;
      }
      .filter-group {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        flex-wrap: nowrap;
        padding-bottom: 0.35rem;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .filter-group::-webkit-scrollbar { display: none; }
      .filter-chip {
        flex-shrink: 0;
        font-size: 0.775rem;
        padding: 0.35rem 0.65rem;
      }
      .search-box {
        width: 100% !important;
      }
      .mode-switch-group {
        width: 100%;
      }
      .mode-btn {
        flex: 1;
        justify-content: center;
        padding: 0.5rem 0.35rem;
        font-size: 0.75rem;
        text-align: center;
      }
      .q-card {
        padding: 1.15rem 0.85rem;
      }
      .q-stem {
        font-size: 0.95rem;
        line-height: 1.55;
      }
      .option-item {
        padding: 0.75rem 0.85rem;
        gap: 0.65rem;
      }
      .opt-key {
        width: 24px;
        height: 24px;
        font-size: 0.8rem;
      }
      .opt-text {
        font-size: 0.875rem;
      }
      .explanation-drawer {
        padding: 1rem 0.85rem;
      }
      .graph-svg-wrapper {
        height: 480px;
      }
      .graph-inspector {
        position: fixed;
        left: 1rem;
        right: 1rem;
        bottom: 1rem;
        width: auto;
        max-height: 55vh;
        overflow-y: auto;
      }
      .quiz-toast {
        max-width: 90vw;
        font-size: 0.775rem;
        padding: 0.5rem 1rem;
        white-space: normal;
        text-align: center;
      }
      .bottom-nav-bar {
        display: flex;
      }
      .back-to-top-btn {
        bottom: 4.8rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        font-size: 1rem;
      }
      .palette-grid {
        grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
        gap: 0.35rem;
      }
      .palette-pill {
        height: 32px;
        font-size: 0.75rem;
      }
    }
  </style>
</head>
<body>

  <!-- App Header -->
  <header class="app-header">
    <div class="header-inner">
      <div class="brand">
        <span class="brand-badge">AIF-C01</span>
        <div>
          <div class="brand-title">AWS AI Practitioner Mastery Studio</div>
          <div class="brand-subtitle">Hệ thống hóa 57 Đề thi • 82 Thuật ngữ cốt lõi • Bản đồ liên kết động</div>
        </div>
      </div>

      <nav class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('topics')">📚 Ôn tập theo chủ đề</button>
        <button class="tab-btn" onclick="switchTab('quiz')">📝 Luyện đề 57 Câu</button>
        <button class="tab-btn" onclick="switchTab('graph')">🧭 Bản đồ Khái niệm</button>
        <button class="tab-btn" onclick="switchTab('matrix')">⚡ Bảng Quyết định & Bẫy</button>
        <button class="tab-btn" onclick="switchTab('ste')">📖 Từ điển thuật ngữ</button>
      </nav>

      <div class="stats-pill">
        <div class="stat-item">
          <span class="stat-label">Đã làm:</span>
          <span class="stat-value" id="stats-attempted">0/57</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Đúng:</span>
          <span class="stat-value" id="stats-correct" style="color: #34d399;">0</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Độ chính xác:</span>
          <span class="stat-value" id="stats-accuracy">0%</span>
        </div>
      </div>
    </div>
  </header>

  <main class="main-content">

    <!-- TAB: TOPIC-BASED STUDY (ÔN TẬP THEO CHỦ ĐỀ) -->
    <section id="tab-topics" class="tab-panel active">
      <!-- Domain Navigation Cards -->
      <div class="topic-domain-nav">
        <button class="topic-domain-btn active" onclick="switchTopicDomain(1)">
          <div class="topic-domain-top">
            <span class="topic-domain-badge">Domain 1</span>
            <span class="topic-domain-weight">20%</span>
          </div>
          <div class="topic-domain-name">AI & Machine Learning Fundamentals</div>
        </button>
        <button class="topic-domain-btn" onclick="switchTopicDomain(2)">
          <div class="topic-domain-top">
            <span class="topic-domain-badge">Domain 2</span>
            <span class="topic-domain-weight">24%</span>
          </div>
          <div class="topic-domain-name">Fundamentals of Generative AI</div>
        </button>
        <button class="topic-domain-btn" onclick="switchTopicDomain(3)">
          <div class="topic-domain-top">
            <span class="topic-domain-badge">Domain 3</span>
            <span class="topic-domain-weight">28%</span>
          </div>
          <div class="topic-domain-name">Applications of Foundation Models</div>
        </button>
        <button class="topic-domain-btn" onclick="switchTopicDomain(4)">
          <div class="topic-domain-top">
            <span class="topic-domain-badge">Domain 4</span>
            <span class="topic-domain-weight">14%</span>
          </div>
          <div class="topic-domain-name">Guidelines for Responsible AI</div>
        </button>
        <button class="topic-domain-btn" onclick="switchTopicDomain(5)">
          <div class="topic-domain-top">
            <span class="topic-domain-badge">Domain 5</span>
            <span class="topic-domain-weight">14%</span>
          </div>
          <div class="topic-domain-name">Security, Compliance & Governance</div>
        </button>
      </div>

      <!-- Sub-Tabs for Active Domain -->
      <div class="topic-subtab-bar" id="topic-subtabs">
        <button id="subtab-p1" class="topic-subtab-btn active" onclick="switchTopicSubtab('p1')">
          <span>📖 Phần 1: Lý thuyết & Decision Trees</span>
        </button>
        <button id="subtab-p2" class="topic-subtab-btn" onclick="switchTopicSubtab('p2')">
          <span>📘 Phần 2: Bảng thuật ngữ</span>
        </button>
        <button id="subtab-p3" class="topic-subtab-btn" onclick="switchTopicSubtab('p3')">
          <span>🎯 Phần 3: Câu hỏi tình huống</span>
        </button>
        <button id="subtab-all" class="topic-subtab-btn" onclick="switchTopicSubtab('all')">
          <span>📑 Xem toàn bộ</span>
        </button>
      </div>

      <!-- Container where active domain content is rendered -->
      <div id="topic-content-container">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- TAB 1: CONCEPT GRAPH -->
    <section id="tab-graph" class="tab-panel">
      <div class="graph-container">
        <div class="graph-header">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff;">Bản đồ Liên kết Khái niệm (Concept Knowledge Graph)</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Di chuột hoặc nhấp vào từng node để làm sáng các đường kết nối liên quan giữa các dịch vụ trong đề thi.</p>
          </div>
          <div class="graph-legend">
            <div class="legend-item"><div class="legend-dot" style="background: #00a4e4;"></div><span>Platform / API</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #10b981;"></div><span>RAG & Data</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #f59e0b;"></div><span>Safety & Guardrails</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #6366f1;"></div><span>Responsible AI</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #ec4899;"></div><span>Security & Compliance</span></div>
          </div>
        </div>

        <div class="graph-svg-wrapper">
          <svg id="concept-svg" viewBox="0 0 950 900">
            <defs>
              <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00a4e4" />
                <stop offset="100%" stop-color="#6366f1" />
              </linearGradient>
            </defs>
            <g id="svg-edges"></g>
            <g id="svg-nodes"></g>
          </svg>

          <!-- Node Inspector Drawer -->
          <div id="graph-inspector" class="graph-inspector">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span id="inspect-domain" class="q-domain-tag">Domain 3</span>
              <button onclick="closeInspector()" style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1.1rem;">✕</button>
            </div>
            <div id="inspect-title" class="inspector-title">Amazon Bedrock</div>
            <div id="inspect-desc" class="inspector-desc">Mô tả</div>
            <div class="inspector-links-title">Các liên kết thi cốt lõi:</div>
            <ul id="inspect-links" class="inspector-links"></ul>
          </div>
        </div>
      </div>
    </section>

    <!-- TAB 2: EXAM PRACTICE SIMULATOR -->
    <section id="tab-quiz" class="tab-panel">
      <!-- Toolbar -->
      <div class="quiz-toolbar">
        <div class="filter-group">
          <button class="filter-chip active" onclick="filterDomain('all')">Tất cả (57)</button>
          <button class="filter-chip" onclick="filterDomain(1)">D1: ML Basics (11)</button>
          <button class="filter-chip" onclick="filterDomain(2)">D2: GenAI FMs (11)</button>
          <button class="filter-chip" onclick="filterDomain(3)">D3: Applications (12)</button>
          <button class="filter-chip" onclick="filterDomain(4)">D4: Responsible AI (11)</button>
          <button class="filter-chip" onclick="filterDomain(5)">D5: Security (12)</button>
        </div>

        <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
          <input type="text" id="quiz-search" class="search-box" placeholder="🔍 Tìm câu hỏi / từ khóa..." oninput="handleSearch(this.value)">
          <div class="mode-switch-group">
            <button id="mode-exam-btn" class="mode-btn active exam-mode" onclick="setQuizMode('exam')" title="Ẩn đáp án để bạn tự luyện tập">
              <span class="mode-dot"></span>
              <span>📝 Chế độ Thi (Ẩn đáp án)</span>
            </button>
            <button id="mode-study-btn" class="mode-btn study-mode" onclick="setQuizMode('study')" title="Mở sẵn tất cả đáp án và giải thích để ôn tập nhanh">
              <span class="mode-dot"></span>
              <span>👁️ Chế độ Ôn tập (Hiện tất cả)</span>
            </button>
          </div>
          <button id="toggle-palette-btn" class="action-btn" onclick="togglePalette()" title="Mở bảng lưới 57 câu hỏi để nhảy nhanh và lọc câu đúng/sai">
            <span>🔢 Bảng câu hỏi</span>
          </button>
          <button id="shuffle-btn" class="action-btn" onclick="shuffleQuestions()" title="Trộn ngẫu nhiên thứ tự các câu hỏi để thi thử">
            <span>🔀 Trộn đề</span>
          </button>
          <button id="unshuffle-btn" class="action-btn" onclick="unshuffleQuestions()" style="display:none;" title="Khôi phục thứ tự chuẩn theo từng Domain">
            <span>↩️ Thứ tự gốc</span>
          </button>
          <button class="filter-chip" style="background:#1e293b;" onclick="resetQuiz()" title="Xóa các đáp án đã chọn để làm lại">Làm lại bài thi</button>
        </div>
      </div>

      <!-- Question Palette Component -->
      <div id="palette-drawer" class="palette-container" style="display: none;">
        <!-- Rendered via JS -->
      </div>

      <!-- Questions List -->
      <div class="questions-grid" id="questions-container">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- TAB 3: DECISION MATRIX & TRAPS -->
    <section id="tab-matrix" class="tab-panel">
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Bảng Tra Cứu Quyết Định Dịch Vụ Nhanh (Decision Matrix)</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">Gặp từ khóa tình huống trong đề thi &rarr; Nhận diện ngay dịch vụ AWS chính xác và né các phương án gây nhiễu.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <input type="text" id="matrix-search" class="search-box" style="width: 320px;" placeholder="🔍 Tìm tình huống, dịch vụ AWS, bẫy..." oninput="handleMatrixSearch(this.value)">
            <span id="matrix-count" class="q-badge" style="font-size: 0.8rem; padding: 0.45rem 0.75rem;">25 kết quả</span>
          </div>
        </div>
        
        <div class="table-container">
          <table class="matrix-table">
            <thead>
              <tr>
                <th style="width: 48%; min-width: 260px;">Yêu cầu tình huống trong đề thi</th>
                <th style="width: 26%; min-width: 170px;">Dịch vụ AWS Chính xác</th>
                <th style="width: 26%; min-width: 190px;">Dịch vụ Bẫy (Không chọn)</th>
              </tr>
            </thead>
            <tbody id="matrix-tbody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- TAB 4: DICTIONARY -->
    <section id="tab-ste" class="tab-panel">
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Bộ Từ Điển Thuật Ngữ Cốt Lõi</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">82 định nghĩa tiếng Anh kỹ thuật đơn giản (&le; 25 từ/câu, thể chủ động, một ý/câu) kèm từ khóa đề thi và chú giải tiếng Việt.</p>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <input type="text" id="ste-search" class="search-box" style="width: 320px;" placeholder="🔍 Tìm thuật ngữ, định nghĩa, từ khóa..." oninput="handleSTESearch(this.value)">
            <span id="ste-count" class="q-badge" style="font-size: 0.8rem; padding: 0.45rem 0.75rem;">82 thuật ngữ</span>
          </div>
        </div>

        <div class="filter-group" style="margin-bottom: 1.25rem;">
          <button class="filter-chip active ste-filter-chip" onclick="filterSTEDomain('all')">Tất cả (82)</button>
          <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(1)">D1: ML Basics (17)</button>
          <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(2)">D2: GenAI FMs (16)</button>
          <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(3)">D3: Applications (17)</button>
          <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(4)">D4: Responsible AI (16)</button>
          <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(5)">D5: Security (16)</button>
        </div>
        
        <div class="table-container">
          <table class="matrix-table">
            <thead>
              <tr>
                <th style="width: 20%; min-width: 150px;">Thuật ngữ (Term)</th>
                <th style="width: 36%; min-width: 250px;">Định nghĩa tiếng Anh (Definition)</th>
                <th style="width: 22%; min-width: 170px;">Exam Trigger Keywords</th>
                <th style="width: 22%; min-width: 180px;">Chú giải thực tế (Tiếng Việt)</th>
              </tr>
            </thead>
            <tbody id="ste-tbody">
              <!-- Rendered via JS -->
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Floating Back-to-Top Button -->
    <button id="back-to-top" class="back-to-top-btn" onclick="scrollToTop()" title="Cuộn lên đầu trang">⬆️</button>

    <!-- Mobile Bottom Navigation Bar -->
    <nav class="bottom-nav-bar">
      <button class="bottom-nav-item active" id="bnav-topics" onclick="switchTab('topics')">
        <span class="b-icon">📚</span>
        <span>Chủ đề</span>
      </button>
      <button class="bottom-nav-item" id="bnav-quiz" onclick="switchTab('quiz')">
        <span class="b-icon">📝</span>
        <span>Luyện đề</span>
      </button>
      <button class="bottom-nav-item" id="bnav-graph" onclick="switchTab('graph')">
        <span class="b-icon">🧭</span>
        <span>Bản đồ</span>
      </button>
      <button class="bottom-nav-item" id="bnav-matrix" onclick="switchTab('matrix')">
        <span class="b-icon">⚡</span>
        <span>Bảng bẫy</span>
      </button>
      <button class="bottom-nav-item" id="bnav-ste" onclick="switchTab('ste')">
        <span class="b-icon">📖</span>
        <span>Từ điển</span>
      </button>
    </nav>

  </main>

  <script>
    // Embedded Data
    const APP_DATA = ${JSON.stringify(data)};
    const GRAPH_DATA = ${JSON.stringify(graphData)};

    // State
    let currentTopicDomain = 1;
    let currentTopicSubtab = 'p1'; // 'p1' | 'p2' | 'p3' | 'all'
    let currentDomainFilter = 'all';
    let searchQuery = '';
    let quizMode = 'exam'; // 'exam' | 'study'
    let isShuffled = false;
    let isPaletteOpen = false;
    let paletteFilter = 'all'; // 'all' | 'unanswered' | 'wrong' | 'correct'
    let customQuestionOrder = null;
    let matrixSearchQuery = '';
    let steSearchQuery = '';
    let steDomainFilter = 'all';
    const revealedCards = new Set();
    const userAnswers = {}; // { qId: ['A', 'B'] }

    // Init App
    window.addEventListener('DOMContentLoaded', () => {
      renderTopicDomain(currentTopicDomain);
      renderQuiz();
      renderDecisionMatrix();
      renderSTEDictionary();
      renderConceptGraph();
      initScrollListener();
    });

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
      
      const targetBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (targetBtn) targetBtn.classList.add('active');
      const bottomBtn = document.getElementById('bnav-' + tabId);
      if (bottomBtn) bottomBtn.classList.add('active');
      const panel = document.getElementById('tab-' + tabId);
      if (panel) panel.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Topic-Based Study Functions
    function switchTopicDomain(domainId) {
      currentTopicDomain = domainId;
      document.querySelectorAll('.topic-domain-btn').forEach((btn, idx) => {
        if (idx + 1 === domainId) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      renderTopicDomain(domainId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function switchTopicSubtab(subId) {
      currentTopicSubtab = subId;
      document.querySelectorAll('.topic-subtab-btn').forEach(btn => {
        if (btn.getAttribute('onclick').includes(subId)) btn.classList.add('active');
        else btn.classList.remove('active');
      });
      applyTopicSubtabVisibility();
    }

    function applyTopicSubtabVisibility() {
      const p1 = document.getElementById('topic-sec-p1');
      const p2 = document.getElementById('topic-sec-p2');
      const p3 = document.getElementById('topic-sec-p3');
      if (!p1 || !p2 || !p3) return;

      if (currentTopicSubtab === 'all') {
        p1.style.display = 'block';
        p2.style.display = 'block';
        p3.style.display = 'block';
      } else {
        p1.style.display = currentTopicSubtab === 'p1' ? 'block' : 'none';
        p2.style.display = currentTopicSubtab === 'p2' ? 'block' : 'none';
        p3.style.display = currentTopicSubtab === 'p3' ? 'block' : 'none';
      }
    }

    // Floating Back-to-Top
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function initScrollListener() {
      window.addEventListener('scroll', () => {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;
        if (window.scrollY > 280) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });
    }

    // Question Palette Functions
    function togglePalette() {
      isPaletteOpen = !isPaletteOpen;
      const drawer = document.getElementById('palette-drawer');
      const btn = document.getElementById('toggle-palette-btn');
      if (!drawer) return;
      if (isPaletteOpen) {
        drawer.style.display = 'block';
        if (btn) btn.classList.add('shuffle-active');
        renderPalette();
      } else {
        drawer.style.display = 'none';
        if (btn) btn.classList.remove('shuffle-active');
      }
    }

    function setPaletteFilter(filter) {
      paletteFilter = filter;
      renderPalette();
    }

    function scrollToQuestion(qId) {
      const el = document.getElementById('card-quiz-' + qId) || document.getElementById('card-' + qId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.borderColor = '#00a4e4';
        el.style.boxShadow = '0 0 20px rgba(0, 164, 228, 0.45)';
        setTimeout(() => {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }, 1500);
      }
    }

    function renderPalette() {
      const drawer = document.getElementById('palette-drawer');
      if (!drawer || !isPaletteOpen) return;

      const allQs = getAllQuestions();
      let answeredCount = 0;
      let correctCount = 0;
      let wrongCount = 0;

      const items = allQs.map((q, idx) => {
        const userSel = userAnswers[q.id] || [];
        const isAttempted = userSel.length > 0;
        const correctLetters = (q.correctAnswer.match(/\\b[A-E]\\b/g) || []);
        const lettersSorted = correctLetters.sort().join('');
        const userSorted = [...userSel].sort().join('');

        let status = 'unanswered';
        if (isAttempted) {
          answeredCount++;
          if (userSorted === lettersSorted) {
            status = 'correct';
            correctCount++;
          } else {
            status = 'wrong';
            wrongCount++;
          }
        }

        return {
          id: q.id,
          num: idx + 1,
          domainId: q.domainId,
          status
        };
      });

      const unansweredCount = allQs.length - answeredCount;

      const filteredItems = items.filter(item => {
        if (paletteFilter === 'all') return true;
        return item.status === paletteFilter;
      });

      const pillsHtml = filteredItems.map(item => \`
        <button class="palette-pill \${item.status}" onclick="scrollToQuestion('\${item.id}')" title="Câu \${item.num} (Domain \${item.domainId})">
          \${item.num}
        </button>
      \`).join('');

      drawer.innerHTML = \`
        <div class="palette-header">
          <div class="palette-title">
            <span>🔢 Bản đồ 57 câu hỏi (\${answeredCount}/\${allQs.length} đã làm)</span>
          </div>
          <div class="palette-filters">
            <button class="palette-filter-btn \${paletteFilter === 'all' ? 'active' : ''}" onclick="setPaletteFilter('all')">
              Tất cả (\${allQs.length})
            </button>
            <button class="palette-filter-btn \${paletteFilter === 'unanswered' ? 'active' : ''}" onclick="setPaletteFilter('unanswered')">
              Chưa làm (\${unansweredCount})
            </button>
            <button class="palette-filter-btn \${paletteFilter === 'wrong' ? 'active' : ''}" style="color:#f87171;" onclick="setPaletteFilter('wrong')">
              ❌ Sai (\${wrongCount})
            </button>
            <button class="palette-filter-btn \${paletteFilter === 'correct' ? 'active' : ''}" style="color:#34d399;" onclick="setPaletteFilter('correct')">
              ✅ Đúng (\${correctCount})
            </button>
          </div>
        </div>
        <div class="palette-grid">
          \${pillsHtml}
        </div>
      \`;
    }

    function renderTopicDomain(domainId) {
      const d = APP_DATA.domains.find(item => item.domainId === domainId);
      if (!d) return;

      const container = document.getElementById('topic-content-container');
      if (!container) return;

      const weightMatch = d.title.match(/\\((\\d+%)\\)/);
      const weightText = weightMatch ? weightMatch[1] : '';

      // STE terms table rows
      const steRows = d.steTerms.map(t => \`
        <tr>
          <td><strong style="color: #fff; font-size: 0.95rem;">\${t.term}</strong></td>
          <td style="color: #38bdf8; font-family: var(--font-mono); font-size: 0.85rem; line-height:1.5;">\${t.definition}</td>
          <td style="color: #fbbf24; font-size: 0.85rem;">\${t.keywords}</td>
          <td style="color: #cbd5e1; font-size: 0.85rem;">\${t.note}</td>
        </tr>
      \`).join('');

      // Questions HTML
      const questionsHtml = renderQuestionsListHtml(d.questions, 'topic');

      container.innerHTML = \`
        <div class="topic-domain-header">
          <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:0.65rem; flex-wrap:wrap;">
            <span class="brand-badge" style="background:#0284c7;">Domain \${d.domainId}</span>
            <span class="q-type-tag">\${weightText} Trọng số bài thi</span>
            <span class="q-domain-tag">\${d.questions.length} câu hỏi tình huống</span>
            <span class="q-domain-tag" style="background:rgba(16,185,129,0.15); color:#34d399; border-color:rgba(16,185,129,0.3);">\${d.steTerms.length} thuật ngữ</span>
          </div>
          <h1 class="topic-domain-title">\${d.title}</h1>
        </div>

        <!-- PHẦN 1: TRỌNG TÂM LÝ THUYẾT -->
        <div class="topic-section-card" id="topic-sec-p1">
          <div class="topic-sec-header">
            <div class="topic-sec-title">
              <span class="topic-sec-num">Phần 1</span>
              <span>Trọng tâm lý thuyết & Decision Trees</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">
              Kiến thức cốt lõi, sơ đồ phân cấp, ma trận quyết định và bảng đối chiếu các dịch vụ AWS.
            </p>
          </div>
          <div class="theory-content">
            \${d.theoryHtml}
          </div>
        </div>

        <!-- PHẦN 2: BẢNG KHÁI NIỆM THUẬT NGỮ -->
        <div class="topic-section-card" id="topic-sec-p2">
          <div class="topic-sec-header">
            <div class="topic-sec-title">
              <span class="topic-sec-num" style="background:#059669;">Phần 2</span>
              <span>Bảng khái niệm thuật ngữ (\${d.steTerms.length} thuật ngữ)</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">
              Định nghĩa tiếng Anh kỹ thuật đơn giản kèm từ khóa kích hoạt câu hỏi trong đề thi.
            </p>
          </div>
          <div class="table-container">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th style="width: 20%; min-width: 150px;">Thuật ngữ (Term)</th>
                  <th style="width: 36%; min-width: 250px;">Định nghĩa tiếng Anh (Definition)</th>
                  <th style="width: 22%; min-width: 170px;">Exam Trigger Keywords</th>
                  <th style="width: 22%; min-width: 180px;">Chú giải thực tế (Tiếng Việt)</th>
                </tr>
              </thead>
              <tbody>
                \${steRows}
              </tbody>
            </table>
          </div>
        </div>

        <!-- PHẦN 3: BỘ CÂU HỎI TÌNH HUỐNG -->
        <div class="topic-section-card" id="topic-sec-p3">
          <div class="topic-sec-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
            <div>
              <div class="topic-sec-title">
                <span class="topic-sec-num" style="background:#7c3aed;">Phần 3</span>
                <span>Bộ câu hỏi tình huống & Phân tích đáp án (\${d.questions.length} câu)</span>
              </div>
              <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.35rem;">
                Tình huống thực tế sát đề thi AIF-C01. Bấm vào từng phương án để kiểm tra đúng/sai và xem phân tích bẫy 4 bước.
              </p>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center;">
              <button class="action-btn" onclick="revealAllTopicQuestions(\${d.domainId})">
                <span>👁️ Mở đáp án phần này</span>
              </button>
              <button class="action-btn" onclick="hideAllTopicQuestions(\${d.domainId})">
                <span>🙈 Ẩn đáp án</span>
              </button>
            </div>
          </div>
          <div class="questions-grid">
            \${questionsHtml}
          </div>
        </div>
      \`;
      applyTopicSubtabVisibility();
    }

    function revealAllTopicQuestions(domainId) {
      const d = APP_DATA.domains.find(item => item.domainId === domainId);
      if (!d) return;
      d.questions.forEach(q => revealedCards.add(q.id));
      renderTopicDomain(domainId);
      renderQuiz();
      showToast(\`👁️ Đã mở đáp án cho tất cả câu hỏi Domain \${domainId}!\`);
    }

    function hideAllTopicQuestions(domainId) {
      const d = APP_DATA.domains.find(item => item.domainId === domainId);
      if (!d) return;
      d.questions.forEach(q => revealedCards.delete(q.id));
      renderTopicDomain(domainId);
      renderQuiz();
      showToast(\`🙈 Đã ẩn đáp án cho Domain \${domainId}!\`);
    }

    // Render Decision Matrix with search
    function renderDecisionMatrix() {
      const tbody = document.getElementById('matrix-tbody');
      const countEl = document.getElementById('matrix-count');
      const q = matrixSearchQuery.toLowerCase().trim();

      const filtered = APP_DATA.decisionMatrix.filter(row => {
        if (!q) return true;
        const text = (row.scenario + ' ' + row.service + ' ' + row.trap).toLowerCase();
        return text.includes(q);
      });

      if (countEl) countEl.textContent = \`\${filtered.length}/\${APP_DATA.decisionMatrix.length} kết quả\`;

      if (filtered.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="3" style="text-align:center; padding:2.5rem; color:var(--text-dim);">
              Không tìm thấy tình huống nào phù hợp với từ khóa "\${matrixSearchQuery}".
            </td>
          </tr>
        \`;
        return;
      }

      tbody.innerHTML = filtered.map(row => {
        const scenarioFormatted = row.scenario.replace(/\\$\\rightarrow\\$/g, ' &rarr; ').replace(/\\rightarrow/g, ' &rarr; ');
        return \`
          <tr>
            <td>\${scenarioFormatted}</td>
            <td><span class="service-tag">\${row.service}</span></td>
            <td><span class="trap-tag">\${row.trap}</span></td>
          </tr>
        \`;
      }).join('');
    }

    function handleMatrixSearch(val) {
      matrixSearchQuery = val;
      renderDecisionMatrix();
    }

    // Render STE Dictionary with search and domain filter
    function renderSTEDictionary() {
      const tbody = document.getElementById('ste-tbody');
      const countEl = document.getElementById('ste-count');
      const q = steSearchQuery.toLowerCase().trim();

      const allTerms = [];
      APP_DATA.domains.forEach(d => {
        d.steTerms.forEach(t => allTerms.push({ ...t, domainId: d.domainId }));
      });

      const filtered = allTerms.filter(t => {
        if (steDomainFilter !== 'all' && t.domainId !== steDomainFilter) return false;
        if (q) {
          const text = (t.term + ' ' + t.definition + ' ' + t.keywords + ' ' + t.note).toLowerCase();
          if (!text.includes(q)) return false;
        }
        return true;
      });

      if (countEl) countEl.textContent = \`\${filtered.length}/\${allTerms.length} thuật ngữ\`;

      if (filtered.length === 0) {
        tbody.innerHTML = \`
          <tr>
            <td colspan="4" style="text-align:center; padding:2.5rem; color:var(--text-dim);">
              Không tìm thấy thuật ngữ nào phù hợp với từ khóa "\${steSearchQuery}".
            </td>
          </tr>
        \`;
        return;
      }

      tbody.innerHTML = filtered.map(t => \`
        <tr>
          <td>
            <div style="display:flex; flex-direction:column; gap:0.35rem;">
              <strong style="color: #fff; font-size: 0.95rem;">\${t.term}</strong>
              <span class="q-domain-tag" style="align-self:flex-start; font-size:0.7rem; padding:0.15rem 0.45rem;">Domain \${t.domainId}</span>
            </div>
          </td>
          <td style="color: #38bdf8; font-family: var(--font-mono); font-size: 0.85rem; line-height:1.5;">\${t.definition}</td>
          <td style="color: #fbbf24; font-size: 0.85rem;">\${t.keywords}</td>
          <td style="color: #cbd5e1; font-size: 0.85rem;">\${t.note}</td>
        </tr>
      \`).join('');
    }

    function handleSTESearch(val) {
      steSearchQuery = val;
      renderSTEDictionary();
    }

    function filterSTEDomain(domainId) {
      steDomainFilter = domainId;
      document.querySelectorAll('.ste-filter-chip').forEach(c => {
        if (domainId === 'all' && c.textContent.includes('Tất cả')) c.classList.add('active');
        else if (c.textContent.startsWith('D' + domainId)) c.classList.add('active');
        else c.classList.remove('active');
      });
      renderSTEDictionary();
    }

    // Flatten all questions with optional shuffle ordering
    function getAllQuestions() {
      const originalList = [];
      APP_DATA.domains.forEach(d => {
        d.questions.forEach(q => originalList.push(q));
      });

      if (!isShuffled || !customQuestionOrder) {
        return originalList;
      }

      const map = new Map(originalList.map(q => [q.id, q]));
      const orderedList = [];
      customQuestionOrder.forEach(id => {
        if (map.has(id)) orderedList.push(map.get(id));
      });
      return orderedList;
    }

    // Shuffle Exam Logic
    function shuffleQuestions() {
      const allQs = [];
      APP_DATA.domains.forEach(d => {
        d.questions.forEach(q => allQs.push(q));
      });

      // Fisher-Yates shuffle
      const shuffled = [...allQs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      customQuestionOrder = shuffled.map(q => q.id);
      isShuffled = true;
      updateShuffleButtons();
      renderQuiz();
      renderPalette();
      showToast('🔀 Đã xáo trộn ngẫu nhiên thứ tự 57 câu hỏi!');
    }

    function unshuffleQuestions() {
      isShuffled = false;
      customQuestionOrder = null;
      updateShuffleButtons();
      renderQuiz();
      renderPalette();
      showToast('↩️ Đã khôi phục thứ tự chuẩn theo Domain!');
    }

    function updateShuffleButtons() {
      const shuffleBtn = document.getElementById('shuffle-btn');
      const unshuffleBtn = document.getElementById('unshuffle-btn');
      if (!shuffleBtn || !unshuffleBtn) return;

      if (isShuffled) {
        shuffleBtn.classList.add('shuffle-active');
        shuffleBtn.innerHTML = '<span>🎲 Trộn lại</span>';
        unshuffleBtn.style.display = 'flex';
      } else {
        shuffleBtn.classList.remove('shuffle-active');
        shuffleBtn.innerHTML = '<span>🔀 Trộn đề</span>';
        unshuffleBtn.style.display = 'none';
      }
    }

    function showToast(msg) {
      let toast = document.getElementById('quiz-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'quiz-toast';
        toast.className = 'quiz-toast';
        document.body.appendChild(toast);
      }
      toast.textContent = msg;
      toast.classList.add('show');
      if (window.toastTimeout) clearTimeout(window.toastTimeout);
      window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
      }, 2200);
    }

    // Filter Logic
    function filterDomain(domainId) {
      currentDomainFilter = domainId;
      document.querySelectorAll('.filter-chip').forEach(c => {
        if (domainId === 'all' && c.textContent.includes('Tất cả')) c.classList.add('active');
        else if (c.textContent.startsWith('D' + domainId)) c.classList.add('active');
        else c.classList.remove('active');
      });
      renderQuiz();
    }

    function handleSearch(val) {
      searchQuery = val.toLowerCase().trim();
      renderQuiz();
    }

    // Quiz Mode Switcher
    function setQuizMode(mode) {
      quizMode = mode;
      const examBtn = document.getElementById('mode-exam-btn');
      const studyBtn = document.getElementById('mode-study-btn');
      if (examBtn && studyBtn) {
        if (mode === 'exam') {
          examBtn.classList.add('active');
          studyBtn.classList.remove('active');
        } else {
          studyBtn.classList.add('active');
          examBtn.classList.remove('active');
        }
      }
      renderQuiz();
    }

    function toggleCardExplanation(qId, event) {
      if (event) event.stopPropagation();
      if (revealedCards.has(qId)) {
        revealedCards.delete(qId);
      } else {
        revealedCards.add(qId);
      }
      renderQuiz();
      renderTopicDomain(currentTopicDomain);
    }

    function resetQuiz() {
      for (const k in userAnswers) delete userAnswers[k];
      revealedCards.clear();
      setQuizMode('exam');
      updateStats();
      renderQuiz();
      renderTopicDomain(currentTopicDomain);
      renderPalette();
      showToast('🔄 Đã làm mới kết quả bài thi!');
    }

    function formatMarkdown(text) {
      if (!text) return '';
      return text
        .replace(/\\$\\rightarrow\\$/g, ' &rarr; ')
        .replace(/\\$\\to\\$/g, ' &rarr; ')
        .replace(/\\rightarrow/g, ' &rarr; ')
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
        .split('\\n')
        .map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return \`<div class="exp-bullet">\${trimmed.substring(2)}</div>\`;
          }
          return \`<p style="margin-bottom:0.4rem;">\${trimmed}</p>\`;
        })
        .join('');
    }

    // Option Click Handler
    function handleOptionClick(qId, key, isMultiple) {
      if (!userAnswers[qId]) userAnswers[qId] = [];
      
      if (isMultiple) {
        const idx = userAnswers[qId].indexOf(key);
        if (idx > -1) {
          userAnswers[qId].splice(idx, 1);
        } else {
          if (userAnswers[qId].length < 2) {
            userAnswers[qId].push(key);
          } else {
            userAnswers[qId] = [userAnswers[qId][1], key];
          }
        }
      } else {
        userAnswers[qId] = [key];
      }
      
      updateStats();
      renderQuiz();
      renderTopicDomain(currentTopicDomain);
      renderPalette();
    }

    function updateStats() {
      const allQs = getAllQuestions();
      const attemptedIds = Object.keys(userAnswers).filter(id => userAnswers[id].length > 0);
      let correctCount = 0;

      attemptedIds.forEach(id => {
        const q = allQs.find(item => item.id === id);
        if (q) {
          const selected = userAnswers[id].sort().join('');
          // Parse correct answer letters
          const letters = (q.correctAnswer.match(/\\b[A-E]\\b/g) || []).sort().join('');
          if (selected === letters) correctCount++;
        }
      });

      document.getElementById('stats-attempted').textContent = \`\${attemptedIds.length}/\${allQs.length}\`;
      document.getElementById('stats-correct').textContent = correctCount;
      const pct = attemptedIds.length > 0 ? Math.round((correctCount / attemptedIds.length) * 100) : 0;
      document.getElementById('stats-accuracy').textContent = pct + '%';
    }

    // Reusable Question Cards Renderer
    function renderQuestionsListHtml(questions, prefix = '') {
      return questions.map((q, idx) => {
        const userSel = userAnswers[q.id] || [];
        const isAttempted = userSel.length > 0;
        const correctLetters = (q.correctAnswer.match(/\\b[A-E]\\b/g) || []);
        const isRevealedByCard = revealedCards.has(q.id);
        const shouldShowExplanation = (quizMode === 'study') || isRevealedByCard || (q.isMultiple ? userSel.length === 2 : userSel.length === 1);

        const orderBadgeHtml = (prefix === 'quiz' && isShuffled)
          ? \`<span class="q-badge" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; border-color: rgba(245, 158, 11, 0.45);">Câu \${idx + 1}</span>
             <span class="q-badge" style="opacity: 0.75; font-size: 0.7rem;" title="Mã câu hỏi gốc trong giáo trình">Gốc: #D\${q.domainId}-Q\${q.number}</span>\`
          : \`<span class="q-badge">#D\${q.domainId}-Q\${q.number}</span>\`;

        const optionsHtml = q.options.map(opt => {
          const isSelected = userSel.includes(opt.key);
          const isCorrect = correctLetters.includes(opt.key);
          
          let stateClass = '';
          if (shouldShowExplanation) {
            if (isCorrect) stateClass = 'selected-correct';
            else if (isSelected && !isCorrect) stateClass = 'selected-wrong';
          } else if (isSelected) {
            stateClass = 'highlight-correct';
          }

          return \`
            <div class="option-item \${stateClass}" onclick="handleOptionClick('\${q.id}', '\${opt.key}', \${q.isMultiple})">
              <span class="opt-key">\${opt.key}</span>
              <span class="opt-text">\${opt.text}</span>
            </div>
          \`;
        }).join('');

        return \`
          <div class="q-card" id="card-\${prefix ? prefix + '-' : ''}\${q.id}">
            <div class="q-meta">
              \${orderBadgeHtml}
              <span class="q-domain-tag">Domain \${q.domainId}</span>
              <span class="q-type-tag">\${q.isMultiple ? '⚠️ Choose TWO' : 'Single Choice'}</span>
              <button class="q-toggle-btn" onclick="toggleCardExplanation('\${q.id}', event)" title="Bật/Tắt giải thích riêng cho câu này">
                \${shouldShowExplanation ? '🙈 Ẩn giải thích' : '👁️ Xem giải thích'}
              </button>
            </div>

            <div class="q-stem">\${q.stem}</div>

            <div class="options-list">
              \${optionsHtml}
            </div>

            <!-- Explanation Drawer -->
            <div class="explanation-drawer \${shouldShowExplanation ? 'revealed' : ''}">
              <div class="exp-section">
                <div class="exp-title correct">✅ Đáp án đúng: \${q.correctAnswer}</div>
              </div>
              <div class="exp-section">
                <div class="exp-title reason">🎯 Lý do chọn (Keyword Triggers):</div>
                <div class="exp-body">\${formatMarkdown(q.reason)}</div>
              </div>
              <div class="exp-section">
                <div class="exp-title distractor">🔍 Phân tích bẫy (Distractor Analysis):</div>
                <div class="exp-body">\${formatMarkdown(q.distractor)}</div>
              </div>
              <div class="exp-section">
                <div class="exp-title trap">⚠️ Cảnh báo bẫy phòng thi (Trap Alert):</div>
                <div class="exp-body">\${formatMarkdown(q.trap)}</div>
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    // Render Quiz Cards
    function renderQuiz() {
      const container = document.getElementById('questions-container');
      const allQs = getAllQuestions();

      const filtered = allQs.filter(q => {
        if (currentDomainFilter !== 'all' && q.domainId !== currentDomainFilter) return false;
        if (searchQuery) {
          const content = (q.stem + ' ' + q.reason + ' ' + q.options.map(o=>o.text).join(' ')).toLowerCase();
          if (!content.includes(searchQuery)) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        container.innerHTML = \`<div style="text-align:center; padding:3rem; color:var(--text-dim);">Không tìm thấy câu hỏi nào phù hợp với từ khóa "\${searchQuery}".</div>\`;
        return;
      }

      container.innerHTML = renderQuestionsListHtml(filtered, 'quiz');
    }

    // Render Concept Graph
    function renderConceptGraph() {
      const edgesGroup = document.getElementById('svg-edges');
      const nodesGroup = document.getElementById('svg-nodes');

      const colorMap = {
        platform: '#00a4e4',
        rag: '#10b981',
        safety: '#f59e0b',
        responsible: '#6366f1',
        compliance: '#ec4899',
        ml: '#3b82f6',
        storage: '#14b8a6',
        automation: '#8b5cf6',
        security: '#ef4444',
        core_ai: '#06b6d4',
        enterprise: '#8b5cf6',
        search: '#10b981'
      };

      // Draw Edges
      edgesGroup.innerHTML = GRAPH_DATA.edges.map(e => {
        const src = GRAPH_DATA.nodes.find(n => n.id === e.from);
        const tgt = GRAPH_DATA.nodes.find(n => n.id === e.to);
        if (!src || !tgt) return '';

        // Cubic Bezier curve
        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;
        const cx1 = src.x + dx * 0.4;
        const cy1 = src.y;
        const cx2 = src.x + dx * 0.6;
        const cy2 = tgt.y;
        const d = \`M \${src.x} \${src.y} C \${cx1} \${cy1}, \${cx2} \${cy2}, \${tgt.x} \${tgt.y}\`;

        return \`<path id="edge-\${e.from}-\${e.to}" class="graph-edge" data-from="\${e.from}" data-to="\${e.to}" d="\${d}" />\`;
      }).join('');

      // Draw Nodes
      nodesGroup.innerHTML = GRAPH_DATA.nodes.map(n => {
        const color = colorMap[n.group] || '#00a4e4';
        const width = Math.max(120, n.label.length * 7.5 + 20);
        const height = 30;

        return \`
          <g class="node-group" id="node-\${n.id}" transform="translate(\${n.x}, \${n.y})" onclick="selectGraphNode('\${n.id}')">
            <rect class="node-rect" x="\${-width/2}" y="\${-height/2}" width="\${width}" height="\${height}" fill="#162032" stroke="\${color}" />
            <text class="node-text" dy="4">\${n.label}</text>
          </g>
        \`;
      }).join('');
    }

    function selectGraphNode(nodeId) {
      const node = GRAPH_DATA.nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Highlight active edges
      document.querySelectorAll('.graph-edge').forEach(edge => {
        const from = edge.getAttribute('data-from');
        const to = edge.getAttribute('data-to');
        if (from === nodeId || to === nodeId) {
          edge.classList.add('active');
        } else {
          edge.classList.remove('active');
        }
      });

      // Show Inspector
      const inspector = document.getElementById('graph-inspector');
      document.getElementById('inspect-domain').textContent = 'Domain ' + node.domain;
      document.getElementById('inspect-title').textContent = node.label;
      document.getElementById('inspect-desc').textContent = node.desc;

      // Find related links
      const relatedEdges = GRAPH_DATA.edges.filter(e => e.from === nodeId || e.to === nodeId);
      const linksUl = document.getElementById('inspect-links');
      linksUl.innerHTML = relatedEdges.map(e => {
        const otherId = e.from === nodeId ? e.to : e.from;
        const otherNode = GRAPH_DATA.nodes.find(n => n.id === otherId);
        return \`<li><strong>\${e.label}:</strong> \${otherNode ? otherNode.label : otherId}</li>\`;
      }).join('');

      inspector.classList.add('open');
    }

    function closeInspector() {
      document.getElementById('graph-inspector').classList.remove('open');
      document.querySelectorAll('.graph-edge').forEach(e => e.classList.remove('active'));
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(BASE_DIR, "index.html"), htmlContent);
fs.writeFileSync(path.resolve("index.html"), htmlContent);
console.log("Interactive web application successfully built at:", path.join(BASE_DIR, "index.html"), "and ./index.html");
