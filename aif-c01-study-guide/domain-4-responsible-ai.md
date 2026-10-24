# Domain 4: Guidelines for Responsible AI (14%)

> Module này hệ thống hóa các nguyên tắc xây dựng Trí tuệ nhân tạo có trách nhiệm (Responsible AI), phát hiện và giảm thiểu thiên kiến (Bias), tính minh bạch và khả năng giải thích mô hình (Explainability), cùng các công cụ bảo vệ cốt lõi: Amazon SageMaker Clarify, AWS AI Service Cards và Amazon Bedrock Guardrails (Section 12, 13 trong tài liệu của Vladimir Raykov).

---

## Phần 1: Trọng tâm lý thuyết & Decision Trees

### 1. 6 Trụ cột của Trí tuệ nhân tạo có trách nhiệm (Responsible AI Pillars)

| Trụ cột | Bản chất nguyên tắc | Rủi ro nếu vi phạm | Giải pháp trên AWS |
| :--- | :--- | :--- | :--- |
| **1. Tính công bằng (Fairness)** | Hệ thống AI đối xử bình đẳng với mọi nhóm người, không phân biệt đối xử dựa trên các thuộc tính nhạy cảm (giới tính, tuổi tác, chủng tộc, tôn giáo). | Phân biệt đối xử trong xét duyệt hồ sơ vay vốn hoặc tuyển dụng nhân sự. | **Amazon SageMaker Clarify** (phát hiện và đo lường bias trước và sau huấn luyện). |
| **2. Khả năng giải thích (Explainability)** | Con người có thể hiểu và lý giải được lý do tại sao mô hình đưa ra một dự đoán hoặc quyết định cụ thể. | Mô hình "hộp đen" (Black box) bị cơ quan quản lý phạt vì không thể giải thích lý do từ chối bảo hiểm. | **SageMaker Clarify** (tính toán giá trị SHAP values và mức độ ảnh hưởng của thuộc tính - Feature Attribution). |
| **3. Quyền riêng tư & Bảo mật (Privacy & Security)** | Dữ liệu cá nhân nhạy cảm được bảo vệ nghiêm ngặt, ngăn chặn rò rỉ dữ liệu và chống chịu các cuộc tấn công đối kháng. | Lộ lọt số chứng minh nhân dân, thông tin thẻ tín dụng của khách hàng qua câu trả lời của chatbot. | **Amazon Bedrock Guardrails** (PII masking/redaction), mã hóa dữ liệu với **AWS KMS**. |
| **4. Độ bền vững & An toàn (Robustness & Safety)** | Hệ thống hoạt động chính xác và ổn định trước các dữ liệu bất thường hoặc môi trường thay đổi, không tạo ra hành vi nguy hiểm. | Xe tự hành bị đánh lừa bởi biển báo giao thông bị dán nhãn bẩn. | Kiểm thử đối kháng (Adversarial testing), giám sát liên tục với **SageMaker Model Monitor**. |
| **5. Tính minh bạch (Transparency)** | Cung cấp thông tin rõ ràng về cách thức hoạt động, dữ liệu huấn luyện, mục đích sử dụng và các giới hạn kỹ thuật của hệ thống AI. | Khách hàng nhầm tưởng bot AI là bác sĩ chuyên khoa thật sự. | **AWS AI Service Cards**, ghi nhãn nguồn dữ liệu, thông báo rõ ràng cho người dùng khi họ tương tác với AI. |
| **6. Quản trị & Trách nhiệm (Governance & Accountability)** | Có quy trình tổ chức, phân công trách nhiệm rõ ràng và luôn duy trì sự giám sát của con người trong các quyết định trọng yếu. | Không ai chịu trách nhiệm khi hệ thống AI tự động duyệt giải ngân sai hàng triệu USD. | Cơ chế con người can thiệp (**Human-in-the-loop via Amazon A2I**), kiểm toán tuân thủ với **AWS Audit Manager**. |

---

### 2. Phát hiện và giảm thiểu thiên kiến với Amazon SageMaker Clarify
- **Các nguồn gốc sinh ra Bias trong AI**:
  - *Data Bias / Historical Bias*: Dữ liệu lịch sử chứa đựng định kiến sẵn có của xã hội (ví dụ: tập dữ liệu tuyển dụng quá khứ có 85% nhân sự là nam giới).
  - *Measurement Bias*: Công cụ đo lường hoặc cách gán nhãn dữ liệu bị sai lệch giữa các nhóm người.
