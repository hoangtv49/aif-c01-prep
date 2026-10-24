# AWS Certified AI Practitioner (AIF-C01) - Comprehensive Study & Exam Prep System

> Tài liệu hệ thống hóa toàn bộ kiến thức kỳ thi chứng chỉ **AWS Certified AI Practitioner (AIF-C01)**. Được tổng hợp từ lộ trình *"Get AIF-C01 Certified - Roadmap To Success"* (Vladimir Raykov, 119 trang) và ánh xạ chuẩn xác vào 5 Domain chính thức của AWS.

---

## 1. Thông tin cấu trúc kỳ thi AIF-C01

| Thông số | Chi tiết |
| :--- | :--- |
| **Mã bài thi** | AIF-C01 (AWS Certified AI Practitioner) |
| **Cấp độ** | Foundational (Nhập môn AI/ML trên AWS) |
| **Số lượng câu hỏi** | 65 câu (trắc nghiệm 1 đáp án hoặc chọn nhiều đáp án) |
| **Thời gian làm bài** | 85 phút (thêm 30 phút ESL nếu đăng ký trước bài thi) |
| **Thang điểm** | 100 – 1000 điểm (Điểm qua: **700/1000**) |
| **Đối tượng** | Kỹ sư, Product Manager, Data/AI Enthusiast, Solutions Architect muốn chuẩn hóa kiến thức AI/ML và GenAI trên AWS. |

---

## 2. Bản đồ 5 Domain bài thi & Liên kết tài liệu

| Domain | Trọng số | Nội dung chính | File tài liệu ôn tập |
| :--- | :---: | :--- | :--- |
| **Domain 1** | **20%** | **Fundamentals of AI and ML**<br>Khái niệm AI/ML/DL, ML Lifecycle, Learning Types, AWS Core AI Managed Services, SageMaker Core. | [domain-1-fundamentals-ai-ml.md](./domain-1-fundamentals-ai-ml.md) (10 câu hỏi) |
| **Domain 2** | **24%** | **Fundamentals of Generative AI**<br>Bản chất GenAI, Transformer Architecture, RAG vs Fine-Tuning, Lựa chọn Foundation Models, Rủi ro GenAI. | [domain-2-generative-ai.md](./domain-2-generative-ai.md) (10 câu hỏi) |
| **Domain 3** | **28%** | **Applications of Foundation Models**<br>Amazon Bedrock (Knowledge Bases, Agents, Guardrails), Amazon Q, PartyRock, Prompt Engineering, Đánh giá FMs. | [domain-3-fm-applications.md](./domain-3-fm-applications.md) (11 câu hỏi) |
| **Domain 4** | **14%** | **Guidelines for Responsible AI**<br>6 Trụ cột Responsible AI, Bias & Fairness, Model Transparency, SageMaker Clarify, AWS AI Service Cards. | [domain-4-responsible-ai.md](./domain-4-responsible-ai.md) (10 câu hỏi) |
| **Domain 5** | **14%** | **Security, Compliance, and Governance for AI**<br>Shared Responsibility Model, Bảo mật dữ liệu & VPC, OWASP Top 10 for LLMs, AWS Artifact, Audit Manager, Config. | [domain-5-security-compliance-governance.md](./domain-5-security-compliance-governance.md) (11 câu hỏi) |

---

## 3. Global Service Decision Matrix (Bảng tra cứu quyết định dịch vụ AWS)

Gặp từ khóa tình huống trong đề thi $\rightarrow$ Chọn ngay dịch vụ AWS tương ứng:

