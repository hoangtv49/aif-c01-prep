# Design Specification: AWS Certified AI Practitioner (AIF-C01) Study & Knowledge System

## 1. Overview and Intent

This project creates a comprehensive, structured study and revision system for the **AWS Certified AI Practitioner (AIF-C01)** exam. The knowledge base synthesizes the 119-page study guide *"Get AIF-C01 Certified - Roadmap To Success"* by Vladimir Raykov (covering 16 core sections), aligned with the 5 official domains of the AWS AIF-C01 Exam Blueprint.

### Key Goals:
- Deliver high-yield summaries of key exam points.
- Provide standardized terminology tables adhering strictly to **ASD-STE100** (Simplified Technical English) rules.
- Include realistic exam scenario questions with thorough distractor and trap analysis.
- Present explanations in a bilingual format (Vietnamese explanations with English technical terms and pure English STE tables).

---

## 2. Source Material and Domain Mapping

The 16 sections from the source document are mapped into the 5 official AIF-C01 exam domains:

| Official Domain | Weight | Source Sections Covered | Target File |
| :--- | :--- | :--- | :--- |
| **Domain 1: Fundamentals of AI and ML** | 20% | Section 1 (Overview AI/ML/DL)<br>Section 2 (ML Concepts & Workflow)<br>Section 3 (AWS AI Managed Services - Core)<br>Section 4 (SageMaker AI Essentials) | `domain-1-fundamentals-ai-ml.md` |
| **Domain 2: Fundamentals of Generative AI** | 24% | Section 5 (GenAI Core, Models & Lifecycle)<br>Section 6 (Business Applications & Risks)<br>Section 8 (FM Design Considerations & Modalities) | `domain-2-generative-ai.md` |
| **Domain 3: Applications of Foundation Models** | 28% | Section 7 (AWS GenAI Toolkit: Bedrock, Q, PartyRock)<br>Section 9 (Prompt Engineering & Vulnerabilities)<br>Section 10 (Fine-Tuning: Instruction, PEFT/LoRA, RLHF)<br>Section 11 (FM Evaluation: Metrics & Methods) | `domain-3-fm-applications.md` |
| **Domain 4: Guidelines for Responsible AI** | 14% | Section 12 (Responsible AI: Fairness, Bias, Transparency)<br>Section 13 (Explainability, AI Service Cards, Clarify) | `domain-4-responsible-ai.md` |
| **Domain 5: Security, Compliance, and Governance** | 14% | Section 14 (Security Practices, IAM, KMS, VPC, WAF)<br>Section 15 (Data Security, Governance, PII, Guardrails)<br>Section 16 (Compliance: ISO 27002, NIST, EU AI Act, Audit Manager) | `domain-5-security-compliance-governance.md` |

In addition, a root index file `README.md` will serve as the navigation hub, quick lookup decision matrix, and overall exam cheat sheet.

---

## 3. Directory Structure

All files will reside in `/home/hoangtv/Learning/aif-c01-study-guide/`:

```text
/home/hoangtv/Learning/aif-c01-study-guide/
├── README.md
├── domain-1-fundamentals-ai-ml.md
├── domain-2-generative-ai.md
├── domain-3-fm-applications.md
├── domain-4-responsible-ai.md
└── domain-5-security-compliance-governance.md
```

---

## 4. Per-Domain Content Architecture

Each domain file will adhere strictly to a standardized 3-part structure:

### Part 1: Trọng tâm lý thuyết & Decision Matrix (Executive Summary)
- Core architectural concepts and workflows.
- Service comparison tables for confusing pairs (e.g., *Amazon Comprehend* vs *Amazon Bedrock*, *Kendra* vs *Bedrock Knowledge Bases*, *Fine-Tuning* vs *RAG*).
- Logic decision rules: "If the scenario asks for X with constraint Y $\rightarrow$ Choose service Z".

### Part 2: Bảng khái niệm chuẩn ASD-STE100 (Simplified Technical English)
Terminology is formatted into a 4-column Markdown table governed by strict STE rules:
1. **Sentence Length**: Maximum 20 to 25 words per sentence.
2. **One Idea Per Sentence**: Express single, clear statements; eliminate compound clauses.
3. **Active Voice**: Always use active constructions (*"Amazon Bedrock provides..."* instead of *"Foundation models are provided by..."*).
4. **Unambiguous Vocabulary**: Strictly use standardized technical meanings without synonyms or slang.
5. **Columns**:
   - `Term (Thuật ngữ)`: Official AWS or AI/ML terminology.
   - `ASD-STE100 Definition (English)`: Compliant concise definition.
   - `Exam Trigger Keywords (Từ khóa đề thi)`: Trigger words appearing in exam stems.
   - `Chú giải thực tế (Tiếng Việt)`: Pragmatic context, architecture implications, and tips in Vietnamese.

### Part 3: Bộ câu hỏi tình huống & Phân tích đáp án (Exam Scenarios)
Each domain includes 5 to 7 scenario-based questions modeled on actual AIF-C01 exams:
- **Scenario Stem**: Context-rich business/technical problem with explicit constraints (cost, latency, operations).
- **4 Options (A, B, C, D)**.
- **Correct Answer Designation**.
- **Root Cause & Trigger Analysis**: Explains why the selected answer matches specific constraints in the stem.
- **Distractor Analysis**: Detailed explanation for why each incorrect option is invalid.
- **Trap Warning (Cảnh báo bẫy thi cử)**: Highlights common misconceptions or subtle pitfalls.

---

## 5. Master Index (`README.md`) Specifications

The root `README.md` will contain:
1. **AIF-C01 Exam Blueprint Breakdown**: Overview of scoring, question types, and weightings.
2. **Global Service Decision Matrix**: A rapid reference table mapping business requirements to exact AWS services.
3. **High-Frequency Exam Traps**: Summary of top 10 subtle distinctions tested in the exam.
4. **Domain Index Links**: Direct Markdown links to the 5 domain files.

---

## 6. Verification and Acceptance Criteria

1. **Completeness**: All 16 sections of the source PDF are fully represented across the 5 domain files without omitted services.
2. **ASD-STE100 Compliance**: Terminology definitions obey sentence length ($\le 25$ words), active voice, and single-idea rules.
3. **Exam Questions Quality**: A minimum of 5 scenario questions per domain (at least 25 total across the system), all featuring full 4-step distractor breakdowns.
4. **Bilingual Quality**: Professional Vietnamese explanations with accurate English AWS technical terminology.
