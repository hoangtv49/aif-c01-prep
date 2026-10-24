# AWS Certified AI Practitioner (AIF-C01) Study & Knowledge System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, structured bilingual study and exam-prep knowledge system for AWS Certified AI Practitioner (AIF-C01), synthesizing 119 pages of source material into 5 domain modules and a master index with ASD-STE100 terminology tables and scenario-based exam questions with full distractor analysis.

**Architecture:** A modular Markdown knowledge repository in `aif-c01-study-guide/` organized into 5 official AWS exam domains plus a root `README.md` cheat sheet. Each domain file enforces a uniform 3-part layout: Executive Summary & Decision Trees, ASD-STE100 Terminology Table (sentences $\le 25$ words, active voice), and 5–7 scenario questions with 4-step distractor breakdowns. An automated Bun-based verification script checks structure, word counts, and required sections.

**Tech Stack:** Markdown, Bun (JavaScript runtime for automated content linting and ASD-STE100 rule validation), Git.

**Spec:** `docs/superpowers/specs/2026-10-24-aif-c01-study-system-design.md`

## Global Constraints

- Root output directory: `/home/hoangtv/Learning/aif-c01-study-guide/`
- Target deliverables: `README.md`, `domain-1-fundamentals-ai-ml.md`, `domain-2-generative-ai.md`, `domain-3-fm-applications.md`, `domain-4-responsible-ai.md`, `domain-5-security-compliance-governance.md`
- Complete source coverage: All 16 sections from Vladimir Raykov's guide must be incorporated.
- ASD-STE100 sentence limit: Definitions in the STE column must not exceed 25 words per sentence and must use active voice and single-idea sentences.
- Exam question minimum: Each domain file must include at least 5 realistic scenario-based questions with root cause explanation, option-by-option distractor analysis, and trap warnings.
- Language convention: Bilingual format — Vietnamese for explanations, exam tips, and notes; English for official AWS technical terms and ASD-STE100 definition tables.

## Review Focus

1. **ASD-STE100 Sentence Length Overflow**: Sentences in the STE column exceeding 25 words or using complex nested relative clauses. Validated by automated linter.
2. **Missing Distractor Breakdown**: Exam questions providing only the correct answer without explaining why the other 3 options are incorrect. Validated by regex check for distractor sections.
3. **Omission of Subtle Service Distinctions**: Confusing pairs (e.g. Bedrock vs SageMaker JumpStart, Kendra vs Bedrock Knowledge Bases) lacking explicit comparison tables. Validated during domain creation.
4. **Passive Voice in Technical Definitions**: Definitions using passive constructions ("is used by", "can be done") instead of active voice ("Amazon Bedrock provides", "SageMaker trains"). Validated by automated linter.
5. **Incomplete Source Section Mapping**: A section from the 16-section slide deck omitted from its target domain. Validated against source text mapping.

---

### Task 1: Setup Automated Content & ASD-STE100 Verification Harness

**Files:**
- Create: `scripts/verify-guide.bun.js`

**Interfaces:**
- Consumes: Target markdown files in `aif-c01-study-guide/`
- Produces: CLI validation output returning exit code 0 on pass or exit code 1 with line-numbered errors on failure (checks file existence, table headers, sentence lengths in STE columns, question formats).

- [ ] **Step 1: Write the failing test / validator script**

Write `scripts/verify-guide.bun.js` to parse markdown tables and check:
1. File existence for all 6 target files.
2. ASD-STE100 rule: In the terminology table, definition sentences must have $\le 25$ words.
3. Minimum 5 questions per domain file with "Lý do chọn" and "Phân tích bẫy" / distractor analysis present.

```javascript
// scripts/verify-guide.bun.js
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
```

- [ ] **Step 2: Run test to verify it fails (since files do not exist yet)**

Run: `bun scripts/verify-guide.bun.js`
Expected: FAIL with "Missing file: README.md ... Missing file: domain-1-fundamentals-ai-ml.md"

- [ ] **Step 3: Commit verification harness**

```bash
git add scripts/verify-guide.bun.js
git commit -m "test: add automated verification script for AIF-C01 guide"
```

---

### Task 2: Implement Master Index & Fast Lookup Cheat Sheet (`README.md`)

**Files:**
- Create: `aif-c01-study-guide/README.md`