- **Vai trò của Amazon SageMaker Clarify**:
  1. **Đo lường Bias trước khi huấn luyện (Pre-training Bias)**: Phân tích tập dữ liệu để phát hiện sự mất cân bằng giữa các nhóm (Class Imbalance, Difference in Positive Proportions in Labels - DPPL).
  2. **Đo lường Bias sau khi huấn luyện (Post-training Bias)**: Kiểm tra xem mô hình có đưa ra tỷ lệ chấp thuận chênh lệch bất công giữa các nhóm nhạy cảm hay không (Disparate Impact).
  3. **Giải thích quyết định mô hình (Model Explainability via SHAP)**:
     - Tính toán giá trị **SHAP (Shapley Additive exPlanations)** để lượng hóa mức độ đóng góp của từng đặc trưng (feature) vào kết quả dự đoán.
     - **Giải thích cục bộ (Local Explainability)**: Giải thích lý do vì sao *một hồ sơ vay vốn cụ thể của anh A* bị từ chối (ví dụ: do tỷ lệ nợ trên thu nhập chiếm 60% quyết định).
     - **Giải thích toàn cục (Global Explainability)**: Đánh giá xem trên *toàn bộ tập dữ liệu*, đặc trưng nào nói chung đóng vai trò quan trọng nhất đến hành vi của mô hình.

---

### 3. Tài liệu minh bạch: AWS AI Service Cards
- **Định nghĩa**: Là tài liệu chính thức do AWS biên soạn và công bố công khai cho từng dịch vụ AI được quản lý (như Amazon Rekognition, Amazon Textract, Amazon Transcribe).
- **Mục đích cốt lõi trong đề thi**: Giúp khách hàng hiểu rõ về việc triển khai AI có trách nhiệm và đưa ra quyết định sáng suốt khi sử dụng dịch vụ của AWS.
- **3 Nội dung chính trong mỗi Service Card**:
  1. **Mục đích sử dụng dự kiến (Intended Use Cases)**: Nêu rõ các bài toán và tình huống nghiệp vụ mà dịch vụ được thiết kế tối ưu nhất.
  2. **Giới hạn kỹ thuật và môi trường (Limitations)**: Cảnh báo các trường hợp dịch vụ có thể hoạt động kém chính xác (ví dụ: ảnh quá mờ, góc chụp nghiêng, điều kiện thiếu sáng hoặc tiếng ồn môi trường quá lớn).
  3. **Nguyên tắc thiết kế có trách nhiệm (Responsible Design Principles)**: Mô tả cách thức AWS áp dụng để giảm thiểu sai lệch, bảo vệ quyền riêng tư và đảm bảo tính công bằng trong quá trình huấn luyện dịch vụ.

---

### 4. Thiết lập hàng rào an toàn với Amazon Bedrock Guardrails

```
User Prompt  ====>  [ Bedrock Guardrails ]  ====>  Foundation Model
                         |
                         +---> 1. Content Filters (Hate speech, insults, violence...)
                         +---> 2. Denied Topics (Custom banned topics)
                         +---> 3. Word Filters (Profanity & custom blocklist)
                         +---> 4. Sensitive Information Filters (PII Mask/Block)
                         +---> 5. Contextual Grounding Check (Detect Hallucinations)
```

- **5 Bộ lọc cốt lõi của Bedrock Guardrails**:
  1. **Content Filters**: Tự động đánh giá và chặn nội dung thuộc 6 nhóm độc hại: *Hate speech (thù địch), Insults (lăng mạ), Sexual (khiêu dâm), Violence (bạo lực), Misconduct (hành vi sai trái)* và *Prompt Attacks (tấn công prompt)*.
  2. **Denied Topics**: Định nghĩa danh sách các chủ đề mà ứng dụng tuyệt đối không được thảo luận (ví dụ: cấm bot ngân hàng đưa ra lời khuyên đầu tư cổ phiếu).
  3. **Word Filters**: Chặn các từ ngữ tục tĩu hoặc danh sách từ khóa cấm tùy chỉnh (ví dụ tên đối thủ cạnh tranh).
  4. **Sensitive Information Filters (PII Redaction)**: Tự động phát hiện và **che giấu (Mask - thay bằng `[NAME]`, `[SSN]`)** hoặc **chặn hoàn toàn (Block)** các thông tin định danh cá nhân như số thẻ ngân hàng, căn cước công dân, email, số điện thoại trong cả prompt đầu vào và phản hồi đầu ra.
  5. **Contextual Grounding Check**: Cơ chế phát hiện ảo giác bằng cách so sánh mức độ tương đồng giữa câu trả lời của mô hình với tài liệu nguồn RAG (Grounding score) và câu hỏi của người dùng (Relevance score).

