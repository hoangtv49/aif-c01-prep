import fs from "fs";
import path from "path";

const BASE_DIR = path.resolve("aif-c01-study-guide");
const data = JSON.parse(fs.readFileSync(path.join(BASE_DIR, "data.json"), "utf8"));

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

    /* Decision Matrix Table */
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      background: var(--bg-card);
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid var(--border);
    }
    .matrix-table th {
      background: #0d1522;
      color: #94a3b8;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
    }
    .matrix-table td {
      padding: 1rem 1.25rem;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--border);
      color: #e2e8f0;
    }
    .matrix-table tr:hover td { background: #162238; }
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

    /* Responsive */
    @media (max-width: 768px) {
      .header-inner { flex-direction: column; align-items: flex-start; }
      .nav-tabs { width: 100%; overflow-x: auto; }
      .quiz-toolbar { flex-direction: column; align-items: stretch; }
      .search-box { width: 100%; }
      .graph-inspector { width: calc(100% - 4rem); left: 2rem; right: 2rem; }
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
          <div class="brand-subtitle">Hệ thống hóa 57 Đề thi • 82 Khái niệm ASD-STE100 • Bản đồ liên kết động</div>
        </div>
      </div>

      <nav class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('graph')">🧭 Bản đồ Khái niệm</button>
        <button class="tab-btn" onclick="switchTab('quiz')">📝 Luyện đề 57 Câu</button>
        <button class="tab-btn" onclick="switchTab('matrix')">⚡ Bảng Quyết định & Bẫy</button>
        <button class="tab-btn" onclick="switchTab('ste')">📖 Từ điển ASD-STE100</button>
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

    <!-- TAB 1: CONCEPT GRAPH -->
    <section id="tab-graph" class="tab-panel active">
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
          <button id="shuffle-btn" class="action-btn" onclick="shuffleQuestions()" title="Trộn ngẫu nhiên thứ tự các câu hỏi để thi thử">
            <span>🔀 Trộn đề</span>
          </button>
          <button id="unshuffle-btn" class="action-btn" onclick="unshuffleQuestions()" style="display:none;" title="Khôi phục thứ tự chuẩn theo từng Domain">
            <span>↩️ Thứ tự gốc</span>
          </button>
          <button class="filter-chip" style="background:#1e293b;" onclick="resetQuiz()" title="Xóa các đáp án đã chọn để làm lại">Làm lại bài thi</button>
        </div>
      </div>

      <!-- Questions List -->
      <div class="questions-grid" id="questions-container">
        <!-- Rendered via JS -->
      </div>
    </section>

    <!-- TAB 3: DECISION MATRIX & TRAPS -->
    <section id="tab-matrix" class="tab-panel">
      <div style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Bảng Tra Cứu Quyết Định Dịch Vụ Nhanh (Decision Matrix)</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">Gặp từ khóa tình huống trong đề thi $\\rightarrow$ Nhận diện ngay dịch vụ AWS chính xác và né các phương án gây nhiễu.</p>
        
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Yêu cầu tình huống trong đề thi</th>
              <th>Dịch vụ AWS Chính xác</th>
              <th>Dịch vụ Bẫy (Không chọn)</th>
            </tr>
          </thead>
          <tbody id="matrix-tbody">
            <!-- Rendered via JS -->
          </tbody>
        </table>
      </div>
    </section>

    <!-- TAB 4: ASD-STE100 DICTIONARY -->
    <section id="tab-ste" class="tab-panel">
      <div style="margin-bottom: 2rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">Bộ Từ Điển Khái Niệm Chuẩn ASD-STE100</h2>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">82 định nghĩa tiếng Anh kỹ thuật đơn giản ($\le 25$ từ/câu, thể chủ động, một ý/câu) kèm từ khóa đề thi và chú giải tiếng Việt.</p>
        
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Thuật ngữ (Term)</th>
              <th>ASD-STE100 Definition (English)</th>
              <th>Exam Trigger Keywords</th>
              <th>Chú giải thực tế (Tiếng Việt)</th>
            </tr>
          </thead>
          <tbody id="ste-tbody">
            <!-- Rendered via JS -->
          </tbody>
        </table>
      </div>
    </section>

  </main>

  <script>
    // Embedded Data
    const APP_DATA = ${JSON.stringify(data)};
    const GRAPH_DATA = ${JSON.stringify(graphData)};

    // State
    let currentDomainFilter = 'all';
    let searchQuery = '';
    let quizMode = 'exam'; // 'exam' | 'study'
    let isShuffled = false;
    let customQuestionOrder = null;
    const revealedCards = new Set();
    const userAnswers = {}; // { qId: ['A', 'B'] }

    // Init App
    window.addEventListener('DOMContentLoaded', () => {
      renderQuiz();
      renderDecisionMatrix();
      renderSTEDictionary();
      renderConceptGraph();
    });

    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      
      const targetBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (targetBtn) targetBtn.classList.add('active');
      const panel = document.getElementById('tab-' + tabId);
      if (panel) panel.classList.add('active');
    }

    // Render Decision Matrix
    function renderDecisionMatrix() {
      const tbody = document.getElementById('matrix-tbody');
      tbody.innerHTML = APP_DATA.decisionMatrix.map(row => \`
        <tr>
          <td>\${row.scenario}</td>
          <td><span class="service-tag">\${row.service}</span></td>
          <td><span class="trap-tag">\${row.trap}</span></td>
        </tr>
      \`).join('');
    }

    // Render STE Dictionary
    function renderSTEDictionary() {
      const tbody = document.getElementById('ste-tbody');
      const allTerms = [];
      APP_DATA.domains.forEach(d => {
        d.steTerms.forEach(t => allTerms.push(t));
      });
      tbody.innerHTML = allTerms.map(t => \`
        <tr>
          <td><strong style="color: #fff;">\${t.term}</strong></td>
          <td style="color: #38bdf8; font-family: var(--font-mono); font-size: 0.85rem;">\${t.definition}</td>
          <td style="color: #fbbf24;">\${t.keywords}</td>
          <td style="color: #cbd5e1;">\${t.note}</td>
        </tr>
      \`).join('');
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
      showToast('🔀 Đã xáo trộn ngẫu nhiên thứ tự 57 câu hỏi!');
    }

    function unshuffleQuestions() {
      isShuffled = false;
      customQuestionOrder = null;
      updateShuffleButtons();
      renderQuiz();
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
    }

    function resetQuiz() {
      for (const k in userAnswers) delete userAnswers[k];
      revealedCards.clear();
      setQuizMode('exam');
      updateStats();
      renderQuiz();
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

      container.innerHTML = filtered.map((q, idx) => {
        const userSel = userAnswers[q.id] || [];
        const isAttempted = userSel.length > 0;
        const correctLetters = (q.correctAnswer.match(/\\b[A-E]\\b/g) || []);
        const isRevealedByCard = revealedCards.has(q.id);
        const shouldShowExplanation = (quizMode === 'study') || isRevealedByCard || (q.isMultiple ? userSel.length === 2 : userSel.length === 1);

        const orderBadgeHtml = isShuffled
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
          <div class="q-card" id="card-\${q.id}">
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
console.log("Interactive web application successfully built at:", path.join(BASE_DIR, "index.html"));
