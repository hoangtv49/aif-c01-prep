import fs from "fs";
import path from "path";
import { marked } from "marked";

const BASE_DIR = path.resolve("aif-c01-study-guide");

function cleanMath(text) {
  if (!text) return "";
  return text
    .replace(/\$\s*\\rightarrow\s*\$/g, " &rarr; ")
    .replace(/\$\s*\\to\s*\$/g, " &rarr; ")
    .replace(/\\rightarrow/g, " &rarr; ")
    .replace(/\\to\b/g, " &rarr; ")
    .replace(/\$\\le\s*(\d+)\$/g, " &le; $1 ")
    .replace(/\$([^\$]+)\$/g, (m, expr) => {
      let cleaned = expr
        .replace(/\\text\{([^}]+)\}/g, "$1")
        .replace(/\\rightarrow/g, " &rarr; ")
        .replace(/\\to\b/g, " &rarr; ")
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)");
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
          term: cleanMath(parts[1].replace(/\*\*/g, "")),
          definition: cleanMath(parts[2]),
          keywords: cleanMath(parts[3]),
          note: cleanMath(parts[4])
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
      stem: cleanMath(stemLines.join(" ")),
      options: optionLines.map(opt => {
        const key = opt.slice(0, 1);
        const text = cleanMath(opt.slice(3).trim());
        return { key, text };
      }),
      correctAnswer: cleanMath(correctAnswer),
      reason: cleanMath(reason),
      distractor: cleanMath(distractor),
      trap: cleanMath(trap)
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
        scenario: cleanMath(parts[1]),
        service: cleanMath(parts[2].replace(/\*\*/g, "")),
        trap: cleanMath(parts[3])
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
    // --- ROW 1: SECURITY, STORAGE & NETWORK (y: 40) ---
    { id: "macie", label: "Amazon Macie", domain: 5, group: "security", x: 120, y: 40, desc: "Tự động khám phá, phân loại và bảo vệ dữ liệu nhạy cảm PII lưu trữ trong Amazon S3 data lakes.", docSubtab: "p2", docKeyword: "Amazon Macie", docTitle: "Phần 2: Thuật ngữ Amazon Macie" },
    { id: "s3", label: "Amazon S3 Data Lake", domain: 5, group: "storage", x: 340, y: 40, desc: "Kho lưu trữ đối tượng chứa tài liệu Knowledge Bases, dữ liệu huấn luyện ML, và audit logs.", docSubtab: "p1", docKeyword: "Bảo mật dữ liệu", docTitle: "Phần 1: Bảo mật dữ liệu & S3" },
    { id: "privatelink", label: "AWS PrivateLink (VPC Endpoints)", domain: 5, group: "security", x: 580, y: 40, desc: "Kết nối mạng riêng tư an toàn, đảm bảo lưu lượng gọi API Bedrock không bao giờ đi qua Internet công cộng.", docSubtab: "p1", docKeyword: "PrivateLink", docTitle: "Phần 1: AWS PrivateLink & VPC" },
    { id: "kms", label: "AWS KMS Encryption", domain: 5, group: "security", x: 820, y: 40, desc: "Mã hóa dữ liệu lưu trữ (Encryption at Rest) bằng Customer Managed Keys (CMKs) cho S3, Bedrock, EBS.", docSubtab: "p1", docKeyword: "KMS", docTitle: "Phần 1: Mã hóa AWS KMS" },
    { id: "waf", label: "AWS WAF", domain: 5, group: "security", x: 1040, y: 40, desc: "Tường lửa ứng dụng web lớp 7 bảo vệ AI endpoints khỏi DDoS và chặn bot làm cạn kiệt Bedrock tokens.", docSubtab: "p3", docKeyword: "WAF", docTitle: "Phần 3: Câu hỏi tình huống AWS WAF" },

    // --- ROW 2: RAG, BEDROCK & AUTOMATION (y: 130 - 160) ---
    { id: "rag", label: "RAG Architecture", domain: 2, group: "rag", x: 110, y: 140, desc: "Truy xuất thông tin thực tế từ bên ngoài đưa vào prompt, giúp LLM cập nhật tri thức mới mà không cần train lại.", docSubtab: "p1", docKeyword: "RAG", docTitle: "Phần 1: Kiến trúc RAG" },
    { id: "knowledge_bases", label: "Bedrock Knowledge Bases", domain: 3, group: "rag", x: 340, y: 140, desc: "Giải pháp RAG hoàn chỉnh tự động chunking, tạo vector embedding và truy xuất tài liệu từ S3.", docSubtab: "p1", docKeyword: "Knowledge Bases", docTitle: "Phần 1: Bedrock Knowledge Bases" },
    { id: "bedrock", label: "Amazon Bedrock", domain: 3, group: "platform", x: 580, y: 155, desc: "Dịch vụ Serverless cung cấp quyền truy cập các Foundation Models hàng đầu (Claude, Llama, Titan) qua 1 API duy nhất.", docSubtab: "p1", docKeyword: "Amazon Bedrock", docTitle: "Phần 1: Nền tảng Amazon Bedrock" },
    { id: "bedrock_agents", label: "Bedrock Agents", domain: 3, group: "automation", x: 820, y: 140, desc: "Tác tử tự hành phân tích yêu cầu nhiều bước (ReAct), tự động lập kế hoạch và gọi API doanh nghiệp.", docSubtab: "p1", docKeyword: "Bedrock Agents", docTitle: "Phần 1: Bedrock Agents" },
    { id: "openapi", label: "OpenAPI Schema", domain: 3, group: "automation", x: 1050, y: 115, desc: "Định dạng JSON/YAML chuẩn hóa mô tả API để Bedrock Action Groups hiểu tham số và thực thi.", docSubtab: "p1", docKeyword: "OpenAPI", docTitle: "Phần 1: OpenAPI Schema" },

    // --- ROW 3: VECTOR DB, PARAMS, TRANSFORMERS, TUNING & LAMBDA (y: 220 - 250) ---
    { id: "vector_db", label: "Vector DB (OpenSearch)", domain: 2, group: "rag", x: 110, y: 230, desc: "Lưu trữ vector embeddings nhiều chiều, hỗ trợ tìm kiếm ngữ nghĩa tương đồng (Semantic Search) tốc độ cao.", docSubtab: "p1", docKeyword: "Vector", docTitle: "Phần 1: Vector Database" },
    { id: "inference_params", label: "Inference Params (Temp/Top-P)", domain: 2, group: "genai_foundations", x: 340, y: 230, desc: "Siêu tham số suy luận: Temperature, Top-P, Top-K điều khiển mức độ ngẫu nhiên vs xác định của LLM.", docSubtab: "p1", docKeyword: "Temperature", docTitle: "Phần 1: Siêu tham số suy luận" },
    { id: "transformer", label: "Transformer (Self-Attention)", domain: 2, group: "genai_foundations", x: 580, y: 230, desc: "Kiến trúc mạng nơ-ron xử lý song song với cơ chế Self-Attention; xương sống cốt lõi của các LLMs như Claude, Llama, Titan.", docSubtab: "p1", docKeyword: "Transformer", docTitle: "Phần 1: Kiến trúc Transformer" },
    { id: "fine_tuning", label: "PEFT / LoRA Fine-Tuning", domain: 3, group: "customization", x: 820, y: 230, desc: "Tinh chỉnh tham số mô hình hiệu quả; bắt buộc dùng Provisioned Throughput khi suy luận trên Bedrock.", docSubtab: "p1", docKeyword: "LoRA", docTitle: "Phần 1: PEFT / LoRA Fine-Tuning" },
    { id: "lambda", label: "AWS Lambda", domain: 3, group: "automation", x: 1050, y: 185, desc: "Thực thi mã serverless chạy nghiệp vụ API khi được Bedrock Agents kích hoạt.", docSubtab: "p1", docKeyword: "Lambda", docTitle: "Phần 1: AWS Lambda trong Agents" },
    { id: "rlhf", label: "RLHF Alignment", domain: 3, group: "customization", x: 1050, y: 255, desc: "Học tăng cường từ phản hồi con người, sử dụng reward model để căn chỉnh mô hình hữu ích và an toàn.", docSubtab: "p1", docKeyword: "RLHF", docTitle: "Phần 1: Căn chỉnh mô hình RLHF" },

    // --- ROW 4: SAFETY, DIFFUSION & EVALUATION (y: 310 - 330) ---
    { id: "prompt_injection", label: "Prompt Injection Defense", domain: 5, group: "safety", x: 110, y: 330, desc: "Phòng thủ lỗ hổng OWASP LLM01: Chặn Direct Jailbreaks và Indirect Prompt Poisoning từ tài liệu RAG.", docSubtab: "p1", docKeyword: "Prompt Injection", docTitle: "Phần 1: OWASP Prompt Injection" },
    { id: "diffusion", label: "Diffusion Models", domain: 2, group: "genai_foundations", x: 340, y: 320, desc: "Mô hình sinh ảnh dựa trên quá trình thêm nhiễu và học cách khử nhiễu ngược (Stable Diffusion, Titan Image).", docSubtab: "p1", docKeyword: "Diffusion", docTitle: "Phần 1: Diffusion Models" },
    { id: "bedrock_guardrails", label: "Bedrock Guardrails", domain: 4, group: "safety", x: 580, y: 315, desc: "Hàng rào an toàn cho LLM: Lọc nội dung độc hại, che giấu PII, chặn chủ đề cấm và phát hiện ảo giác.", docSubtab: "p1", docKeyword: "Bedrock Guardrails", docTitle: "Phần 1: Bedrock Guardrails" },
    { id: "model_eval", label: "Bedrock Model Evaluation", domain: 3, group: "evaluation", x: 820, y: 320, desc: "Đánh giá và so sánh chất lượng mô hình bằng benchmark tự động hoặc đánh giá có sự tham gia của con người.", docSubtab: "p1", docKeyword: "Model Evaluation", docTitle: "Phần 1: Đánh giá mô hình FM" },
    { id: "eval_metrics", label: "BLEU vs ROUGE Metrics", domain: 3, group: "evaluation", x: 1050, y: 330, desc: "BLEU đo độ chuẩn xác (Precision) cho Dịch máy; ROUGE đo độ bao phủ (Recall) cho Tóm tắt văn bản.", docSubtab: "p1", docKeyword: "BLEU", docTitle: "Phần 1: BLEU & ROUGE Metrics" },

    // --- ROW 5: GUARDRAIL FILTERS & ENTERPRISE CHAT/SEARCH (y: 410 - 430) ---
    { id: "pii_redaction", label: "PII Masking & Redaction", domain: 4, group: "safety", x: 120, y: 420, desc: "Tự động phát hiện và che giấu (mask) số thẻ tín dụng, CCCD/CMND, email trong prompt và output.", docSubtab: "p1", docKeyword: "PII Redaction", docTitle: "Phần 1: PII Masking & Redaction" },
    { id: "denied_topics", label: "Denied Topics Policy", domain: 4, group: "safety", x: 350, y: 420, desc: "Định nghĩa quy tắc bằng ngôn ngữ tự nhiên cấm mô hình thảo luận các chủ đề nhạy cảm hoặc ngoài phạm vi.", docSubtab: "p1", docKeyword: "Denied Topics", docTitle: "Phần 1: Denied Topics Policy" },
    { id: "grounding_check", label: "Contextual Grounding", domain: 4, group: "safety", x: 580, y: 410, desc: "Kiểm tra mức độ bám sát tài liệu nguồn RAG (Grounding score) để phát hiện và ngăn chặn ảo giác.", docSubtab: "p1", docKeyword: "Contextual Grounding", docTitle: "Phần 1: Contextual Grounding Check" },
    { id: "q_business", label: "Amazon Q Business", domain: 3, group: "enterprise", x: 820, y: 420, desc: "Trợ lý hội thoại doanh nghiệp kết nối hơn 40 kho dữ liệu nội bộ và tự động kế thừa phân quyền ACLs người dùng.", docSubtab: "p1", docKeyword: "Q Business", docTitle: "Phần 1: Amazon Q Business" },
    { id: "q_developer", label: "Amazon Q Developer", domain: 3, group: "enterprise", x: 1050, y: 420, desc: "Trợ lý lập trình AI hỗ trợ viết code, quét lỗ hổng bảo mật và tự động nâng cấp mã nguồn trong IDE.", docSubtab: "p1", docKeyword: "Q Developer", docTitle: "Phần 1: Amazon Q Developer" },

    // --- ROW 6: ML DATA PREP, JUMPSTART & AUDIT (y: 510 - 530) ---
    { id: "data_wrangler", label: "SageMaker Data Wrangler", domain: 1, group: "ml", x: 120, y: 520, desc: "Công cụ trực quan chuẩn bị dữ liệu với hơn 300 phép biến đổi tích hợp cho bảng và hình ảnh.", docSubtab: "p1", docKeyword: "Data Wrangler", docTitle: "Phần 1: SageMaker Data Wrangler" },
    { id: "feature_store", label: "SageMaker Feature Store", domain: 1, group: "ml", x: 350, y: 520, desc: "Kho lưu trữ tập trung quản lý và tái sử dụng các đặc trưng (features) cho cả real-time inference và batch training.", docSubtab: "p1", docKeyword: "Feature Store", docTitle: "Phần 1: SageMaker Feature Store" },
    { id: "jumpstart", label: "SageMaker JumpStart", domain: 1, group: "ml", x: 580, y: 510, desc: "Thư viện mô hình pre-trained nguồn mở triển khai trên máy chủ EC2 ML chuyên dụng nằm trọn trong VPC khách hàng.", docSubtab: "p1", docKeyword: "JumpStart", docTitle: "Phần 1: SageMaker JumpStart" },
    { id: "kendra", label: "Amazon Kendra", domain: 3, group: "search", x: 820, y: 510, desc: "Công cụ tìm kiếm thông minh cho doanh nghiệp, trả về đoạn trích tài liệu chính xác nhất kèm liên kết nguồn gốc.", docSubtab: "p1", docKeyword: "Kendra", docTitle: "Phần 1: Amazon Kendra" },
    { id: "audit_manager", label: "AWS Audit Manager", domain: 5, group: "compliance", x: 1050, y: 510, desc: "Tự động thu thập bằng chứng kỹ thuật liên tục trong tài khoản AWS để phục vụ kiểm toán các khung tuân thủ AI.", docSubtab: "p1", docKeyword: "Audit Manager", docTitle: "Phần 1: AWS Audit Manager" },

    // --- ROW 7: SAGEMAKER CORE, AUTOPILOT & COMPLIANCE (y: 610 - 630) ---
    { id: "ground_truth", label: "SageMaker Ground Truth", domain: 1, group: "ml", x: 120, y: 620, desc: "Dịch vụ gán nhãn dữ liệu chất lượng cao kết hợp học chủ động (active learning) và lực lượng lao động con người.", docSubtab: "p1", docKeyword: "Ground Truth", docTitle: "Phần 1: SageMaker Ground Truth" },
    { id: "sagemaker", label: "Amazon SageMaker AI", domain: 1, group: "ml", x: 350, y: 620, desc: "Nền tảng MLOps toàn diện để chuẩn bị dữ liệu, xây dựng, huấn luyện, tối ưu và triển khai các mô hình học máy.", docSubtab: "p1", docKeyword: "SageMaker", docTitle: "Phần 1: Amazon SageMaker AI" },
    { id: "autopilot", label: "SageMaker Autopilot", domain: 1, group: "ml", x: 580, y: 610, desc: "Nền tảng AutoML tự động khám phá dữ liệu, lựa chọn thuật toán tối ưu và tinh chỉnh siêu tham số.", docSubtab: "p1", docKeyword: "Autopilot", docTitle: "Phần 1: SageMaker Autopilot" },
    { id: "config", label: "AWS Config", domain: 5, group: "compliance", x: 820, y: 610, desc: "Theo dõi lịch sử thay đổi cấu hình tài nguyên và cảnh báo sai lệch tuân thủ so với các quy tắc đặt ra.", docSubtab: "p1", docKeyword: "Config", docTitle: "Phần 1: AWS Config" },
    { id: "artifact", label: "AWS Artifact", domain: 5, group: "compliance", x: 1050, y: 600, desc: "Cổng thông tin tự phục vụ cho phép tải về các báo cáo kiểm toán tuân thủ (SOC 2, ISO, PCI DSS) của AWS.", docSubtab: "p1", docKeyword: "Artifact", docTitle: "Phần 1: AWS Artifact" },

    // --- ROW 8: MODEL REGISTRY, CLARIFY, A2I & MODEL CARDS (y: 700 - 720) ---
    { id: "model_registry", label: "SageMaker Model Registry", domain: 1, group: "ml", x: 130, y: 710, desc: "Quản lý phiên bản mô hình, phê duyệt và theo dõi metadata nguồn gốc trước khi triển khai lên Production.", docSubtab: "p1", docKeyword: "Model Registry", docTitle: "Phần 1: SageMaker Model Registry" },
    { id: "clarify", label: "SageMaker Clarify", domain: 4, group: "responsible", x: 360, y: 720, desc: "Đo lường thiên kiến trước/sau huấn luyện (DPPL, Disparate Impact) và giải thích quyết định bằng SHAP.", docSubtab: "p1", docKeyword: "Clarify", docTitle: "Phần 1: SageMaker Clarify" },
    { id: "a2i", label: "Amazon Augmented AI (A2I)", domain: 4, group: "responsible", x: 590, y: 710, desc: "Quy trình Human-in-the-Loop đưa con người vào đánh giá lại các dự đoán ML có độ tin cậy thấp.", docSubtab: "p1", docKeyword: "Augmented AI", docTitle: "Phần 1: Amazon Augmented AI (A2I)" },
    { id: "model_cards", label: "SageMaker Model Cards", domain: 4, group: "governance", x: 820, y: 710, desc: "Tài liệu quản trị chuẩn mực lưu trữ thông tin huấn luyện, tham số và kết quả đánh giá cho Custom Models.", docSubtab: "p1", docKeyword: "Model Cards", docTitle: "Phần 1: SageMaker Model Cards" },
    { id: "service_cards", label: "AWS AI Service Cards", domain: 4, group: "governance", x: 1050, y: 700, desc: "Tài liệu minh bạch do AWS công bố nêu rõ mục đích sử dụng, hạn chế kỹ thuật và nguyên tắc thiết kế dịch vụ AI.", docSubtab: "p1", docKeyword: "Service Cards", docTitle: "Phần 1: AWS AI Service Cards" },
    { id: "cloudtrail", label: "AWS CloudTrail", domain: 5, group: "compliance", x: 1050, y: 770, desc: "Ghi log toàn bộ lịch sử các lệnh gọi API trong tài khoản phục vụ truy vết điều tra an ninh.", docSubtab: "p1", docKeyword: "CloudTrail", docTitle: "Phần 1: AWS CloudTrail" },

    // --- ROW 9: BIAS METRICS & SHAP EXPLAINABILITY (y: 810) ---
    { id: "bias_detection", label: "Bias Metrics (DPPL / Impact)", domain: 4, group: "responsible", x: 230, y: 810, desc: "Lượng hóa sự mất cân bằng nhãn trước huấn luyện (DPPL) và tỷ lệ chấp thuận chênh lệch sau huấn luyện (Disparate Impact).", docSubtab: "p1", docKeyword: "DPPL", docTitle: "Phần 1: Pre/Post-training Bias" },
    { id: "shap", label: "SHAP Explainability", domain: 4, group: "responsible", x: 490, y: 810, desc: "Giải thích cục bộ (từng dự đoán) và toàn cục (toàn bộ mô hình) thông qua giá trị phân bổ đặc trưng SHAP.", docSubtab: "p1", docKeyword: "SHAP", docTitle: "Phần 1: SHAP Explainability" },

    // --- ROW 10: AWS CORE MANAGED AI SERVICES (y: 910) ---
    { id: "rekognition", label: "Amazon Rekognition", domain: 1, group: "core_ai", x: 110, y: 910, desc: "Computer Vision: Nhận diện vật thể, khuôn mặt, chữ trong ảnh và kiểm duyệt nội dung nhạy cảm.", docSubtab: "p1", docKeyword: "Rekognition", docTitle: "Phần 1: Amazon Rekognition" },
    { id: "textract", label: "Amazon Textract", domain: 1, group: "core_ai", x: 310, y: 910, desc: "OCR thông minh trích xuất văn bản có cấu trúc, bảng biểu (tables) và biểu mẫu (forms) từ tài liệu scan.", docSubtab: "p1", docKeyword: "Textract", docTitle: "Phần 1: Amazon Textract" },
    { id: "comprehend", label: "Amazon Comprehend", domain: 1, group: "core_ai", x: 510, y: 910, desc: "Xử lý ngôn ngữ tự nhiên (NLP): Phân tích cảm xúc (sentiment), trích xuất thực thể và phát hiện thông tin PII.", docSubtab: "p1", docKeyword: "Comprehend", docTitle: "Phần 1: Amazon Comprehend" },
    { id: "translate", label: "Amazon Translate", domain: 1, group: "core_ai", x: 710, y: 910, desc: "Dịch thuật máy móc thần kinh (Neural Machine Translation) đa ngôn ngữ chất lượng cao theo thời gian thực.", docSubtab: "p1", docKeyword: "Translate", docTitle: "Phần 1: Amazon Translate" },
    { id: "transcribe", label: "Amazon Transcribe", domain: 1, group: "core_ai", x: 910, y: 910, desc: "Chuyển giọng nói thành văn bản (Speech-to-Text), phân biệt người nói (diarization) và phân tích cuộc gọi.", docSubtab: "p1", docKeyword: "Transcribe", docTitle: "Phần 1: Amazon Transcribe" },
    { id: "polly", label: "Amazon Polly", domain: 1, group: "core_ai", x: 1090, y: 910, desc: "Chuyển văn bản thành giọng nói tự nhiên (Text-to-Speech) với giọng đọc sống động hỗ trợ SSML.", docSubtab: "p1", docKeyword: "Polly", docTitle: "Phần 1: Amazon Polly" },

    // --- ROW 11: SPECIALIZED AI MANAGED SERVICES (y: 1010) ---
    { id: "lex", label: "Amazon Lex", domain: 1, group: "specialized_ai", x: 180, y: 1010, desc: "Xây dựng giao diện đàm thoại (Chatbot & Voicebot) theo kịch bản quy chuẩn dựa trên Intents, Utterances và Slots.", docSubtab: "p1", docKeyword: "Lex", docTitle: "Phần 1: Amazon Lex" },
    { id: "personalize", label: "Amazon Personalize", domain: 1, group: "specialized_ai", x: 460, y: 1010, desc: "Công cụ gợi ý cá nhân hóa (recommendations) theo thời gian thực dựa trên lịch sử tương tác người dùng.", docSubtab: "p1", docKeyword: "Personalize", docTitle: "Phần 1: Amazon Personalize" },
    { id: "forecast", label: "Amazon Forecast", domain: 1, group: "specialized_ai", x: 740, y: 1010, desc: "Dự báo chuỗi thời gian (time-series forecasting) kết hợp dữ liệu quá khứ và biến số ngoại cảnh (thời tiết, ngày lễ).", docSubtab: "p1", docKeyword: "Forecast", docTitle: "Phần 1: Amazon Forecast" },
    { id: "fraud_detector", label: "Amazon Fraud Detector", domain: 1, group: "specialized_ai", x: 1020, y: 1010, desc: "Tự động phát hiện các giao dịch gian lận trực tuyến và tính điểm rủi ro tài khoản giả mạo.", docSubtab: "p1", docKeyword: "Fraud Detector", docTitle: "Phần 1: Amazon Fraud Detector" }
  ],
  edges: [
    // Bedrock Core & Integrations
    { from: "bedrock", to: "knowledge_bases", label: "RAG Knowledge Base" },
    { from: "bedrock", to: "bedrock_agents", label: "Action Orchestration" },
    { from: "bedrock", to: "bedrock_guardrails", label: "Safety & Policy Filter" },
    { from: "bedrock", to: "model_eval", label: "Benchmark Evaluation" },
    { from: "bedrock", to: "fine_tuning", label: "Custom Models (Provisioned)" },
    { from: "bedrock", to: "inference_params", label: "Temperature & Top-P Sampling" },
    { from: "bedrock", to: "transformer", label: "Powered by Transformer LLMs" },
    { from: "bedrock", to: "jumpstart", label: "Serverless API vs Dedicated EC2" },

    // Transformers & Foundations
    { from: "transformer", to: "fine_tuning", label: "Adapts Low-Rank Weights" },
    { from: "transformer", to: "diffusion", label: "Text Generation vs Image Diffusion" },

    // RAG Pipeline
    { from: "knowledge_bases", to: "rag", label: "Implements Managed RAG" },
    { from: "knowledge_bases", to: "vector_db", label: "Semantic Vector Search" },
    { from: "knowledge_bases", to: "s3", label: "Ingests S3 Documents" },

    // Bedrock Agents & Automation
    { from: "bedrock_agents", to: "openapi", label: "Defines Action Schema" },
    { from: "bedrock_agents", to: "lambda", label: "Executes Business Logic" },
    { from: "fine_tuning", to: "rlhf", label: "Human Alignment Tuning" },

    // Evaluation
    { from: "model_eval", to: "eval_metrics", label: "Automated Benchmark Scores" },
    { from: "eval_metrics", to: "translate", label: "BLEU for Translation" },

    // Safety & Guardrails
    { from: "bedrock_guardrails", to: "pii_redaction", label: "Masks Sensitive PII" },
    { from: "bedrock_guardrails", to: "denied_topics", label: "Blocks Restricted Topics" },
    { from: "bedrock_guardrails", to: "grounding_check", label: "Detects Hallucinations" },
    { from: "bedrock_guardrails", to: "prompt_injection", label: "Blocks Prompt Attacks" },
    { from: "prompt_injection", to: "rag", label: "Indirect Injection via Docs" },

    // Security & Data
    { from: "kms", to: "s3", label: "Server-side Encryption (CMK)" },
    { from: "kms", to: "bedrock", label: "Encrypts Custom Models & Data" },
    { from: "privatelink", to: "bedrock", label: "Private VPC Traffic (No Internet)" },
    { from: "waf", to: "bedrock", label: "Protects Endpoints & Rate Limits" },
    { from: "macie", to: "s3", label: "Scans S3 PII Data Lake" },
    { from: "macie", to: "pii_redaction", label: "Data Lake vs Inference PII" },

    // SageMaker MLOps Lifecycle
    { from: "sagemaker", to: "data_wrangler", label: "Visual Data Preparation" },
    { from: "sagemaker", to: "feature_store", label: "Feature Repository" },
    { from: "sagemaker", to: "ground_truth", label: "Data Labeling Workflows" },
    { from: "sagemaker", to: "autopilot", label: "AutoML Model Selection" },
    { from: "sagemaker", to: "jumpstart", label: "Model Hub (Dedicated EC2)" },
    { from: "sagemaker", to: "model_registry", label: "Model Versioning & Approval" },
    { from: "sagemaker", to: "clarify", label: "Evaluates Bias & Explainability" },

    // Clarify & Explainability
    { from: "clarify", to: "bias_detection", label: "Computes DPPL Metrics" },
    { from: "clarify", to: "shap", label: "Computes SHAP Values" },
    { from: "sagemaker", to: "model_cards", label: "Custom Model Documentation" },
    { from: "model_cards", to: "service_cards", label: "Contrast with AWS AI Cards" },

    // Responsible AI & Human Review
    { from: "a2i", to: "rekognition", label: "Human Review for Low Confidence" },
    { from: "a2i", to: "textract", label: "Human Review for Complex Forms" },
    { from: "a2i", to: "model_eval", label: "Human-in-the-Loop Benchmarking" },

    // Governance & Compliance
    { from: "audit_manager", to: "artifact", label: "Active Evidence vs Static SOC Reports" },
    { from: "config", to: "cloudtrail", label: "Config Drift vs API Audit Logs" },

    // Enterprise Assistants & Search
    { from: "kendra", to: "q_business", label: "Search Index vs GenAI Chatbot" },
    { from: "q_business", to: "q_developer", label: "Business Assistant vs Coding Assistant" },

    // Core AI Pipelines
    { from: "transcribe", to: "comprehend", label: "Audio -> Text -> Sentiment" },
    { from: "transcribe", to: "polly", label: "Speech-to-Text & Text-to-Speech" },

    // Specialized AI & Comparisons
    { from: "lex", to: "bedrock_agents", label: "Intent/Slot Bot vs Autonomous Agent" },
    { from: "personalize", to: "forecast", label: "User Recommendations vs Demand Forecast" },
    { from: "fraud_detector", to: "comprehend", label: "Fraud Scoring & Identity Security" },
    { from: "diffusion", to: "bedrock", label: "Image Gen (Titan Image / SD)" }
  ]
};