---

## Phần 2: Bảng khái niệm chuẩn ASD-STE100

| Term (Thuật ngữ) | ASD-STE100 Definition (English) | Exam Trigger Keywords | Chú giải thực tế (Tiếng Việt) |
| :--- | :--- | :--- | :--- |
| **Responsible AI** | Responsible AI is a framework for ethical AI development. It ensures fairness, privacy, safety, and accountability. | Ethical framework, fairness, transparency, accountability, safety. | Khung nguyên tắc đạo đức đảm bảo AI hoạt động công bằng, an toàn và minh bạch. |
| **Fairness** | Fairness ensures AI systems treat all individuals and groups equally. It prevents discrimination based on protected traits. | Equal treatment, prevent discrimination, protected attributes. | Nguyên tắc đảm bảo hệ thống đối xử bình đẳng, không phân biệt chủng tộc, giới tính, tôn giáo. |
| **Algorithmic Bias** | Algorithmic bias occurs when an AI system produces unfair outcomes. It favors one group over another systematically. | Systematic errors, unfair outcomes, favored demographic groups. | Hiện tượng hệ thống AI đưa ra kết quả thiên vị có hệ thống nghiêng về một nhóm đối tượng. |
| **Explainability** | Explainability describes how an AI model makes decisions. It helps humans understand why a specific output occurred. | Understand model logic, feature importance, why prediction occurred. | Khả năng giúp con người hiểu được lý do tại sao mô hình đưa ra một quyết định cụ thể. |
| **Interpretability** | Interpretability measures how easily a human can understand model mechanics. It relies on transparent model structures. | Transparent mechanics, intrinsic understandability, human comprehension. | Mức độ mà con người có thể trực tiếp nắm bắt cơ chế hoạt động bên trong của mô hình. |
| **Feature Attribution** | Feature attribution calculates how much each input feature influences model outputs. It identifies key prediction drivers. | Feature contribution, influence score, prediction drivers. | Phương pháp tính toán mức độ đóng góp của từng đặc trưng đầu vào tới kết quả dự đoán. |
| **SHAP Values** | SHAP values explain individual predictions through game theory. They show each feature contribution to final decisions. | Game theory, local explanations, Shapley values, feature impact. | Giá trị toán học dựa trên lý thuyết trò chơi để giải thích mức độ ảnh hưởng của từng đặc trưng. |
| **SageMaker Clarify** | SageMaker Clarify detects bias in data and trained models. It also provides feature attribution explanations. | Bias detection, pre-training metrics, SHAP explanations, fairness. | Công cụ phát hiện thiên kiến trong dữ liệu/mô hình và tính toán giá trị giải thích SHAP. |
| **AWS AI Service Cards** | AWS AI Service Cards document intended use cases and limitations. They explain responsible design for AWS services. | Transparency documentation, intended use, technical limitations. | Tài liệu do AWS công bố mô tả mục đích sử dụng, hạn chế và nguyên tắc thiết kế dịch vụ AI. |
| **Bedrock Guardrails** | Bedrock Guardrails applies configurable safety boundaries to generative applications. It filters harmful content and sensitive data. | Safety boundaries, content filter, PII masking, denied topics. | Hàng rào bảo vệ an toàn cho ứng dụng GenAI, lọc nội dung độc hại và che giấu dữ liệu PII. |
| **PII Redaction** | PII redaction masks or removes sensitive personal information automatically. It protects customer identity and private data. | Masking sensitive data, redacting SSN, customer privacy. | Kỹ thuật tự động phát hiện và che giấu thông tin cá nhân nhạy cảm để bảo vệ quyền riêng tư. |
| **Contextual Grounding** | Contextual grounding checks model answers against source reference documents. It detects and blocks hallucinations. | Hallucination detection, source validation, grounding score. | Cơ chế kiểm tra đối chiếu câu trả lời của LLM với văn bản nguồn để chặn đứng thông tin bịa đặt. |