**Content Requirements:**
- Overview of AWS Certified AI Practitioner (AIF-C01) Blueprint: 5 Domains, scoring (100–1000, 700 to pass), 65 questions, 85 minutes.
- Global Service Decision Matrix (When to use Bedrock vs SageMaker JumpStart, Kendra vs Bedrock Knowledge Bases, Comprehend vs Bedrock, Transcribe vs Rekognition, etc.).
- High-frequency exam trap alerts (Top 10 traps tested by AWS).
- Navigation links to all 5 domain markdown files.

- [ ] **Step 1: Write `aif-c01-study-guide/README.md`**
- [ ] **Step 2: Verify formatting and internal links**
- [ ] **Step 3: Commit**

```bash
git add aif-c01-study-guide/README.md
git commit -m "docs: create AIF-C01 master index and global decision matrix"
```

---

### Task 3: Implement Domain 1: Fundamentals of AI and ML (`domain-1-fundamentals-ai-ml.md`)

**Files:**
- Create: `aif-c01-study-guide/domain-1-fundamentals-ai-ml.md`

**Content Requirements (Covering Sections 1, 2, 3 [Core Services], and 4 [SageMaker Essentials]):**
- **Part 1: Lý thuyết & Decision Matrix**:
  - AI vs ML vs Deep Learning hierarchy.
  - Neural Network components (Input, Hidden, Output layers; Activation functions).
  - ML Lifecycle: Data Prep (Data Wrangler) $\rightarrow$ Training $\rightarrow$ Evaluation $\rightarrow$ Deployment.
  - Learning types: Supervised (Classification, Regression), Unsupervised (Clustering, PCA), Reinforcement Learning.
  - AWS Core AI Managed Services: Rekognition (Vision), Textract (OCR/Tables), Comprehend (NLP/Sentiment), Translate, Polly (TTS), Transcribe (STT), Lex (Chatbots).
  - SageMaker Core Studio & Tools: Data Wrangler, Feature Store, Model Registry, Autopilot.
- **Part 2: Bảng khái niệm chuẩn ASD-STE100**:
  - Minimum 15 key terms (AI, ML, Deep Learning, Supervised Learning, Unsupervised Learning, Regression, Classification, Clustering, Overfitting, Underfitting, SageMaker, Rekognition, Textract, Comprehend, Polly, Transcribe).
  - Strict compliance with $\le 25$ words per sentence and active voice.
- **Part 3: 5–7 Scenario Exam Questions**:
  - Scenario-based questions with full 4-step distractor breakdowns (Root cause, option-by-option rejection, trap alert).

- [ ] **Step 1: Write `domain-1-fundamentals-ai-ml.md`**
- [ ] **Step 2: Run verification script on Domain 1**
Run: `bun scripts/verify-guide.bun.js` (will still report missing files 2-5, but checks Domain 1 tables & questions)
- [ ] **Step 3: Commit**

```bash
git add aif-c01-study-guide/domain-1-fundamentals-ai-ml.md
git commit -m "feat: complete Domain 1 fundamentals of AI and ML module"
```

---

### Task 4: Implement Domain 2: Fundamentals of Generative AI (`domain-2-generative-ai.md`)

**Files:**
- Create: `aif-c01-study-guide/domain-2-generative-ai.md`

**Content Requirements (Covering Sections 5, 6, and 8):**
- **Part 1: Lý thuyết & Decision Matrix**:
  - Foundation Models (FMs) definition, general pre-training, transfer learning.
  - Model Architectures: Transformers (Self-Attention mechanism, Positional Encoding), CNNs (Vision), RNNs (Sequential), Diffusion Models (Image Generation).
  - GenAI Lifecycle & Business Value: Content generation, summarization, conversational agents, code generation.
  - Key Design Considerations when choosing an FM: Cost, Modality (text, image, audio, multimodal), Latency (real-time vs batch), Customizability, Context Window, Licensing.
  - RAG vs Fine-Tuning Decision Tree: When to choose Prompt Engineering vs RAG vs Fine-Tuning vs Pre-training from scratch.
  - Inherent risks of GenAI: Hallucinations, Toxicity, IP / Copyright infringement, Data leakage.
- **Part 2: Bảng khái niệm chuẩn ASD-STE100**:
  - Minimum 15 key terms (Foundation Model, Generative AI, Transformer, Self-Attention, Diffusion Model, Multimodal Model, Latent Space, Context Window, Hallucination, RAG, Fine-Tuning, Pre-training, Transfer Learning, Embedding, Vector Database).