| Yêu cầu tình huống trong đề thi | Dịch vụ AWS chính xác | Dịch vụ bẫy (Không chọn) |
| :--- | :--- | :--- |
| Cần gọi Foundation Models (Claude, Llama, Titan) qua **unified API**, **không quản lý hạ tầng máy chủ/GPU** | **Amazon Bedrock** | SageMaker JumpStart (cần cấu hình EC2 instance endpoint) |
| Cần toàn quyền kiểm soát hạ tầng mạng VPC, tự triển khai endpoint chuyên biệt, fine-tuning sâu | **Amazon SageMaker (JumpStart)** | Bedrock (không can thiệp vào máy chủ bên dưới) |
| Chatbot doanh nghiệp tra cứu tài liệu nội bộ (Jira, Confluence, S3) có phân quyền danh tính | **Amazon Q Business** | Amazon Lex (thiết kế luồng hội thoại theo slot/intent) |
| Trợ lý AI hỗ trợ viết code, giải thích code và chuyển đổi ngôn ngữ trong IDE | **Amazon Q Developer** (CodeWhisperer cũ) | Amazon Bedrock (phải tự viết app kết nối) |
| Tích hợp tài liệu doanh nghiệp vào LLM **không cần train lại mô hình**, giảm hallucination | **RAG / Bedrock Knowledge Bases** | Fine-Tuning (tốn kém, dễ bị catastrophic forgetting) |
| Trích xuất văn bản từ hóa đơn, hợp đồng, giữ nguyên cấu trúc **bảng biểu (tables & forms)** | **Amazon Textract** | Amazon Rekognition (nhận diện vật thể trong ảnh) |
| Nhận diện khuôn mặt, kiểm duyệt hình ảnh nhạy cảm (moderation), gắn nhãn đồ vật | **Amazon Rekognition** | Amazon Textract (chỉ trích xuất chữ) |
| Phân tích cảm xúc khách hàng (sentiment), trích xuất thực thể (entities, PII) từ văn bản có sẵn | **Amazon Comprehend** | Amazon Translate (chỉ dịch thuật) |
| Chuyển đổi văn bản thành giọng nói tự nhiên (Text-to-Speech) | **Amazon Polly** | Amazon Transcribe (Speech-to-Text) |
| Ghi âm cuộc gọi tổng đài chuyển thành văn bản (Speech-to-Text) | **Amazon Transcribe** | Amazon Polly (Text-to-Speech) |
| Xây dựng chatbot theo kịch bản quy chuẩn (Intent, Utterance, Slot) kết hợp giọng nói/tin nhắn | **Amazon Lex** | Amazon Bedrock Agents (tự lập kế hoạch multi-step) |
| Tự động hóa tác vụ nhiều bước (multi-step tasks), tự động gọi API hệ thống qua Open API schema | **Amazon Bedrock Agents** | AWS Step Functions (phải lập trình luồng thủ công) |
| Gợi ý sản phẩm cá nhân hóa theo thời gian thực (Personalized recommendations) | **Amazon Personalize** | Amazon Forecast (dự báo chuỗi thời gian) |
| Dự báo nhu cầu tồn kho tương lai kết hợp dữ liệu lịch sử và biến số ngoại cảnh (Thời tiết, Lễ hội) | **Amazon Forecast** | Amazon Personalize (gợi ý người dùng) |
| Tự động phát hiện giao dịch trực tuyến gian lận, thẻ tín dụng bị đánh cắp | **Amazon Fraud Detector** | Amazon Inspector (quét lỗ hổng hệ điều hành) |
| Khám phá, phân loại và bảo vệ dữ liệu nhạy cảm PII lưu trữ trong Amazon S3 | **Amazon Macie** | Amazon Bedrock Guardrails (lọc lúc suy luận) |
| Quy trình đưa con người vào đánh giá các dự đoán ML có độ tin cậy thấp (Human-in-the-Loop) | **Amazon Augmented AI (A2I)** | Amazon CloudWatch Alarms (chỉ kích hoạt số liệu) |
| Tài liệu quản trị ghi nhận mục đích, tham số và kết quả đánh giá cho Custom Models tự tạo | **SageMaker Model Cards** | AWS AI Service Cards (chỉ cho dịch vụ của AWS) |
| Phát hiện thiên kiến (bias) trong bộ dữ liệu huấn luyện và giải thích thuộc tính mô hình (SHAP) | **Amazon SageMaker Clarify** | Amazon Inspector (chỉ quét lỗ hổng bảo mật hạ tầng) |
| Kiểm soát an toàn nội dung GenAI, lọc từ cấm, chặn prompt injection, che giấu thông tin PII | **Amazon Bedrock Guardrails** | AWS WAF (chặn traffic mạng lớp 7 thông thường) |
| Bảo vệ endpoint API khỏi DDoS layer 7, rate limiting chặn bot làm cạn kiệt Bedrock tokens | **AWS WAF** | Bedrock Guardrails (chỉ kiểm tra nội dung text) |
| Tải báo cáo kiểm toán tuân thủ của bên thứ 3 (SOC reports, ISO certifications) của AWS | **AWS Artifact** | AWS Audit Manager (tự động thu thập chứng cứ) |
| Tự động thu thập chứng cứ kỹ thuật để phục vụ kiểm toán tuân thủ quy định | **AWS Audit Manager** | AWS Artifact (chỉ là kho tải tài liệu tĩnh) |
| Theo dõi lịch sử thay đổi cấu hình tài nguyên AWS và phát hiện sai lệch tuân thủ | **AWS Config** | AWS CloudTrail (ghi log gọi API của người dùng) |
| Ghi lại toàn bộ lịch sử API calls trong tài khoản để phục vụ truy vết điều tra | **AWS CloudTrail** | AWS CloudWatch (giám sát metrics hiệu năng và log ứng dụng) |

---

## 4. Top 10 Bẫy thi cử thường gặp nhất (High-Frequency Exam Traps)

1. **Bedrock vs SageMaker JumpStart**:
   - *Bẫy:* Cả hai đều cung cấp Pre-trained Foundation Models.
   - *Cách phân biệt:* Bedrock là **Serverless / Managed API** (không quản lý máy chủ). JumpStart yêu cầu **Deploy lên ML Instance** (bạn chọn loại máy chủ ml.g5...).