---

## Phần 3: Bộ câu hỏi tình huống & Phân tích đáp án

### Question 1
Một ngân hàng bán lẻ triển khai một mô hình học máy trên Amazon SageMaker để tự động phê duyệt các khoản vay tiêu dùng. Cơ quan thanh tra tài chính yêu cầu ngân hàng phải chứng minh rằng mô hình không phân biệt đối xử dựa trên giới tính hoặc độ tuổi của người nộp đơn, đồng thời phải cung cấp lý do giải thích cụ thể cho khách hàng khi hồ sơ của họ bị từ chối. Công cụ nào của AWS giúp ngân hàng đáp ứng đầy đủ cả hai yêu cầu này?
- A. Amazon Inspector
- B. Amazon SageMaker Clarify
- C. AWS CloudTrail
- D. Amazon CloudWatch Logs

**Đáp án đúng:** **B. Amazon SageMaker Clarify**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Hai yêu cầu cốt lõi của bài toán: 
  1. *"chứng minh mô hình không phân biệt đối xử dựa trên giới tính hoặc độ tuổi (Bias detection & Fairness)"*.
  2. *"cung cấp lý do giải thích cụ thể vì sao hồ sơ bị từ chối (Model Explainability / Feature Attribution)"*.
- **Amazon SageMaker Clarify** là công cụ chuyên biệt của AWS để đo lường các chỉ số thiên vị (bias metrics) cả trước và sau khi huấn luyện mô hình, đồng thời sử dụng thuật toán SHAP để cung cấp giải thích chi tiết mức độ ảnh hưởng của từng trường dữ liệu tới quyết định phê duyệt (Local Explainability).

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Inspector):** Inspector là dịch vụ quét lỗ hổng bảo mật và phần mềm độc hại trên hệ điều hành máy chủ EC2 và container images, không có tính năng phân tích thiên vị hay giải thích mô hình AI.
- **Loại C (AWS CloudTrail):** CloudTrail dùng để ghi log lịch sử các lệnh gọi API trên tài khoản AWS nhằm mục đích kiểm toán hạ tầng, không phân tích dữ liệu bên trong mô hình ML.
- **Loại D (Amazon CloudWatch Logs):** CloudWatch chỉ lưu trữ và giám sát log ứng dụng thông thường, không thể tính toán các chỉ số thống kê về tính công bằng hay giá trị SHAP.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Bất cứ khi nào đề thi nhắc đến **"Bias detection"**, **"Model Explainability"**, **"Fairness"** hoặc **"SHAP values"** $\rightarrow$ Luôn chọn **Amazon SageMaker Clarify**.

---

### Question 2
Một công ty y tế muốn triển khai một chatbot tư vấn dựa trên Amazon Bedrock để giải đáp các câu hỏi thông thường của bệnh nhân. Để tuân thủ quy định bảo vệ dữ liệu y tế, công ty bắt buộc ứng dụng phải tự động phát hiện và che giấu (mask) mã số bảo hiểm xã hội (SSN) và số điện thoại trước khi lưu trữ hoặc phản hồi cho người dùng. Ngoài ra, chatbot tuyệt đối không được đưa ra bất kỳ lời khuyên nào về kê đơn thuốc. Tính năng nào của AWS đáp ứng yêu cầu này với chi phí cấu hình tối thiểu?
- A. Tự viết biểu thức chính quy (Regex) trong mã nguồn ứng dụng để lọc văn bản.
- B. Cấu hình Amazon Bedrock Guardrails với Sensitive Information Filters và Denied Topics.
- C. Sử dụng AWS WAF để kiểm tra gói tin HTTP ở tầng mạng.
- D. Huấn luyện lại mô hình nền tảng bằng tập dữ liệu không chứa số bảo hiểm xã hội.