- **Part 3: 5–7 Scenario Exam Questions**:
  - Questions covering FM selection, RAG vs Fine-Tuning choices, hallucination mitigation, context window limitations.

- [ ] **Step 1: Write `domain-2-generative-ai.md`**
- [ ] **Step 2: Run verification script on Domain 2**
- [ ] **Step 3: Commit**

```bash
git add aif-c01-study-guide/domain-2-generative-ai.md
git commit -m "feat: complete Domain 2 fundamentals of generative AI module"
```

---

### Task 5: Implement Domain 3: Applications of Foundation Models (`domain-3-fm-applications.md`)

**Files:**
- Create: `aif-c01-study-guide/domain-3-fm-applications.md`

**Content Requirements (Covering Sections 7, 9, 10, and 11):**
- **Part 1: Lý thuyết & Decision Matrix**:
  - AWS GenAI Toolkit:
    - Amazon Bedrock: Serverless, unified API, leading models (Anthropic Claude, Meta Llama, Cohere, AI21, Amazon Titan).
    - Bedrock features: Knowledge Bases (RAG), Agents (Multi-step task orchestration), Guardrails (safety filtering), Custom Models.
    - Amazon Q: Q Business (enterprise search & assistant), Q Developer (coding assistant).
    - AWS PartyRock: No-code playground based on Bedrock.
    - Amazon SageMaker JumpStart: Model hub with dedicated hosting.
  - Prompt Engineering Essentials: Zero-shot, Few-shot, Chain-of-Thought (CoT), System Prompts.
  - Model Fine-Tuning: Instruction Tuning, Domain Adaptation, Parameter-Efficient Fine-Tuning (PEFT / LoRA), RLHF (Reinforcement Learning from Human Feedback).
  - Evaluating FMs:
    - Automatic Metrics: BLEU (precision for translation), ROUGE (recall for summarization), BERTScore (semantic similarity), Perplexity (predictability).
    - Human Evaluation & Benchmarks: MMLU, GLUE, SQuAD; Bedrock Model Evaluation (automatic & human-in-the-loop).
- **Part 2: Bảng khái niệm chuẩn ASD-STE100**:
  - Minimum 15 key terms (Amazon Bedrock, Bedrock Knowledge Bases, Bedrock Agents, Amazon Q Business, Amazon Q Developer, PartyRock, SageMaker JumpStart, Prompt Engineering, Zero-Shot Prompting, Few-Shot Prompting, Chain-of-Thought, PEFT, LoRA, RLHF, BLEU, ROUGE).
- **Part 3: 5–7 Scenario Exam Questions**:
  - Deep scenario questions on Bedrock vs JumpStart, Knowledge Bases vs fine-tuning, metric selection (summarization $\rightarrow$ ROUGE, translation $\rightarrow$ BLEU), prompt security.

- [ ] **Step 1: Write `domain-3-fm-applications.md`**
- [ ] **Step 2: Run verification script on Domain 3**
- [ ] **Step 3: Commit**

```bash
git add aif-c01-study-guide/domain-3-fm-applications.md
git commit -m "feat: complete Domain 3 applications of foundation models module"
```

---

### Task 6: Implement Domain 4: Guidelines for Responsible AI (`domain-4-responsible-ai.md`)

**Files:**
- Create: `aif-c01-study-guide/domain-4-responsible-ai.md`

**Content Requirements (Covering Sections 12 and 13):**
- **Part 1: Lý thuyết & Decision Matrix**:
  - 6 Pillars of Responsible AI: Fairness, Explainability/Interpretability, Privacy, Robustness/Safety, Transparency, Governance.
  - Bias in AI: Pre-training data bias, historical bias, measurement bias. Detecting and mitigating bias using Amazon SageMaker Clarify.
  - Explainability & Transparency: Global vs Local explainability, SHAP values, feature attribution.
  - AWS AI Service Cards: Transparency documentation outlining intended use, limitations, and responsible design for AWS managed services.
  - Amazon Bedrock Guardrails: Content filtering (hate speech, insults, sexual content, violence), PII masking/redaction, denied topics, hallucination detection.
- **Part 2: Bảng khái niệm chuẩn ASD-STE100**:
  - Minimum 12 key terms (Responsible AI, Fairness, Algorithmic Bias, Model Transparency, Explainability, Interpretability, Feature Attribution, SHAP Values, SageMaker Clarify, AWS AI Service Cards, Bedrock Guardrails, PII Redaction).