const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
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
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.85rem 1.5rem;
      flex-wrap: wrap;
    }
    .brand {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      min-width: 0;
      flex-shrink: 0;
    }
    .brand-heading {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
    }
    .brand-badge {
      background: linear-gradient(135deg, #00a4e4, #6366f1);
      color: #fff;
      font-weight: 800;
      font-size: 0.78rem;
      line-height: 1;
      padding: 0.35rem 0.6rem;
      border-radius: 5px;
      letter-spacing: 0.05em;
      white-space: nowrap;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 164, 228, 0.25);
    }
    .brand-title {
      font-size: 1.25rem;
      font-weight: 700;
      line-height: 1.2;
      letter-spacing: -0.02em;
      color: #fff;
      white-space: nowrap;
      margin: 0;
      display: inline-flex;
      align-items: center;
    }
    .brand-subtitle {
      font-size: 0.8rem;
      color: var(--text-muted);
      line-height: 1.35;
      white-space: nowrap;
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

    /* Quiz Header Toolbar & Controls */
    .quiz-controls-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      background: var(--bg-panel);
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      border: 1px solid var(--border);
    }
    .quiz-action-group {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex-wrap: wrap;
    }

    /* Smart Scroll-Aware Sticky Bar */
    .smart-sticky-bar {
      position: sticky;
      top: var(--header-height, 96px);
      z-index: 25;
      background: rgba(13, 21, 34, 0.95);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 0.55rem 0.85rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      will-change: transform;
    }
    .smart-sticky-bar.bar-hidden {
      transform: translateY(-130%);
      pointer-events: none;
      opacity: 0;
    }

    /* Inner Layout of Quiz Sticky Bar */
    .quiz-sticky-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .quiz-filters {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      flex-wrap: wrap;
    }
    .quiz-sticky-right {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex: 1 1 320px;
      max-width: 480px;
    }

    /* Search Input Box with Icon & Clear */
    .search-input-box {
      position: relative;
      display: flex;
      align-items: center;
      flex: 1 1 0%;
      min-width: 0;
      width: auto;
    }
    .search-input-box .search-icon {
      position: absolute;
      left: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-dim);
      pointer-events: none;
      z-index: 2;
    }
    .search-box.sticky-search {
      width: 100%;
      min-width: 0;
      height: 38px;
      padding: 0.45rem 2rem 0.45rem 2.2rem;
      background: #111a2e;
      border: 1px solid #243047;
      border-radius: 8px;
      color: #fff;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }
    .search-box.sticky-search:focus {
      border-color: #38bdf8;
      background: #152238;
      box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
      outline: none;
    }
    .search-clear-btn {
      position: absolute;
      right: 0.5rem;
      background: rgba(255, 255, 255, 0.12);
      border: none;
      color: #cbd5e1;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 2;
    }
    .search-clear-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
    .palette-quick-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      padding: 0.45rem 0.75rem;
      height: 38px;
      background: #162032;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: #38bdf8;
      font-family: var(--font-sans);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
      flex: 0 0 auto;
    }
    .palette-quick-btn:hover {
      background: #1e293b;
      border-color: #38bdf8;
      color: #fff;
    }
    .palette-btn-icon {
      font-size: 0.95rem;
      line-height: 1;
    }
    .palette-btn-text {
      display: inline;
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
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .exp-body strong {
      color: #f8fafc;
      font-weight: 600;
    }
    .exp-body em {
      color: #e2e8f0;
      font-style: italic;
    }
    .exp-bullet {
      position: relative;
      padding-left: 1.25rem;
      margin-bottom: 0.5rem;
      line-height: 1.6;
      word-break: break-word;
      overflow-wrap: break-word;
    }
    .exp-bullet::before {
      content: "•";
      position: absolute;
      left: 0.15rem;
      top: 0;
      color: var(--primary);
      font-weight: 700;
      font-size: 1.15rem;
      line-height: 1.5;
    }
    .exp-bullet-text {
      display: inline;
      word-break: break-word;
      overflow-wrap: break-word;
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
      height: 760px;
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
      pointer-events: all;
    }
    .node-group:hover .node-rect {
      stroke: #38bdf8 !important;
      stroke-width: 2.5px !important;
      fill: #1c2b44 !important;
    }
    .node-group:hover .node-text {
      fill: #ffffff !important;
      font-weight: 700 !important;
    }
    .node-group.selected .node-rect {
      stroke: #00a4e4 !important;
      stroke-width: 3.5px !important;
      fill: #1e3a5f !important;
    }
    .node-group.selected .node-text {
      fill: #ffffff !important;
      font-weight: 700 !important;
    }
    .node-rect {
      rx: 8;
      stroke-width: 1.5;
      cursor: pointer;
      pointer-events: all;
      transition: stroke 0.15s ease, fill 0.15s ease;
    }
    .node-text {
      font-family: var(--font-sans);
      font-size: 11px;
      font-weight: 600;
      fill: #f8fafc;
      pointer-events: none;
      text-anchor: middle;
    }

    /* Inspector Floating Drawer for Graph */
    .graph-inspector {
      position: fixed;
      right: 2rem;
      top: 110px;
      width: 400px;
      max-width: calc(100vw - 4rem);
      max-height: calc(100vh - 150px);
      overflow-y: auto;
      background: rgba(13, 21, 37, 0.97);
      border: 1.5px solid #00a4e4;
      border-radius: 14px;
      padding: 1.4rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 164, 228, 0.25);
      display: none;
      z-index: 999;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .graph-inspector.open {
      display: block;
    }
    .inspector-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.6rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }
    .inspector-title { font-size: 1.15rem; font-weight: 700; color: #fff; margin-bottom: 0; line-height: 1.3; flex: 1 1 auto; }
    .inspect-doc-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.28rem 0.6rem;
      background: rgba(0, 164, 228, 0.15);
      border: 1px solid rgba(0, 164, 228, 0.45);
      border-radius: 7px;
      color: #38bdf8;
      font-family: var(--font-sans);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .inspect-doc-btn:hover {
      background: #00a4e4;
      border-color: #00a4e4;
      color: #ffffff;
      box-shadow: 0 0 14px rgba(0, 164, 228, 0.5);
      transform: translateY(-1px);
    }
    .inspect-doc-btn svg {
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }
    .inspect-doc-btn:hover svg {
      transform: translate(1px, -1px);
    }
    .inspect-doc-callout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(14, 165, 233, 0.08);
      border: 1px solid rgba(14, 165, 233, 0.25);
      border-radius: 8px;
      padding: 0.45rem 0.75rem;
      margin-bottom: 0.85rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .inspect-doc-callout:hover {
      background: rgba(14, 165, 233, 0.2);
      border-color: #38bdf8;
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
      transform: translateY(-1px);
    }
    .inspector-desc { font-size: 0.875rem; color: #cbd5e1; line-height: 1.5; margin-bottom: 0.75rem; }
    .inspector-links-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #38bdf8; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
    .inspector-links { list-style: none; font-size: 0.825rem; color: #94a3b8; }
    .inspector-links li { margin-bottom: 0.35rem; }

    /* Target Element Pulse Highlight when navigated from Graph */
    @keyframes targetGlowPulse {
      0% {
        box-shadow: 0 0 0 0 rgba(0, 164, 228, 0.7);
        outline: 2px solid #00a4e4;
        background-color: rgba(0, 164, 228, 0.25);
      }
      50% {
        box-shadow: 0 0 25px 8px rgba(0, 164, 228, 0.6);
        outline: 2.5px solid #38bdf8;
        background-color: rgba(0, 164, 228, 0.35);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 164, 228, 0);
        outline: 2px solid transparent;
        background-color: transparent;
      }
    }
    .doc-target-highlight {
      animation: targetGlowPulse 2.8s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
      border-radius: 8px !important;
      outline-offset: 3px !important;
      transition: all 0.3s ease;
    }
    .matrix-table tr.doc-target-highlight td {
      background-color: rgba(0, 164, 228, 0.25) !important;
      color: #ffffff !important;
    }

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

    :root {
      --header-height: 96px;
    }

    /* Sub-tabs for Topic Study */
    .topic-subtab-bar {
      display: flex;
      gap: 0.5rem;
      background: rgba(13, 21, 34, 0.98);
      padding: 0.4rem;
      border-radius: 10px;
      border: 1px solid var(--border);
      margin-bottom: 2rem;
      overflow-x: auto;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      position: sticky;
      top: var(--header-height, 96px);
      z-index: 30;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
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

    .subtab-text-short {
      display: none;
    }
    .subtab-text-full {
      display: inline;
    }

    /* Table & Search Header Bars */
    .table-header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .search-header-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .search-header-group .search-box {
      width: 320px;
    }
    .search-count-badge {
      font-size: 0.8rem;
      padding: 0.45rem 0.75rem;
      background: #162032;
      border: 1px solid var(--border);
      border-radius: 9999px;
      color: #38bdf8;
      font-family: var(--font-mono);
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Desktop Responsive Header & Layout */
    @media (min-width: 769px) and (max-width: 1200px) {
      .header-inner {
        padding: 0.75rem 1.25rem;
        gap: 0.75rem 1rem;
      }
      .brand-title {
        font-size: 1.15rem;
      }
      .brand-badge {
        font-size: 0.76rem;
        padding: 0.3rem 0.55rem;
      }
      .tab-btn {
        padding: 0.45rem 0.75rem;
        font-size: 0.825rem;
        gap: 0.35rem;
      }
    }

    /* Comprehensive Mobile Responsive Styles */
    @media (max-width: 768px) {
      .header-inner {
        padding: 0.65rem 1rem;
        gap: 0.5rem;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
      .brand {
        justify-content: flex-start;
      }
      .brand-heading {
        gap: 0.5rem;
      }
      .brand-title {
        font-size: 0.95rem;
        line-height: 1.2;
      }
      .brand-badge {
        font-size: 0.72rem;
        padding: 0.22rem 0.5rem;
      }
      .brand-subtitle {
        display: none; /* Ẩn phụ đề trên mobile để header siêu gọn gàng */
      }
      .nav-tabs {
        display: none !important; /* Ẩn hoàn toàn nav bar desktop trên mobile vì đã có Bottom Nav Bar */
      }
      .stats-pill {
        width: auto;
        padding: 0.3rem 0.65rem;
        font-size: 0.725rem;
        gap: 0.5rem;
      }
      .main-content {
        padding: 1rem 0.85rem 5.5rem; /* Tăng padding dưới để không bị thanh đáy che nội dung */
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
      .subtab-text-full {
        display: none;
      }
      .subtab-text-short {
        display: inline;
      }
      .topic-subtab-bar {
        display: grid !important;
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.45rem !important;
        overflow-x: visible !important;
        white-space: normal !important;
        position: sticky;
        top: var(--header-height, 42px) !important;
        margin-top: 0.35rem;
        margin-bottom: 1.25rem;
        padding: 0.45rem;
        border: 1px solid #2a3a54 !important;
        border-radius: 12px !important;
        background: rgba(13, 21, 34, 0.98);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      }
      .topic-subtab-btn {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.35rem;
        padding: 0.6rem 0.4rem;
        font-size: 0.775rem;
        font-weight: 600;
        white-space: nowrap;
        text-align: center;
        border-radius: 8px;
        background: #111a2e;
        border: 1px solid #1e293b;
        color: var(--text-muted);
        transition: all 0.2s ease;
      }
      .topic-subtab-btn.active {
        background: #1e293b;
        border-color: #38bdf8 !important;
        color: #fff !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      }
      .table-header-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 0.85rem;
        margin-bottom: 1.25rem;
      }
      .search-header-group {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .search-header-group .search-box {
        width: 100% !important;
        flex: 1 1 auto;
        min-width: 0;
      }
      .search-count-badge {
        font-size: 0.75rem;
        padding: 0.35rem 0.6rem;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .topic-section-card {
        padding: 1.25rem 0.85rem;
        margin-bottom: 1.5rem;
      }
      .topic-sec-title {
        font-size: 1.1rem;
        flex-wrap: wrap;
      }
      .quiz-controls-bar {
        flex-direction: column;
        align-items: stretch;
        padding: 0.75rem;
        gap: 0.65rem;
        margin-bottom: 0.85rem;
      }
      .quiz-action-group {
        width: 100%;
        display: flex;
        gap: 0.45rem;
      }
      .quiz-action-group .action-btn {
        flex: 1 1 0;
        min-width: 0;
        padding: 0.48rem 0.35rem;
        font-size: 0.75rem;
        justify-content: center;
        text-align: center;
        white-space: nowrap;
      }
      .smart-sticky-bar {
        top: var(--header-height, 42px) !important;
        padding: 0.45rem 0.6rem !important;
        margin-bottom: 1rem;
        border-radius: 10px;
        box-sizing: border-box;
        max-width: 100%;
        overflow: hidden;
      }
      .quiz-sticky-inner {
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        align-items: stretch;
        justify-content: flex-start;
      }
      .quiz-sticky-right {
        order: 1;
        flex: 0 0 auto;
        max-width: none;
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.45rem;
      }
      .quiz-sticky-right .search-input-box {
        flex: 1 1 0%;
        min-width: 0;
        width: auto !important;
      }
      .palette-quick-btn {
        width: 38px;
        height: 38px;
        padding: 0;
        flex: 0 0 38px;
        justify-content: center;
        border-radius: 8px;
      }
      .palette-btn-text {
        display: none !important;
      }
      .palette-btn-icon {
        font-size: 1.05rem;
      }
      .quiz-filters {
        order: 2;
        flex: 0 0 auto;
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        flex-wrap: nowrap;
        padding-bottom: 0.25rem;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .ste-filters {
        width: 100%;
        overflow-x: auto;
        white-space: nowrap;
        flex-wrap: nowrap;
        padding-bottom: 0.25rem;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }
      .quiz-filters::-webkit-scrollbar, .ste-filters::-webkit-scrollbar { display: none; }
      .search-box.sticky-search {
        height: 38px;
        font-size: 0.825rem;
        width: 100% !important;
        min-width: 0;
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
        padding: 0.9rem 0.75rem !important;
        border-radius: 8px !important;
      }
      .exp-title {
        font-size: 0.775rem !important;
        gap: 0.35rem !important;
        margin-bottom: 0.35rem !important;
        line-height: 1.4 !important;
      }
      .exp-body {
        font-size: 0.825rem !important;
        line-height: 1.55 !important;
      }
      .exp-bullet {
        padding-left: 1.15rem !important;
        margin-bottom: 0.45rem !important;
        line-height: 1.55 !important;
      }
      .exp-bullet::before {
        left: 0.1rem !important;
        font-size: 1.05rem !important;
      }
      .graph-svg-wrapper {
        height: 520px;
      }
      .graph-inspector {
        position: fixed !important;
        left: 0.75rem !important;
        right: 0.75rem !important;
        bottom: 68px !important; /* Above the 60px bottom nav bar */
        top: auto !important; /* Resets desktop top: 110px */
        width: auto !important;
        max-width: none !important;
        max-height: 40vh !important; /* Only takes 40% of screen so the graph remains visible above */
        overflow-y: auto !important;
        background: rgba(13, 21, 37, 0.98) !important;
        border: 1.5px solid #00a4e4 !important;
        border-radius: 16px !important;
        padding: 0.85rem 1rem !important;
        box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(0, 164, 228, 0.25) !important;
        z-index: 1000 !important;
      }
      .inspector-title-row {
        gap: 0.4rem !important;
        margin-bottom: 0.35rem !important;
      }
      .inspector-title {
        font-size: 1.05rem !important;
        margin-bottom: 0 !important;
      }
      .inspect-doc-btn {
        padding: 0.22rem 0.5rem !important;
        font-size: 0.72rem !important;
      }
      .inspect-doc-callout {
        padding: 0.35rem 0.6rem !important;
        margin-bottom: 0.55rem !important;
      }
      .inspector-desc {
        font-size: 0.8rem !important;
        line-height: 1.45 !important;
        margin-bottom: 0.5rem !important;
      }
      .inspector-links-title {
        font-size: 0.72rem !important;
        margin-bottom: 0.35rem !important;
      }
      .inspector-links {
        font-size: 0.775rem !important;
      }
      .inspector-links li {
        margin-bottom: 0.25rem !important;
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
        <div class="brand-heading">
          <span class="brand-badge">AIF-C01</span>
          <span class="brand-title">AWS AI Practitioner Mastery Studio</span>
        </div>
        <div class="brand-subtitle">Hệ thống hóa 57 Đề thi • 82 Thuật ngữ cốt lõi • Bản đồ liên kết động</div>
      </div>

      <nav class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('topics')">📚 Ôn tập theo chủ đề</button>
        <button class="tab-btn" onclick="switchTab('quiz')">📝 Luyện đề 57 Câu</button>
        <button class="tab-btn" onclick="switchTab('graph')">🧭 Bản đồ Khái niệm</button>
        <button class="tab-btn" onclick="switchTab('matrix')">⚡ Bảng Quyết định & Bẫy</button>
        <button class="tab-btn" onclick="switchTab('ste')">📖 Từ điển thuật ngữ</button>
      </nav>

      <!-- Exam Live Progress Pill (Only shown when practicing Quiz) -->
      <div class="stats-pill" id="header-stats-pill" style="display: none;">
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
          <span>📖</span>
          <span class="subtab-text-full">Phần 1: Lý thuyết & Decision Trees</span>
          <span class="subtab-text-short">Phần 1: Lý thuyết</span>
        </button>
        <button id="subtab-p2" class="topic-subtab-btn" onclick="switchTopicSubtab('p2')">
          <span>📘</span>
          <span class="subtab-text-full">Phần 2: Bảng thuật ngữ</span>
          <span class="subtab-text-short">Phần 2: Thuật ngữ</span>
        </button>
        <button id="subtab-p3" class="topic-subtab-btn" onclick="switchTopicSubtab('p3')">
          <span>🎯</span>
          <span class="subtab-text-full">Phần 3: Câu hỏi tình huống</span>
          <span class="subtab-text-short">Phần 3: Câu hỏi</span>
        </button>
        <button id="subtab-all" class="topic-subtab-btn" onclick="switchTopicSubtab('all')">
          <span>📑</span>
          <span class="subtab-text-full">Xem toàn bộ</span>
          <span class="subtab-text-short">Xem toàn bộ</span>
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
            <div class="legend-item"><div class="legend-dot" style="background: #00a4e4;"></div><span>Platform (Bedrock)</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #10b981;"></div><span>RAG & Vector Search</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #06b6d4;"></div><span>Core AI (Vision, OCR, NLP)</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #f97316;"></div><span>Specialized AI (Lex, Recs, Forecast)</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #3b82f6;"></div><span>SageMaker MLOps</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #f59e0b;"></div><span>Safety & Guardrails</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #6366f1;"></div><span>Responsible AI & A2I</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #ef4444;"></div><span>Security (KMS, VPC, Macie)</span></div>
            <div class="legend-item"><div class="legend-dot" style="background: #ec4899;"></div><span>Governance & Compliance</span></div>
          </div>
        </div>

        <div class="graph-svg-wrapper">
          <svg id="concept-svg" viewBox="0 0 1200 1080">
            <defs>
              <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#00a4e4" />
                <stop offset="100%" stop-color="#6366f1" />
              </linearGradient>
            </defs>
            <g id="svg-edges"></g>
            <g id="svg-nodes"></g>
          </svg>

        </div>

        <!-- Node Inspector Floating Panel -->
        <div id="graph-inspector" class="graph-inspector">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <span id="inspect-domain" class="q-domain-tag">Domain 3</span>
            <button onclick="closeInspector()" style="background:rgba(255,255,255,0.08); border:none; color:#cbd5e1; cursor:pointer; width:28px; height:28px; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:1.1rem; transition:background 0.2s ease;">✕</button>
          </div>
          <div class="inspector-title-row">
            <h3 id="inspect-title" class="inspector-title">Amazon Bedrock</h3>
            <button id="inspect-doc-btn" class="inspect-doc-btn" onclick="goToTopicFromInspector()" title="Mở mục này trong Ôn tập theo chủ đề">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Xem tài liệu</span>
            </button>
          </div>
          <div id="inspect-desc" class="inspector-desc">Mô tả</div>
          <div id="inspect-doc-callout" class="inspect-doc-callout" onclick="goToTopicFromInspector()" title="Bấm để chuyển tới màn Ôn tập theo chủ đề">
            <div style="display:flex; align-items:center; gap:0.5rem; overflow:hidden;">
              <span style="font-size:0.95rem; flex-shrink:0;">📖</span>
              <span id="inspect-doc-text" style="font-size:0.78rem; font-weight:600; color:#38bdf8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Xem trong Ôn tập: Domain 3 • Lý thuyết</span>
            </div>
            <span style="font-size:0.85rem; color:#38bdf8; font-weight:700; flex-shrink:0; margin-left:0.5rem;">&rarr;</span>
          </div>
          <div class="inspector-links-title">Các liên kết thi cốt lõi:</div>
          <ul id="inspect-links" class="inspector-links"></ul>
        </div>
      </div>
    </section>

    <!-- TAB 2: EXAM PRACTICE SIMULATOR -->
    <section id="tab-quiz" class="tab-panel">
      <!-- Quiz Setup Controls (Top of Quiz, scrolls naturally) -->
      <div class="quiz-controls-bar">
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
        <div class="quiz-action-group">
          <button id="shuffle-btn" class="action-btn" onclick="shuffleQuestions()" title="Trộn ngẫu nhiên thứ tự các câu hỏi để thi thử">
            <span>🔀 Trộn đề</span>
          </button>
          <button id="unshuffle-btn" class="action-btn" onclick="unshuffleQuestions()" style="display:none;" title="Khôi phục thứ tự chuẩn theo từng Domain">
            <span>↩️ Thứ tự gốc</span>
          </button>
          <button class="action-btn" onclick="resetQuiz()" title="Xóa các đáp án đã chọn để làm lại">
            <span>🔄 Làm lại bài thi</span>
          </button>
        </div>
      </div>

      <!-- Smart Sticky Search & Domain Filters Bar -->
      <div id="quiz-sticky-bar" class="smart-sticky-bar">
        <div class="quiz-sticky-inner">
          <div class="filter-group quiz-filters">
            <button class="filter-chip active" onclick="filterDomain('all')">Tất cả (57)</button>
            <button class="filter-chip" onclick="filterDomain(1)">D1: ML Basics (11)</button>
            <button class="filter-chip" onclick="filterDomain(2)">D2: GenAI FMs (11)</button>
            <button class="filter-chip" onclick="filterDomain(3)">D3: Applications (12)</button>
            <button class="filter-chip" onclick="filterDomain(4)">D4: Responsible AI (11)</button>
            <button class="filter-chip" onclick="filterDomain(5)">D5: Security (12)</button>
          </div>
          <div class="quiz-sticky-right">
            <div class="search-input-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="quiz-search" class="search-box sticky-search" placeholder="Tìm câu hỏi, từ khóa, dịch vụ..." oninput="handleSearch(this.value)">
              <button id="quiz-search-clear" class="search-clear-btn" onclick="clearQuizSearch()" style="display:none;" title="Xóa tìm kiếm">✕</button>
            </div>
            <button id="toggle-palette-btn" class="palette-quick-btn" onclick="togglePalette()" title="Mở bảng 57 câu hỏi để nhảy nhanh">
              <span class="palette-btn-icon">🔢</span>
              <span class="palette-btn-text">Bảng câu hỏi</span>
            </button>
          </div>
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
        <div class="matrix-title-header" style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Bảng Tra Cứu Quyết Định Dịch Vụ Nhanh (Decision Matrix)</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Gặp từ khóa tình huống trong đề thi &rarr; Nhận diện ngay dịch vụ AWS chính xác và né các phương án gây nhiễu.</p>
        </div>

        <div id="matrix-sticky-bar" class="smart-sticky-bar">
          <div class="search-header-group">
            <div class="search-input-box" style="flex:1;">
              <span class="search-icon">🔍</span>
              <input type="text" id="matrix-search" class="search-box sticky-search" placeholder="Tìm tình huống, dịch vụ AWS, bẫy..." oninput="handleMatrixSearch(this.value)">
              <button id="matrix-search-clear" class="search-clear-btn" onclick="clearMatrixSearch()" style="display:none;" title="Xóa tìm kiếm">✕</button>
            </div>
            <span id="matrix-count" class="search-count-badge">25/25 kết quả</span>
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
        <div class="ste-title-header" style="margin-bottom: 1rem;">
          <h2 style="font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.35rem;">Bộ Từ Điển Thuật Ngữ Cốt Lõi</h2>
          <p style="font-size: 0.85rem; color: var(--text-muted);">82 định nghĩa tiếng Anh kỹ thuật đơn giản (&le; 25 từ/câu, thể chủ động, một ý/câu) kèm từ khóa đề thi và chú giải tiếng Việt.</p>
        </div>

        <div id="ste-sticky-bar" class="smart-sticky-bar">
          <div class="search-header-group">
            <div class="search-input-box" style="flex:1;">
              <span class="search-icon">🔍</span>
              <input type="text" id="ste-search" class="search-box sticky-search" placeholder="Tìm thuật ngữ, định nghĩa, từ khóa..." oninput="handleSTESearch(this.value)">
              <button id="ste-search-clear" class="search-clear-btn" onclick="clearSTESearch()" style="display:none;" title="Xóa tìm kiếm">✕</button>
            </div>
            <span id="ste-count" class="search-count-badge">82/82 thuật ngữ</span>
          </div>
          <div class="filter-group ste-filters" style="margin-top: 0.5rem;">
            <button class="filter-chip active ste-filter-chip" onclick="filterSTEDomain('all')">Tất cả (82)</button>
            <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(1)">D1: ML Basics (17)</button>
            <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(2)">D2: GenAI FMs (16)</button>
            <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(3)">D3: Applications (17)</button>
            <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(4)">D4: Responsible AI (16)</button>
            <button class="filter-chip ste-filter-chip" onclick="filterSTEDomain(5)">D5: Security (16)</button>
          </div>
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

    // Sync dynamic header height for sticky elements
    function syncHeaderHeight() {
      const header = document.querySelector('.app-header');
      if (header) {
        document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
      }
    }
    window.addEventListener('resize', syncHeaderHeight);

    // Init App
    window.addEventListener('DOMContentLoaded', () => {
      syncHeaderHeight();
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

      // Only show exam live progress pill when practicing Quiz
      const statsPill = document.getElementById('header-stats-pill');
      if (statsPill) {
        statsPill.style.display = tabId === 'quiz' ? 'flex' : 'none';
      }

      syncHeaderHeight();

      if (tabId === 'topics') {
        setTimeout(updateTopicScrollspy, 60);
      }

      document.querySelectorAll('.smart-sticky-bar').forEach(b => b.classList.remove('bar-hidden'));
      lastScrollY = 0;

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
      setTimeout(updateTopicScrollspy, 60);
    }

    let isScrollspyManual = false;

    function switchTopicSubtab(subId) {
      currentTopicSubtab = subId;
      isScrollspyManual = true;

      // Update active state immediately
      document.querySelectorAll('.topic-subtab-btn').forEach(btn => {
        if (btn.id === 'subtab-' + subId) btn.classList.add('active');
        else btn.classList.remove('active');
      });

      scrollToTopicSubtab(subId);

      setTimeout(() => {
        isScrollspyManual = false;
        updateTopicScrollspy();
      }, 700);
    }

    function scrollToTopicSubtab(subId) {
      const headerEl = document.querySelector('.app-header');
      const subtabsEl = document.getElementById('topic-subtabs');
      const isMobile = window.innerWidth <= 768;
      const headerH = headerEl ? headerEl.offsetHeight : (isMobile ? 40 : 96);
      const subtabsH = subtabsEl ? subtabsEl.offsetHeight : (isMobile ? 68 : 45);
      const totalStickyH = headerH + subtabsH + 12;

      if (subId === 'all') {
        const domainHeader = document.querySelector('.topic-domain-header');
        if (domainHeader) {
          const targetY = domainHeader.getBoundingClientRect().top + window.pageYOffset - (headerH + 15);
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        const el = document.getElementById('topic-sec-' + subId);
        if (el) {
          const targetY = el.getBoundingClientRect().top + window.pageYOffset - totalStickyH;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }
    }

    function updateTopicScrollspy() {
      const topicsTab = document.getElementById('tab-topics');
      if (!topicsTab || !topicsTab.classList.contains('active')) return;
      if (isScrollspyManual) return;

      const headerEl = document.querySelector('.app-header');
      const subtabsEl = document.getElementById('topic-subtabs');
      const isMobile = window.innerWidth <= 768;
      const headerH = headerEl ? headerEl.offsetHeight : (isMobile ? 40 : 96);
      const subtabsH = subtabsEl ? subtabsEl.offsetHeight : (isMobile ? 68 : 45);
      const threshold = headerH + subtabsH + 35;

      const p1 = document.getElementById('topic-sec-p1');
      const p2 = document.getElementById('topic-sec-p2');
      const p3 = document.getElementById('topic-sec-p3');

      if (!p1 || !p2 || !p3) return;

      const rect1 = p1.getBoundingClientRect();
      const rect2 = p2.getBoundingClientRect();
      const rect3 = p3.getBoundingClientRect();

      const isBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60);

      let activeId = 'all';

      if (isBottom || rect3.top <= threshold) {
        activeId = 'p3';
      } else if (rect2.top <= threshold) {
        activeId = 'p2';
      } else if (rect1.top <= threshold) {
        activeId = 'p1';
      } else {
        activeId = 'all';
      }

      document.querySelectorAll('.topic-subtab-btn').forEach(btn => {
        if (btn.id === 'subtab-' + activeId) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
    }

    // Floating Back-to-Top
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    let lastScrollY = window.scrollY;

    function initScrollListener() {
      window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const btn = document.getElementById('back-to-top');
        if (btn) {
          if (currentY > 280) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
        }
        updateTopicScrollspy();
        handleSmartScroll(currentY);
      }, { passive: true });
    }

    function handleSmartScroll(currentY) {
      if (isPaletteOpen) return;
      if (document.activeElement && document.activeElement.classList.contains('search-box')) {
        return;
      }
      const diff = currentY - lastScrollY;
      const stickyBars = document.querySelectorAll('.smart-sticky-bar');

      if (currentY <= 100) {
        stickyBars.forEach(b => b.classList.remove('bar-hidden'));
      } else if (diff > 12) {
        stickyBars.forEach(b => b.classList.add('bar-hidden'));
      } else if (diff < -12) {
        stickyBars.forEach(b => b.classList.remove('bar-hidden'));
      }
      lastScrollY = currentY;
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
      updateTopicScrollspy();
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
        const scenarioFormatted = row.scenario
          .replace(/\\$\\s*\\\\rightarrow\\s*\\$/g, ' &rarr; ')
          .replace(/\\$\\s*\\\\to\\s*\\$/g, ' &rarr; ')
          .replace(/\\\\rightarrow/g, ' &rarr; ')
          .replace(/\\\\to\\b/g, ' &rarr; ');
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
      const clearBtn = document.getElementById('matrix-search-clear');
      if (clearBtn) clearBtn.style.display = val.trim() ? 'flex' : 'none';
      renderDecisionMatrix();
    }

    function clearMatrixSearch() {
      const input = document.getElementById('matrix-search');
      if (input) {
        input.value = '';
        handleMatrixSearch('');
        input.focus();
      }
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
      const clearBtn = document.getElementById('ste-search-clear');
      if (clearBtn) clearBtn.style.display = val.trim() ? 'flex' : 'none';
      renderSTEDictionary();
    }

    function clearSTESearch() {
      const input = document.getElementById('ste-search');
      if (input) {
        input.value = '';
        handleSTESearch('');
        input.focus();
      }
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
      const clearBtn = document.getElementById('quiz-search-clear');
      if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';
      renderQuiz();
    }

    function clearQuizSearch() {
      const input = document.getElementById('quiz-search');
      if (input) {
        input.value = '';
        handleSearch('');
        input.focus();
      }
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
        .replace(/\\$\\s*\\\\rightarrow\\s*\\$/g, ' &rarr; ')
        .replace(/\\$\\s*\\\\to\\s*\\$/g, ' &rarr; ')
        .replace(/\\\\rightarrow/g, ' &rarr; ')
        .replace(/\\\\to\\b/g, ' &rarr; ')
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
        .split('\\n')
        .map(line => {
          const trimmed = line.trim();
          if (!trimmed) return '';
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return \`<div class="exp-bullet"><span class="exp-bullet-text">\${trimmed.substring(2)}</span></div>\`;
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
        specialized_ai: '#f97316',
        enterprise: '#8b5cf6',
        search: '#10b981',
        evaluation: '#eab308',
        customization: '#a855f7',
        genai_foundations: '#d946ef',
        governance: '#a855f7'
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
          <g class="node-group" id="node-\${n.id}" data-id="\${n.id}" transform="translate(\${n.x}, \${n.y})" onclick="selectGraphNode('\${n.id}')">
            <rect class="node-rect" x="\${-width/2}" y="\${-height/2}" width="\${width}" height="\${height}" fill="#162032" stroke="\${color}" />
            <text class="node-text" dy="4">\${n.label}</text>
          </g>
        \`;
      }).join('');

      // Direct SVG Click Delegation
      const svg = document.getElementById('concept-svg');
      if (svg && !svg.hasAttribute('data-bound')) {
        svg.setAttribute('data-bound', 'true');
        svg.addEventListener('click', (e) => {
          const nodeGroup = e.target.closest('.node-group');
          if (nodeGroup) {
            const nodeId = nodeGroup.getAttribute('data-id');
            if (nodeId) selectGraphNode(nodeId);
          }
        });
      }
    }

    let currentInspectedNodeId = null;

    function selectGraphNode(nodeId) {
      const node = GRAPH_DATA.nodes.find(n => n.id === nodeId);
      if (!node) return;
      currentInspectedNodeId = nodeId;

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

      // Highlight active node visually
      document.querySelectorAll('.node-group').forEach(ng => {
        if (ng.getAttribute('data-id') === nodeId || ng.id === 'node-' + nodeId) {
          ng.classList.add('selected');
        } else {
          ng.classList.remove('selected');
        }
      });

      // Show Inspector
      const inspector = document.getElementById('graph-inspector');
      if (inspector) {
        document.getElementById('inspect-domain').textContent = 'Domain ' + node.domain;
        document.getElementById('inspect-title').textContent = node.label;
        document.getElementById('inspect-desc').textContent = node.desc;

        const docBtn = document.getElementById('inspect-doc-btn');
        if (docBtn) {
          docBtn.setAttribute('title', 'Xem chi tiết trong: Domain ' + node.domain + ' • ' + (node.docTitle || 'Tài liệu'));
        }
        const docText = document.getElementById('inspect-doc-text');
        if (docText) {
          docText.textContent = 'Xem trong Ôn tập: Domain ' + node.domain + ' • ' + (node.docTitle || 'Phần 1: Lý thuyết');
        }

        // Find related links
        const relatedEdges = GRAPH_DATA.edges.filter(e => e.from === nodeId || e.to === nodeId);
        const linksUl = document.getElementById('inspect-links');
        if (linksUl) {
          linksUl.innerHTML = relatedEdges.map(e => {
            const otherId = e.from === nodeId ? e.to : e.from;
            const otherNode = GRAPH_DATA.nodes.find(n => n.id === otherId);
            const otherLabel = otherNode ? otherNode.label : otherId;
            return \`<li style="cursor: pointer; padding: 0.25rem 0;" onclick="selectGraphNode('\${otherId}')" title="Nhấp để chuyển tới node này">
              <span style="color:#38bdf8;">🔗 <strong>\${e.label}:</strong></span> <span style="color:#e2e8f0; text-decoration: underline;">\${otherLabel}</span>
            </li>\`;
          }).join('') || '<li style="color:#64748b; font-style:italic;">Không có liên kết trực tiếp</li>';
        }

        inspector.classList.add('open');
        showToast('🧭 ' + node.label);
      }
    }

    function goToTopicFromInspector(nodeId) {
      const id = nodeId || currentInspectedNodeId;
      if (!id) return;
      const node = GRAPH_DATA.nodes.find(n => n.id === id);
      if (!node) return;

      // 1. Switch to Topics tab
      switchTab('topics');

      // 2. Switch to Domain
      switchTopicDomain(node.domain);

      // 3. Switch subtab
      const targetSubtab = node.docSubtab || 'p1';
      switchTopicSubtab(targetSubtab);

      // 4. Close inspector drawer
      closeInspector();

      // 5. Scroll and highlight target element
      setTimeout(() => {
        const keyword = (node.docKeyword || node.label.replace(/\\(.*?\\)/g, '')).trim();
        const found = findDocTargetElement(keyword, targetSubtab);
        if (found) {
          scrollToElementWithStickyOffset(found);
          found.classList.remove('doc-target-highlight');
          void found.offsetWidth; // Force reflow
          found.classList.add('doc-target-highlight');
          setTimeout(() => {
            found.classList.remove('doc-target-highlight');
          }, 3200);
        } else {
          scrollToTopicSubtab(targetSubtab);
        }
        showToast('📖 Đã mở: ' + (node.docTitle || ('Domain ' + node.domain + ' • ' + node.label)));
      }, 180);
    }

    function findDocTargetElement(keyword, subtab) {
      const container = document.getElementById('topic-content-container');
      if (!container) return null;
      const lower = keyword.toLowerCase();

      // If subtab is 'p2', search table rows
      if (subtab === 'p2') {
        const rows = container.querySelectorAll('#topic-sec-p2 tbody tr');
        for (const r of rows) {
          if (r.textContent.toLowerCase().includes(lower)) return r;
        }
      }

      // If subtab is 'p3', search question cards
      if (subtab === 'p3') {
        const cards = container.querySelectorAll('#topic-sec-p3 .q-card');
        for (const c of cards) {
          if (c.textContent.toLowerCase().includes(lower)) return c;
        }
      }

      // If subtab is 'p1', search headings, table rows, strongs, p, li in p1
      const secP1 = document.getElementById('topic-sec-p1');
      if (secP1) {
        // Priority 1: Headings (h2, h3, h4, h5)
        const headings = secP1.querySelectorAll('h2, h3, h4, h5');
        for (const h of headings) {
          if (h.textContent.toLowerCase().includes(lower)) return h;
        }
        // Priority 2: Table rows
        const tableRows = secP1.querySelectorAll('tbody tr');
        for (const tr of tableRows) {
          if (tr.textContent.toLowerCase().includes(lower)) return tr;
        }
        // Priority 3: strong / b
        const strongs = secP1.querySelectorAll('strong, b');
        for (const s of strongs) {
          if (s.textContent.toLowerCase().includes(lower)) {
            return s.closest('li') || s.closest('p') || s;
          }
        }
        // Priority 4: paragraph or list item
        const blocks = secP1.querySelectorAll('p, li');
        for (const b of blocks) {
          if (b.textContent.toLowerCase().includes(lower)) return b;
        }
      }

      // Fallback: search anywhere in container
      const allEls = container.querySelectorAll('h3, h4, tbody tr, strong, p, li');
      for (const el of allEls) {
        if (el.textContent.toLowerCase().includes(lower)) {
          return el.closest('tr') || el.closest('li') || el.closest('p') || el;
        }
      }

      return document.getElementById('topic-sec-' + subtab);
    }

    function scrollToElementWithStickyOffset(targetEl) {
      const headerEl = document.querySelector('.app-header');
      const subtabsEl = document.getElementById('topic-subtabs');
      const isMobile = window.innerWidth <= 768;
      const headerH = headerEl ? headerEl.offsetHeight : (isMobile ? 40 : 96);
      const subtabsH = subtabsEl ? subtabsEl.offsetHeight : (isMobile ? 68 : 45);
      const totalStickyH = headerH + subtabsH + 18;

      const rect = targetEl.getBoundingClientRect();
      const targetY = rect.top + window.pageYOffset - totalStickyH;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }

    function closeInspector() {
      const inspector = document.getElementById('graph-inspector');
      if (inspector) inspector.classList.remove('open');
      document.querySelectorAll('.graph-edge').forEach(e => e.classList.remove('active'));
      document.querySelectorAll('.node-group').forEach(ng => ng.classList.remove('selected'));
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(BASE_DIR, "index.html"), htmlContent);
fs.writeFileSync(path.resolve("index.html"), htmlContent);
console.log("Interactive web application successfully built at:", path.join(BASE_DIR, "index.html"), "and ./index.html");