**Đáp án đúng:** **B. Cấu hình Amazon Bedrock Guardrails với Sensitive Information Filters và Denied Topics.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"tự động phát hiện và che giấu (mask) SSN và số điện thoại (PII redaction)"* + *"tuyệt đối không đưa ra lời khuyên kê đơn thuốc (Denied Topics)"* + *"chi phí cấu hình tối thiểu"*.
- **Amazon Bedrock Guardrails** cung cấp tính năng **Sensitive Information Filters** cho phép tự động nhận diện và che giấu (masking) thông tin PII chuẩn quốc tế chỉ với vài cú click, đồng thời tính năng **Denied Topics** cho phép mô tả bằng ngôn ngữ tự nhiên các chủ đề cấm (như tư vấn kê đơn thuốc) để mô hình từ chối trả lời một cách an toàn.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Tự viết Regex):** Rất tốn công sức bảo trì, dễ bỏ sót các biến thể định dạng số điện thoại/SSN phức tạp và không thể xử lý việc cấm thảo luận về chủ đề kê đơn thuốc.
- **Loại C (AWS WAF):** WAF là tường lửa ứng dụng web tầng mạng (Layer 7) dùng để chặn tấn công SQL Injection hoặc DDoS, không thể hiểu ngữ nghĩa câu lệnh để cấm chủ đề kê đơn thuốc hay che giấu PII trong payload LLM.
- **Loại D (Huấn luyện lại mô hình):** Huấn luyện lại mô hình tốn kém hàng triệu USD và hoàn toàn không khả thi đối với các mô hình độc quyền trên Bedrock, đồng thời vẫn không ngăn chặn được việc người dùng nhập SSN của chính họ vào câu hỏi.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cặp tính năng vàng của **Bedrock Guardrails**:
  - Che giấu hoặc chặn dữ liệu cá nhân nhạy cảm $\rightarrow$ **Sensitive Information Filters (PII)**.
  - Cấm thảo luận về một lĩnh vực/chủ đề cụ thể $\rightarrow$ **Denied Topics**.

---

### Question 3
Một nhóm phát triển đang lên kế hoạch tích hợp dịch vụ Amazon Rekognition vào ứng dụng an ninh của tòa nhà để nhận diện khuôn mặt nhân viên ra vào. Trước khi triển khai vào môi trường thực tế, nhóm cần tìm hiểu các khuyến nghị chính thức từ AWS về các trường hợp dịch vụ có thể hoạt động kém chính xác (chẳng hạn như điều kiện ánh sáng yếu hoặc góc máy quay quá hẹp) cũng như các hướng dẫn về thiết kế có trách nhiệm. Nhóm phát triển nên tham khảo tài liệu nào của AWS?
- A. AWS Architecture Center
- B. AWS AI Service Cards
- C. AWS Artifact
- D. AWS Trusted Advisor

**Đáp án đúng:** **B. AWS AI Service Cards**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"tìm hiểu tài liệu chính thức từ AWS về các trường hợp dịch vụ AI hoạt động kém chính xác (limitations) và hướng dẫn thiết kế có trách nhiệm (Responsible AI principles)"*.
- **AWS AI Service Cards** là nguồn tài liệu minh bạch chuyên biệt do chính AWS phát hành cho các dịch vụ AI như Rekognition, cung cấp thông tin chi tiết về mục đích sử dụng dự kiến (Intended Use), các giới hạn công nghệ thực tế (Limitations: ánh sáng, góc nghiêng) và cách thiết kế ứng dụng có trách nhiệm.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (AWS Architecture Center):** Cung cấp các sơ đồ kiến trúc hạ tầng mẫu, không đi sâu vào phân tích giới hạn đạo đức và khả năng nhận diện của từng dịch vụ AI cụ thể.
- **Loại C (AWS Artifact):** Là cổng thông tin để tải các báo cáo kiểm toán bảo mật và tuân thủ pháp lý của AWS (SOC, PCI DSS), không phải tài liệu hướng dẫn kỹ thuật Responsible AI cho từng dịch vụ AI.
- **Loại D (AWS Trusted Advisor):** Công cụ đưa ra các khuyến nghị tối ưu chi phí, hiệu năng và bảo mật cho tài nguyên đang chạy trên tài khoản AWS của người dùng.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Khi đề bài hỏi về tài liệu của AWS giải thích **"Intended use cases, technical limitations, and responsible design of an AWS AI managed service"** $\rightarrow$ Đáp án chắc chắn là **AWS AI Service Cards**.

---