2. **Kendra vs Bedrock Knowledge Bases**:
   - *Bẫy:* Cả hai đều tìm kiếm tài liệu doanh nghiệp.
   - *Cách phân biệt:* **Amazon Kendra** là công cụ tìm kiếm thông minh chuyên dụng (intelligent search engine). **Bedrock Knowledge Bases** là giải pháp RAG tích hợp sẵn vector embeddings và kết nối thẳng với LLM để trả lời câu hỏi tổng hợp.
3. **Fine-Tuning vs RAG**:
   - *Bẫy:* Muốn mô hình cập nhật kiến thức mới của doanh nghiệp hàng ngày.
   - *Cách phân biệt:* **RAG** dùng cho dữ liệu thay đổi thường xuyên, kiến thức mới, cần nguồn trích dẫn minh bạch. **Fine-Tuning** dùng khi cần dạy mô hình phong cách diễn đạt mới (style/tone) hoặc tuân thủ định dạng đặc biệt (specialized syntax), KHÔNG dùng fine-tuning chỉ để nạp kiến thức mới liên tục.
4. **Comprehend vs Bedrock cho NLP**:
   - *Bẫy:* Phân tích sentiment đánh giá của khách hàng.
   - *Cách phân biệt:* Nếu tác vụ chuẩn (Sentiment, Entity detection, Language detection) $\rightarrow$ Dùng **Amazon Comprehend** (rẻ hơn, chuyên dụng, không lo ảo giác). Chỉ dùng LLM (Bedrock) khi cần suy luận phức tạp hoặc sinh nội dung mới.
5. **Bedrock Agents vs Bedrock Guardrails**:
   - *Bẫy:* Bảo vệ an toàn và tương tác hệ thống.
   - *Cách phân biệt:* **Agents** phụ trách **Action/Execution** (gọi API, tra cứu dữ liệu, hoàn thành tác vụ). **Guardrails** phụ trách **Safety/Policy** (chặn từ tục tĩu, che PII, phát hiện ảo giác).
6. **BLEU vs ROUGE**:
   - *Bẫy:* Chọn thang đo tự động cho tác vụ LLM.
   - *Cách phân biệt:* **BLEU** đo độ chính xác (Precision) $\rightarrow$ Ưu tiên cho **Machine Translation**. **ROUGE** đo độ bao phủ/thu hồi (Recall) $\rightarrow$ Ưu tiên cho **Text Summarization**.
7. **AWS Artifact vs AWS Audit Manager**:
   - *Bẫy:* Chứng chỉ tuân thủ bảo mật.
   - *Cách phân biệt:* Tải báo cáo kiểm toán có sẵn của AWS (SOC 2, PCI DSS) $\rightarrow$ **AWS Artifact**. Tự động gom bằng chứng cấu hình thực tế trong hệ thống của bạn để gửi kiểm toán viên $\rightarrow$ **AWS Audit Manager**.
8. **Direct Prompt Injection vs Indirect Prompt Injection**:
   - *Bẫy:* Tấn công vào ứng dụng LLM.
   - *Cách phân biệt:* **Direct (Jailbreak)** là người dùng nhập trực tiếp câu lệnh cố tình phá vỡ rào cản hệ thống. **Indirect** là kẻ tấn công giấu payload độc hại vào tài liệu bên ngoài (website, PDF, email) mà mô hình đọc vào khi thực hiện RAG hoặc web browsing.
9. **SageMaker Clarify vs AWS AI Service Cards**:
   - *Bẫy:* Minh bạch và đạo đức AI.
   - *Cách phân biệt:* **Clarify** là công cụ kỹ thuật tính toán chỉ số bias và SHAP values trên mô hình/dữ liệu của bạn. **AI Service Cards** là tài liệu do chính AWS công bố, mô tả mục đích sử dụng, hạn chế và nguyên tắc thiết kế có trách nhiệm của các dịch vụ do AWS quản lý.
10. **Data Privacy trong Amazon Bedrock**:
    - *Bẫy:* Câu hỏi về việc dữ liệu của khách hàng có bị dùng để huấn luyện mô hình cơ sở không.
    - *Quy tắc tuyệt đối của AWS:* Mặc định dữ liệu của khách hàng (prompts, completions, custom training data) **KHÔNG BAO GIỜ** được sử dụng để huấn luyện lại các mô hình nền tảng của AWS hay bên thứ ba, và không được chia sẻ với bất kỳ ai.

---

## 5. Chiến lược ôn thi hiệu quả
1. Đọc tuần tự từ **Domain 1** đến **Domain 5**.
2. Với mỗi Domain:
   - Nắm chắc bản đồ tư duy và bảng so sánh dịch vụ ở **Phần 1**.
   - Ôn tập kỹ các định nghĩa ngắn gọn chuẩn **ASD-STE100** ở **Phần 2** để quen với từ khóa tiếng Anh trong đề thi.
   - Tự làm và đọc kỹ phần phân tích đáp án sai ở **Phần 3**.
3. Đạt điểm tuyệt đối ở các câu hỏi lý thuyết của Domain 4 & 5 (Responsible AI & Security) vì đây là các câu hỏi tình huống có quy tắc rõ ràng nhất.