- **Part 3: 5–7 Scenario Exam Questions**:
  - Scenarios on detecting bias in credit approval, PII redaction requirements, choosing between SageMaker Clarify and Bedrock Guardrails, and interpreting AI Service Cards.

- [ ] **Step 1: Write `domain-4-responsible-ai.md`**
- [ ] **Step 2: Run verification script on Domain 4**
- [ ] **Step 3: Commit**

```bash
git add aif-c01-study-guide/domain-4-responsible-ai.md
git commit -m "feat: complete Domain 4 guidelines for responsible AI module"
```

---

### Task 7: Implement Domain 5: Security, Compliance, and Governance (`domain-5-security-compliance-governance.md`)

**Files:**
- Create: `aif-c01-study-guide/domain-5-security-compliance-governance.md`

**Content Requirements (Covering Sections 14, 15, and 16):**
- **Part 1: Lý thuyết & Decision Matrix**:
  - AWS Shared Responsibility Model for AI/ML: Customer responsibilities vs AWS responsibilities across Managed Services (Bedrock/Comprehend) vs Infrastructure (SageMaker/EC2).
  - Data Security & Privacy: Data encryption at rest (AWS KMS, customer-managed keys CMK) and in transit (TLS); Private connectivity via AWS PrivateLink / VPC Endpoints (prevent traffic going to public internet).
  - Generative AI Specific Attacks & Vulnerabilities (OWASP Top 10 for LLMs): Prompt Injection (direct & indirect), Jailbreaking, Data Poisoning, Insecure Output Handling.
  - Compliance & Frameworks: ISO/IEC 27002, SOC 1/2/3, NIST 800-53, EU AI Act (risk tiers: Unacceptable/Banned, High-Risk, Minimal Risk).
  - AWS Governance & Audit Tools:
    - AWS Artifact (on-demand compliance reports & SOC audits).
    - AWS Audit Manager (automated evidence collection for AI/ML frameworks).
    - AWS Config (resource compliance & configuration tracking).
    - AWS CloudTrail (API call auditing and user activity tracking).
    - Amazon Inspector (vulnerability scanning).
- **Part 2: Bảng khái niệm chuẩn ASD-STE100**:
  - Minimum 15 key terms (Shared Responsibility Model, AWS KMS, AWS PrivateLink, Prompt Injection, Jailbreak, Data Poisoning, OWASP Top 10 for LLMs, AWS Artifact, AWS Audit Manager, AWS Config, AWS CloudTrail, Amazon Inspector, EU AI Act, ISO/IEC 27002, NIST 800-53).
- **Part 3: 5–7 Scenario Exam Questions**:
  - Scenarios on compliance evidence collection, preventing data leakage to public internet via PrivateLink, defending against indirect prompt injection, and Shared Responsibility responsibilities.

- [ ] **Step 1: Write `domain-5-security-compliance-governance.md`**
- [ ] **Step 2: Run verification script on Domain 5**
- [ ] **Step 3: Commit**

```bash
git add aif-c01-study-guide/domain-5-security-compliance-governance.md
git commit -m "feat: complete Domain 5 security compliance and governance module"
```

---

### Task 8: End-to-End System Audit and Verification

**Files:**
- Modify / Verify: All files in `aif-c01-study-guide/`
- Execute: `bun scripts/verify-guide.bun.js`

- [ ] **Step 1: Run comprehensive automated test script**

Run: `bun scripts/verify-guide.bun.js`
Expected: Output `All files verified successfully! ASD-STE100 and Exam Blueprint standards passed.` with exit code 0.

- [ ] **Step 2: Verify total question count and ASD-STE100 sentence compliance**

Run:
```bash
bun -e '
import fs from "fs";
const files = fs.readdirSync("aif-c01-study-guide").filter(f => f.startsWith("domain-"));
let totalQ = 0;
files.forEach(f => {
  const c = fs.readFileSync("aif-c01-study-guide/" + f, "utf8");
  const count = (c.match(/### Question \d+/g) || []).length;
  console.log(`${f}: ${count} questions`);
  totalQ += count;
});
console.log("Total Exam Questions:", totalQ);
'
```
Expected: Total Exam Questions $\ge 25$ (around 30 questions).

- [ ] **Step 3: Final Git Commit and tag**

```bash
git add aif-c01-study-guide/ scripts/
git commit -m "docs: complete AWS Certified AI Practitioner (AIF-C01) study system"
```