### Question 4
Một công ty thương mại điện tử triển khai ứng dụng RAG sử dụng Amazon Bedrock để giải đáp câu hỏi của người dùng. Trong quá trình vận hành, khách hàng hỏi về chính sách bảo hành sản phẩm. Mặc dù tài liệu nguồn RAG chỉ nói về bảo hành đồ điện tử, mô hình LLM lại tự suy diễn và trả lời rằng công ty có chính sách bảo hành trọn đời cho cả quần áo thời trang. Cơ chế nào của Bedrock Guardrails giúp phát hiện và ngăn chặn hiện tượng câu trả lời không bám sát tài liệu nguồn này?
- A. Word Filters
- B. Contextual Grounding Check
- C. Sensitive Information Filters
- D. AWS Shield Advanced

**Đáp án đúng:** **B. Contextual Grounding Check**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Tình huống: Mô hình tự suy diễn và đưa ra thông tin không có trong tài liệu tham chiếu RAG (Ảo giác / Hallucination).
- Tính năng **Contextual Grounding Check** trong **Amazon Bedrock Guardrails** được thiết kế đặc thù để phát hiện và ngăn chặn ảo giác trong các ứng dụng RAG. Cơ chế này tính toán điểm số đối chiếu (**Grounding score** - đo lường xem câu trả lời có được chứng minh bởi tài liệu nguồn không) và điểm số liên quan (**Relevance score** - đo lường xem câu trả lời có trả lời đúng câu hỏi không). Nếu câu trả lời không bám sát tài liệu nguồn, Guardrail sẽ tự động chặn hoặc thay thế bằng thông báo an toàn.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Word Filters):** Chỉ chặn các từ ngữ tục tĩu hoặc từ khóa cụ thể nằm trong danh sách đen, không hiểu được việc câu trả lời có bám sát ngữ cảnh tài liệu hay không.
- **Loại C (Sensitive Information Filters):** Chỉ lọc dữ liệu định danh cá nhân (PII) như số thẻ tín dụng hay số điện thoại.
- **Loại D (AWS Shield Advanced):** Dịch vụ chống tấn công từ chối dịch vụ phân tán (DDoS) ở tầng mạng và giao vận, không liên quan đến kiểm soát nội dung AI.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Từ khóa *"Detect and prevent hallucinations in RAG by verifying factual grounding against source documents"* $\rightarrow$ Luôn trỏ tới **Contextual Grounding Check**.

---

### Question 5
Một chuyên viên phân tích dữ liệu đang sử dụng Amazon SageMaker Clarify để giải thích lý do tại sao một khách hàng cụ thể bị mô hình chấm điểm tín dụng đánh giá là "Nguy cơ rủi ro cao". Phương pháp tiếp cận giải thích này được phân loại là gì?
- A. Global Explainability (Giải thích toàn cục)
- B. Local Explainability (Giải thích cục bộ)
- C. Unsupervised Clustering
- D. Semi-supervised Labeling

**Đáp án đúng:** **B. Local Explainability (Giải thích cục bộ)**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Trọng tâm câu hỏi: Giải thích quyết định cho *"một khách hàng cụ thể"* (an individual instance / single prediction).
- **Local Explainability (Giải thích cục bộ)** là việc phân tích và chỉ ra các yếu tố nào đã trực tiếp dẫn đến kết quả dự đoán cho một điểm dữ liệu duy nhất (ví dụ: khách hàng A bị từ chối vay vì lịch sử trễ hạn thanh toán trong 3 tháng gần nhất).

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Global Explainability):** Giải thích toàn cục mô tả hành vi tổng thể của mô hình trên toàn bộ tập dữ liệu (ví dụ: trên toàn bộ khách hàng nói chung, thu nhập hàng tháng là yếu tố quan trọng nhất chiếm 35% tỷ trọng mô hình).
- **Loại C (Unsupervised Clustering):** Kỹ thuật phân cụm dữ liệu không nhãn, không phải phương pháp giải thích mô hình.
- **Loại D (Semi-supervised Labeling):** Kỹ thuật gán nhãn bán giám sát, không liên quan đến giải thích kết quả dự đoán.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Phân biệt nhanh trong đề thi:
  - Giải thích cho **một trường hợp cụ thể / một bệnh nhân / một giao dịch đơn lẻ** $\rightarrow$ **Local Explainability**.
  - Giải thích **hành vi tổng thể của mô hình trên toàn bộ quần thể** $\rightarrow$ **Global Explainability**.
