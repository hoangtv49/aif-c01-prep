# Domain 3: Applications of Foundation Models (28%)

> Module này chiếm tỷ trọng điểm số lớn nhất trong đề thi (28%). Hệ thống hóa toàn bộ bộ công cụ AWS Generative AI Toolkit (Amazon Bedrock, Amazon Q, PartyRock, JumpStart), kỹ thuật kỹ nghệ câu lệnh (Prompt Engineering), tinh chỉnh mô hình (Fine-Tuning) và các phương pháp đánh giá mô hình nền tảng (Section 7, 9, 10, 11 trong tài liệu của Vladimir Raykov).

---

## Phần 1: Trọng tâm lý thuyết & Decision Trees

### 1. Bộ công cụ AWS Generative AI Toolkit

```
+----------------------------------------------------------------------------------------+
|                                    AWS GenAI STACK                                     |
+----------------------------------------------------------------------------------------+
| Tầng ứng dụng      | Amazon Q Business  | Amazon Q Developer | AWS PartyRock (No-code) |
| (Applications)     | (Enterprise Chat)  | (Coding Assistant) | (Playground)            |
+--------------------+-------------------------------------------------------------------+
| Tầng nền tảng      | AMAZON BEDROCK                                                    |
| (Platform / APIs)  | - Serverless, Unified Single API                                  |
|                    | - Models: Anthropic Claude, Meta Llama, Cohere, Mistral, Titan... |
|                    | - Add-ons: Knowledge Bases (RAG), Agents, Guardrails              |
+--------------------+-------------------------------------------------------------------+
| Tầng hạ tầng & ML  | AMAZON SAGEMAKER JUMPSTART                                        |
| (Infrastructure)   | - Pre-trained model hub deployed on dedicated VPC ML instances   |
|                    | - Full control over model hosting, networking, and deep tuning    |
+----------------------------------------------------------------------------------------+
```

#### A. Amazon Bedrock (Dịch vụ trọng tâm nhất bài thi)
- **Đặc điểm cốt lõi**:
  - Dịch vụ **Serverless hoàn toàn**, không cần người dùng cấp phát hay quản lý hạ tầng máy chủ GPU.
  - Cung cấp quyền truy cập vào các mô hình nền tảng hàng đầu thông qua **một API duy nhất (Unified API)**.
  - Các nhà cung cấp mô hình đối tác: **Anthropic** (Claude), **Meta** (Llama), **Cohere** (Command, Embed), **Mistral AI**, **AI21 Labs** (Jurassic), **Stability AI** (Stable Diffusion), và **Amazon** (Titan Text, Titan Image, Titan Multimodal Embeddings).
- **Các tính năng nâng cao của Bedrock**:
  1. **Bedrock Knowledge Bases (Fully Managed RAG)**: Tự động hóa toàn bộ luồng RAG từ tài liệu trên Amazon S3, Confluence, Salesforce. Tự động chia nhỏ văn bản (Chunking), chuyển thành vector embedding và lưu vào Vector Store (Amazon OpenSearch Serverless, Pinecone, Aurora PostgreSQL pgvector).
  2. **Bedrock Agents**: Tác tử tự hành phân tích yêu cầu nhiều bước của người dùng, tự động lập kế hoạch (Reasoning via ReAct), kết nối và gọi API bên ngoài thông qua OpenAPI Schema kết hợp với **AWS Lambda**.
  3. **Bedrock Guardrails**: Thiết lập hàng rào an toàn cho ứng dụng GenAI. Lọc nội dung thù địch/nhạy cảm, lọc thông tin nhận dạng cá nhân (PII Redaction), chặn các chủ đề bị cấm (Denied Topics), và phát hiện ảo giác (Hallucination Detection via Grounding Check).
  4. **Model Evaluation on Bedrock**: Đánh giá và so sánh hiệu năng các mô hình bằng các bài kiểm tra tự động (Automatic Evaluation) hoặc kiểm tra có sự tham gia của con người (Human-in-the-loop Evaluation).

- **Các hình thức định giá của Amazon Bedrock (Pricing Models)**:
  - **On-Demand (Theo nhu cầu)**: Trả phí theo từng 1,000 token đầu vào (input) và đầu ra (output). Phù hợp cho ứng dụng thử nghiệm, lưu lượng biến động không ổn định.
  - **Batch Inference (Theo mẻ)**: Gửi danh sách lớn các prompts qua file JSONL trên S3 và nhận kết quả sau vài giờ với chi phí giảm tới 50% so với On-Demand.
  - **Provisioned Throughput (Cấp phát thông lượng cố định)**:
    - Mua các Đơn vị Mô hình (**Model Units - MUs**) theo cam kết 1 tháng hoặc 6 tháng để đảm bảo mức thông lượng (Throughput) tối đa và độ trễ ổn định cho ứng dụng production quan trọng.
    - **QUY TẮC ĐỀ THI:** Bắt buộc phải sử dụng **Provisioned Throughput** khi muốn triển khai và suy luận trên **Mô hình tùy chỉnh (Custom Fine-Tuned Models)** trong Amazon Bedrock.

#### B. Amazon Kendra vs Bedrock Knowledge Bases (Phân biệt thi cử)

| Tiêu chí | Amazon Kendra | Bedrock Knowledge Bases |
| :--- | :--- | :--- |
| **Bản chất** | Công cụ tìm kiếm tài liệu thông minh (Intelligent Enterprise Search Engine) | Giải pháp RAG hoàn chỉnh kết hợp LLM để sinh câu trả lời |
| **Đầu ra chính** | Trích đoạn tài liệu chính xác nhất, đường dẫn liên kết, danh sách file liên quan | Câu trả lời tổng hợp bằng ngôn ngữ tự nhiên từ LLM có kèm trích dẫn nguồn |
| **Trường hợp chọn** | Doanh nghiệp cần công cụ search nội bộ để nhân viên tìm file và tài liệu gốc | Doanh nghiệp muốn bot trả lời câu hỏi trực tiếp dựa trên tài liệu |

#### B. Amazon Q (Trợ lý AI chuyên nghiệp cho doanh nghiệp)
- **Amazon Q Business**: Trợ lý trò chuyện cho nhân viên doanh nghiệp, kết nối với hơn 40 kho dữ liệu nội bộ (S3, Jira, Salesforce, Google Drive, Microsoft 365). Điểm cốt lõi trong đề thi: **Tự động kế thừa và tuân thủ quyền truy cập danh tính người dùng (ACLs - Access Control Lists)**; nhân viên chỉ thấy dữ liệu họ có quyền đọc.
- **Amazon Q Developer**: Trợ lý lập trình AI hỗ trợ viết code, tạo unit test, quét lỗ hổng bảo mật và tự động nâng cấp phiên bản ứng dụng (ví dụ chuyển đổi Java 8 lên Java 17).

#### C. Amazon SageMaker JumpStart vs Amazon Bedrock

| Đặc tính so sánh | Amazon Bedrock (Ưu tiên thi) | Amazon SageMaker JumpStart |
| :--- | :--- | :--- |
| **Mô hình vận hành** | Serverless / Fully Managed API | Cần cấu hình và triển khai Dedicated ML Instance (EC2) |
| **Quản lý hạ tầng** | Không quản lý hạ tầng (Zero infrastructure) | Người dùng toàn quyền chọn loại máy chủ (ml.g5, ml.p4...) |
| **Kiểm soát mạng** | Tích hợp PrivateLink, API Endpoint | Nằm trọn vẹn trong VPC riêng của khách hàng |
| **Thanh toán** | Trả phí theo token đầu vào/đầu ra (Pay-per-token) | Trả phí theo giờ chạy máy chủ EC2 hosting endpoint |
| **Trường hợp chọn** | Phát triển ứng dụng nhanh, chi phí theo nhu cầu thực tế | Cần tùy biến sâu, cô lập mạng tuyệt đối, chạy 24/7 tải cao |

---

### 2. Kỹ nghệ câu lệnh (Prompt Engineering) & Tham số mô hình
- **Cấu trúc câu lệnh chuẩn**: Chỉ thị (Instruction) + Ngữ cảnh (Context) + Dữ liệu đầu vào (Input Data) + Định dạng mong muốn (Output Indicator).
- **Các kỹ thuật Prompting cốt lõi**:
  - **Zero-Shot Prompting**: Đưa ra yêu cầu trực tiếp mà không kèm theo bất kỳ ví dụ minh họa nào.
  - **Few-Shot Prompting**: Cung cấp từ 1 đến 5 cặp ví dụ mẫu (Input $\rightarrow$ Output) trong câu lệnh trước khi đưa câu hỏi thực tế. Giúp mô hình hiểu chính xác định dạng và phong cách mong muốn.
  - **Chain-of-Thought (CoT)**: Hướng dẫn mô hình tư duy từng bước (*"Hãy suy nghĩ từng bước một" / "Let's think step by step"*) để giải quyết các bài toán logic hoặc toán học phức tạp.
- **Các siêu tham số điều khiển đầu ra (Inference Parameters)**:
  - **Temperature**: Điều chỉnh mức độ ngẫu nhiên.
    - $Temperature \rightarrow 0$: Câu trả lời có tính xác định cao, chính xác, tập trung (dành cho tóm tắt pháp lý, trích xuất dữ liệu).
    - $Temperature \rightarrow 1$: Câu trả lời ngẫu nhiên, sáng tạo, đa dạng (dành cho viết nội dung quảng cáo, sáng tác).
  - **Top-P (Nucleus Sampling)**: Mô hình chỉ chọn các token tiếp theo có tổng xác suất tích lũy đạt ngưỡng P (ví dụ: $P = 0.9$ chỉ chọn nhóm từ có 90% khả năng xảy ra nhất).
  - **Top-K**: Mô hình chỉ giới hạn lựa chọn trong K từ có xác suất cao nhất tại mỗi bước sinh từ.
  - **Stop Sequences**: Chuỗi ký tự báo hiệu mô hình dừng ngay lập tức quá trình sinh văn bản (ví dụ dấu xuống dòng `\n` hoặc từ khóa `User:`).

---

### 3. Tinh chỉnh mô hình nền tảng (Fine-Tuning Deep Dive)
- **Instruction Tuning**: Huấn luyện mô hình trên các cặp câu lệnh - phản hồi (Instruction - Response) để mô hình làm theo các mệnh lệnh tự nhiên tốt hơn.
- **Domain Adaptation (Continued Pre-training)**: Tiếp tục huấn luyện mô hình trên tập dữ liệu phi cấu trúc lớn của một lĩnh vực chuyên môn (Y khoa, Luật pháp) để nạp thêm từ vựng chuyên ngành.
- **PEFT (Parameter-Efficient Fine-Tuning) & LoRA (Low-Rank Adaptation)**:
  - *Vấn đề*: Fine-tuning toàn bộ tham số của mô hình 70B cực kỳ đắt đỏ và tốn tài nguyên GPU.
  - *Giải pháp*: **LoRA** đóng băng (freeze) toàn bộ trọng số gốc của mô hình nền tảng, chỉ chèn thêm các ma trận biến đổi số chiều thấp có thể huấn luyện được.
  - *Lợi ích*: Giảm hơn 90% yêu cầu bộ nhớ GPU và tài nguyên tính toán, thời gian huấn luyện nhanh gấp nhiều lần nhưng chất lượng tương đương Full Fine-Tuning.
- **RLHF (Reinforcement Learning from Human Feedback)**: Sử dụng mô hình thưởng (Reward Model) dựa trên đánh giá của con người để căn chỉnh mô hình theo các tiêu chuẩn: Hữu ích (Helpful), Trung thực (Honest), và Vô hại (Harmless).

---

### 4. Đánh giá mô hình nền tảng (FM Evaluation)

| Chỉ số / Phương pháp | Bản chất kỹ thuật | Ứng dụng thi cử đặc trưng |
| :--- | :--- | :--- |
| **BLEU (Bilingual Evaluation Understudy)** | Đo độ chính xác (Precision) của n-grams giữa văn bản sinh ra và văn bản mẫu chuẩn. | Bài toán **Dịch máy (Machine Translation)**. |
| **ROUGE (Recall-Oriented Understudy)** | Đo độ bao phủ (Recall) của n-grams từ văn bản tham chiếu có mặt trong kết quả sinh ra. | Bài toán **Tóm tắt văn bản (Text Summarization)**. ROUGE-1, ROUGE-2, ROUGE-L. |
| **BERTScore** | Tính độ tương đồng ngữ nghĩa bằng vector embedding thay vì chỉ so khớp ký tự từ ngữ cứng. | Đánh giá câu trả lời có cùng ý nghĩa dù sử dụng từ đồng nghĩa khác nhau. |
| **Perplexity** | Đo lường mức độ bất ngờ của mô hình trước tập dữ liệu (điểm số càng thấp càng tốt). | Đánh giá độ trôi chảy ngôn ngữ và khả năng dự đoán từ tiếp theo. |
| **Human Evaluation** | Chuyên gia hoặc người dùng đánh giá theo các tiêu chí chủ quan: độ thân thiện, tính sáng tạo, độ an toàn. | Đánh giá các khía cạnh định tính mà máy tính không đo lường tự động được. |

---

## Phần 2: Bảng khái niệm chuẩn ASD-STE100

| Term (Thuật ngữ) | ASD-STE100 Definition (English) | Exam Trigger Keywords | Chú giải thực tế (Tiếng Việt) |
| :--- | :--- | :--- | :--- |
| **Amazon Bedrock** | Amazon Bedrock is a managed serverless service. It provides access to foundation models through a single API. | Serverless, unified API, foundation models, no infrastructure. | Dịch vụ serverless cung cấp quyền truy cập nhiều mô hình nền tảng qua một API duy nhất. |
| **Bedrock Knowledge Bases** | Bedrock Knowledge Bases connects foundation models to company data. It automates retrieval-augmented generation. | Managed RAG, vector store, document retrieval, S3 integration. | Tính năng RAG tự động hóa của Bedrock, liên kết kho tài liệu doanh nghiệp với mô hình. |
| **Bedrock Agents** | Bedrock Agents executes multi-step tasks for users automatically. It calls enterprise APIs through AWS Lambda. | Multi-step reasoning, action groups, API execution, OpenAPI schema. | Tác tử tự hành của Bedrock có khả năng lập kế hoạch nhiều bước và tự động gọi API hệ thống. |
| **Bedrock Guardrails** | Bedrock Guardrails enforces safety policies on model interactions. It filters harmful content and redacts sensitive PII. | Content filtering, PII redaction, denied topics, hallucination detection. | Hàng rào bảo vệ an toàn nội dung, chặn chủ đề cấm và che giấu dữ liệu cá nhân nhạy cảm. |
| **Amazon Q Business** | Amazon Q Business is an enterprise conversational assistant. It searches corporate data and obeys user access permissions. | Enterprise search, 40+ connectors, ACL inheritance, business assistant. | Trợ lý hội thoại doanh nghiệp kết nối hơn 40 nguồn dữ liệu và tôn trọng phân quyền người dùng. |
| **Amazon Q Developer** | Amazon Q Developer is an AI coding assistant. It generates code, scans vulnerabilities, and upgrades software versions. | Coding assistant, code generation, security scan, software upgrade. | Trợ lý lập trình AI hỗ trợ viết code, kiểm tra bảo mật và nâng cấp mã nguồn. |
| **AWS PartyRock** | AWS PartyRock is an intuitive web playground. It lets users build generative AI apps with no code. | No-code playground, learning tool, shareable mini-apps, Amazon Bedrock. | Môi trường web không cần code giúp người dùng dễ dàng thử nghiệm và chia sẻ ứng dụng GenAI. |
| **SageMaker JumpStart** | SageMaker JumpStart provides pre-trained models within SageMaker. It requires deploying endpoints to dedicated instances. | Model hub, deploy to dedicated instance, full infrastructure control. | Thư viện mô hình mở trong SageMaker, yêu cầu người dùng tự chọn máy chủ endpoint để chạy. |
| **Prompt Engineering** | Prompt engineering optimizes textual inputs to models. It guides models to produce accurate desired outputs. | Optimizing prompt text, prompt structure, guide model outputs. | Kỹ thuật thiết kế và tối ưu câu lệnh đầu vào để mô hình tạo ra câu trả lời chính xác nhất. |
| **Zero-Shot Prompting** | Zero-shot prompting gives instructions to a model without any examples. The model uses pre-trained knowledge only. | No examples provided, direct instruction, baseline evaluation. | Kỹ thuật ra lệnh trực tiếp cho mô hình mà không cần cung cấp bất kỳ ví dụ mẫu nào. |
| **Few-Shot Prompting** | Few-shot prompting provides input and output examples in the prompt. It guides the response format clearly. | Demonstration examples, input-output pairs, format guidance. | Kỹ thuật đưa kèm một vài ví dụ mẫu vào câu lệnh để định hình chuẩn xác định dạng đầu ra. |
| **Chain-of-Thought** | Chain-of-thought prompting asks the model to show intermediate reasoning steps. It improves complex logical problem solving. | Step-by-step reasoning, complex problem solving, intermediate thoughts. | Kỹ thuật hướng dẫn mô hình suy nghĩ từng bước để giải quyết các bài toán suy luận phức tạp. |
| **PEFT** | PEFT adapts large foundation models efficiently. It updates only a small subset of model parameters. | Parameter-efficient, freezes base weights, reduces GPU memory. | Kỹ thuật tinh chỉnh mô hình chỉ cập nhật một phần nhỏ tham số, giúp tiết kiệm bộ nhớ GPU. |
| **LoRA** | LoRA injects trainable low-rank matrices into transformer layers. It freezes original pre-trained model weights. | Low-rank adaptation, trainable rank matrices, efficient fine-tuning. | Phương pháp chèn các ma trận hạng thấp để tinh chỉnh mô hình mà không thay đổi trọng số gốc. |
| **RLHF** | RLHF aligns foundation models with human preferences. It uses human feedback to train reward models. | Human preferences, reward model, model alignment, safety. | Phương pháp căn chỉnh mô hình theo giá trị con người bằng học tăng cường từ phản hồi thực tế. |
| **Amazon Kendra** | Amazon Kendra is an intelligent enterprise search service. It searches internal documents with natural language queries. | Enterprise search, document retrieval, search engine, natural language. | Dịch vụ tìm kiếm tài liệu thông minh dành cho doanh nghiệp bằng ngôn ngữ tự nhiên. |
| **BLEU Score** | BLEU calculates n-gram precision between generated text and references. It evaluates machine translation quality. | Precision metric, machine translation benchmark, n-gram overlap. | Thang đo độ chính xác so khớp từ ngữ, dùng phổ biến nhất cho bài toán dịch máy. |
| **ROUGE Score** | ROUGE calculates n-gram recall between generated text and references. It evaluates text summarization quality. | Recall metric, summarization benchmark, ROUGE-N, ROUGE-L. | Thang đo độ bao phủ từ ngữ, dùng làm tiêu chuẩn đánh giá bài toán tóm tắt văn bản. |

---

## Phần 3: Bộ câu hỏi tình huống & Phân tích đáp án

### Question 1
A technology startup wants to integrate text summarization capabilities into its web application. The company has no dedicated infrastructure engineers, needs to deploy within two days, and requires pay-as-you-go pricing based strictly on actual usage. The team wants to invoke Anthropic Claude 3 models via standard API calls. Which AWS service best fulfills these requirements?
- A. Amazon SageMaker JumpStart
- B. Amazon Bedrock
- C. Amazon EC2 G5 GPU Instance
- D. Amazon Comprehend

**Đáp án đúng:** **B. Amazon Bedrock**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Đề bài yêu cầu: *"no dedicated infrastructure engineers"* (Serverless) + *"deploy within two days"* + *"pay-as-you-go pricing"* + *"invoke Anthropic Claude 3 via API calls"*.
- **Amazon Bedrock** là dịch vụ duy nhất trên AWS cung cấp quyền truy cập mô hình Claude của Anthropic dưới dạng Serverless API hoàn toàn không cần quản lý máy chủ.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (SageMaker JumpStart):** JumpStart yêu cầu người dùng phải chọn loại máy chủ instance EC2, triển khai endpoint và phải trả tiền theo giờ máy chủ hoạt động liên tục ngay cả khi không có lượt truy vấn nào, vi phạm yêu cầu không có kỹ sư hạ tầng và tối ưu chi phí pay-as-you-go.
- **Loại C (Amazon EC2 G5 Instance):** Tự quản lý máy chủ ảo GPU đòi hỏi kiến thức chuyên sâu về cài đặt driver, container, quản trị mạng và bảo trì hạ tầng.
- **Loại D (Amazon Comprehend):** Comprehend không cung cấp quyền truy cập vào các mô hình LLM tiên tiến như Anthropic Claude.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Bất cứ khi nào đề thi nhắc đến **"Anthropic Claude"** hoặc **"Meta Llama"** kết hợp với **"Serverless"** hoặc **"Zero infrastructure management"** $\rightarrow$ Đáp án chắc chắn là **Amazon Bedrock**.

---

### Question 2
A multinational enterprise wants to deploy an internal conversational search tool for employees. The tool must automatically connect to Microsoft SharePoint, Salesforce, and Amazon S3. A critical security requirement states that employees must only see information and answers derived from documents they already have permission to access in the source systems (Access Control Lists - ACLs). Which solution requires the LEAST implementation effort?
- A. Build a custom RAG solution using Amazon OpenSearch and Amazon Bedrock, writing custom logic to enforce user access controls.
- B. Deploy Amazon Q Business and connect to the enterprise data repositories using built-in connectors.
- C. Deploy Amazon Lex integrated with AWS Lambda to query documents stored in S3.
- D. Use Amazon SageMaker JumpStart combined with AWS IAM roles to control document permissions.

**Đáp án đúng:** **B. Deploy Amazon Q Business and connect to the enterprise data repositories using built-in connectors.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"internal conversational search tool for employees"* + *"connect to SharePoint, Salesforce, S3"* + *"employees only see answers derived from documents they have permission to access (ACLs)"* + *"least implementation effort"*.
- **Amazon Q Business** được thiết kế chính xác cho tình huống này: Cung cấp sẵn hơn 40 connectors doanh nghiệp và **tự động đồng bộ hóa cũng như thực thi quyền truy cập (ACLs)** của từng người dùng cuối mà lập trình viên không phải tự viết code xác thực phức tạp.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Custom RAG with Bedrock and OpenSearch):** Hoàn toàn khả thi về mặt kỹ thuật nhưng đòi hỏi công sức phát triển rất lớn (custom development) để đồng bộ ACLs từ Salesforce và SharePoint vào Vector Store, vi phạm yêu cầu "least implementation effort".
- **Loại C (Amazon Lex):** Lex dùng để xây dựng bot đàm thoại theo kịch bản đơn giản (Intent/Slot), không có tính năng tìm kiếm văn bản doanh nghiệp kế thừa ACLs.
- **Loại D (SageMaker JumpStart + IAM Roles):** IAM Roles dùng để phân quyền tài nguyên hạ tầng trên AWS, không thể phân quyền ở cấp độ từng tài liệu trong Salesforce hay SharePoint cho nhân viên cuối.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Từ khóa *"Enterprise search for employees with ACL / identity permissions inheritance"* là dấu hiệu độc quyền của **Amazon Q Business**.

---

### Question 3
An engineering team develops an AI application to assist physicians by summarizing patient medical records. The team wants to evaluate the accuracy of summaries generated by different LLMs against gold-standard summaries created by medical directors. The team needs an automated evaluation metric focused specifically on information coverage (recall). Which metric is MOST appropriate?
- A. BLEU
- B. ROUGE
- C. Perplexity
- D. Accuracy

**Đáp án đúng:** **B. ROUGE**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Từ khóa trong câu hỏi: *"summarizing patient medical records"* + *"automated evaluation metric focused on information coverage (recall)"*.
- **ROUGE (Recall-Oriented Understudy for Gisting Evaluation)** là thang đo tiêu chuẩn công nghiệp được thiết kế đặc thù cho bài toán tóm tắt văn bản, đo lường tỷ lệ các n-grams trong văn bản tham chiếu xuất hiện trong văn bản do mô hình tạo ra.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (BLEU):** BLEU tập trung vào độ chính xác (Precision), là tiêu chuẩn vàng cho bài toán **Machine Translation (Dịch máy)**, không tối ưu cho bài toán tóm tắt.
- **Loại C (Perplexity):** Đo lường mức độ bất ngờ hoặc tính trôi chảy nội tại của mô hình ngôn ngữ, không so sánh trực tiếp độ bao phủ nội dung giữa văn bản sinh ra và văn bản chuẩn.
- **Loại D (Accuracy):** Thang đo cho bài toán phân loại nhãn rời rạc trong học máy truyền thống, không áp dụng được cho sinh văn bản tự do.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Ghi nhớ thần chú thi cử:
  - **Machine Translation** $\rightarrow$ **BLEU** (Precision).
  - **Text Summarization** $\rightarrow$ **ROUGE** (Recall).

---

### Question 4
A financial services company wants an LLM to perform complex multi-step personal income tax calculations. In zero-shot testing, the model frequently produces incorrect final amounts by skipping dependent deduction steps. Which prompt engineering technique is MOST effective to improve the model's calculation accuracy without retraining?
- A. Increase the temperature parameter to 1.0.
- B. Chain-of-Thought (CoT) prompting.
- C. Remove the system prompt and provide the shortest possible query.
- D. Encode the entire prompt into Base64 format.

**Đáp án đúng:** **B. Chain-of-Thought (CoT) prompting.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Vấn đề: *"complex multi-step personal income tax calculations"* (suy luận logic và tính toán nhiều bước phức tạp).
- **Chain-of-Thought (CoT)** hướng dẫn mô hình phân tích bài toán thành các bước suy luận trung gian (ví dụ thêm câu chỉ dẫn *"Let's think step by step"* hoặc đưa các ví dụ mẫu có lời giải chi tiết). Điều này giúp mô hình phân bổ khả năng tính toán tuần tự cho từng bước trước khi đưa ra kết quả cuối cùng, giảm thiểu tối đa sai sót toán học.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Increase temperature to 1.0):** Tăng Temperature làm tăng tính ngẫu nhiên, khiến kết quả tính toán toán học càng trở nên sai lệch và khó đoán hơn.
- **Loại C (Remove system prompt):** Loại bỏ ngữ cảnh chỉ dẫn sẽ làm giảm khả năng định hướng của mô hình.
- **Loại D (Encode prompt into Base64):** Base64 làm xáo trộn cấu trúc token ngôn ngữ tự nhiên, làm suy giảm nghiêm trọng khả năng hiểu bài toán của mô hình.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Khi đề bài xuất hiện: *"Complex reasoning"*, *"Multi-step calculations"*, *"Break down logic into intermediate steps"* $\rightarrow$ Luôn chọn **Chain-of-Thought (CoT)**.

---

### Question 5
An enterprise wants to deploy an AI assistant that can automatically schedule appointments for customers into an internal database and send confirmation emails. The assistant must understand customer intents, determine which backend APIs to call, pass the correct parameters, and execute the actions. Which Amazon Bedrock capability provides this end-to-end functionality?
- A. Bedrock Knowledge Bases
- B. Bedrock Guardrails
- C. Bedrock Agents
- D. Bedrock Model Evaluation

**Đáp án đúng:** **C. Bedrock Agents**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"understand customer intents, determine which backend APIs to call, pass correct parameters, and execute actions"*.
- **Amazon Bedrock Agents** là tính năng được xây dựng chuyên biệt để biến Foundation Models thành các tác tử hành động (Autonomous Agents). Bedrock Agents phân tích yêu cầu bằng ReAct framework, đối chiếu với OpenAPI schema và tự động kích hoạt **AWS Lambda functions** tương ứng để hoàn thành tác vụ nghiệp vụ thực tế.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Bedrock Knowledge Bases):** Chỉ dùng để tra cứu và truy xuất tài liệu (RAG - Read-only), không có khả năng thực thi hành động (Actions/API calls) vào cơ sở dữ liệu.
- **Loại B (Bedrock Guardrails):** Dùng để lọc nội dung độc hại và bảo vệ an toàn, không có tính năng gọi API nghiệp vụ.
- **Loại D (Bedrock Model Evaluation):** Dùng để so sánh và chấm điểm chất lượng mô hình, không liên quan đến việc tự động hóa tác vụ.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Phân biệt nhanh bộ đôi Bedrock trong đề tiếng Anh:
  - Cần **Read / Retrieve knowledge from documents** (RAG) $\rightarrow$ **Bedrock Knowledge Bases**.
  - Cần **Execute actions / Invoke APIs / Multi-step orchestration** $\rightarrow$ **Bedrock Agents**.

---

### Question 6
A technology company wants to adapt a 70-billion-parameter foundation model for specialized customer service conversations. However, the company has a limited budget and cannot afford the massive compute infrastructure required to update all 70 billion weights. Which model customization method is MOST resource-efficient and cost-effective?
- A. Parameter-Efficient Fine-Tuning (PEFT) using Low-Rank Adaptation (LoRA)
- B. Pre-training from scratch
- C. Full-parameter fine-tuning on an Amazon EC2 P4de instance cluster
- D. Increasing the batch size to the maximum possible value

**Đáp án đúng:** **A. Parameter-Efficient Fine-Tuning (PEFT) using Low-Rank Adaptation (LoRA)**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Vấn đề: Muốn tinh chỉnh mô hình lớn (70B) nhưng *"limited budget"*, *"cannot afford massive compute to update all 70B weights"*.
- **PEFT / LoRA** đóng băng (freeze) các trọng số của mô hình cơ sở và chỉ huấn luyện một số lượng nhỏ các ma trận bổ sung hạng thấp. Phương pháp này giảm tới hơn 90% yêu cầu bộ nhớ GPU và tài nguyên tính toán, cho phép tinh chỉnh mô hình lớn với chi phí chỉ bằng một phần nhỏ so với Full Fine-Tuning.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại B (Pre-training from scratch):** Huấn luyện từ đầu là phương pháp đắt đỏ nhất trong toàn bộ lĩnh vực AI, hoàn toàn trái ngược với yêu cầu tiết kiệm chi phí.
- **Loại C (Full-parameter fine-tuning):** Đề bài đã nói rõ công ty không thể chi trả cho việc cập nhật toàn bộ tham số trên các cụm GPU đắt đỏ như P4de.
- **Loại D (Increase batch size):** Tăng Batch Size càng làm tràn bộ nhớ VRAM của GPU (Out Of Memory), không giải quyết được bài toán thiếu tài nguyên.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Từ khóa trong đề tiếng Anh: *"Fine-tune large models with minimal compute/cost/memory"* hoặc *"freeze base model weights and train small parameter subset"* $\rightarrow$ Luôn chọn **PEFT** hoặc **LoRA**.

---

### Question 7
A company is developing a proof-of-concept internal tool using Amazon Bedrock. The tool will be used sporadically by a team of 10 analysts with unpredictable query volumes. The company has a limited budget and wants maximum flexibility without making long-term financial commitments or paying for idle compute capacity. Which Amazon Bedrock pricing model should the company choose?
- A. Provisioned Throughput with 6-month commitment
- B. On-Demand pricing
- C. Spot Instance pricing
- D. Annual Reserved Instance pricing

**Đáp án đúng:** **B. On-Demand pricing**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"proof-of-concept with sporadic, unpredictable traffic"*, *"limited budget, no long-term commitment"*, *"no paying for idle compute"*.
- **On-Demand pricing** của Amazon Bedrock cho phép người dùng chỉ trả tiền chính xác theo số lượng token đầu vào (input tokens) và token đầu ra (output tokens) đã xử lý (Pay-as-you-go). Đây là mô hình linh hoạt nhất, không đòi hỏi cam kết thời gian và không mất phí khi hệ thống không có yêu cầu nào.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Provisioned Throughput):** Yêu cầu cam kết mua Model Units trong 1 tháng hoặc 6 tháng, tạo ra chi phí cố định liên tục ngay cả khi không có lượt truy vấn, hoàn toàn không phù hợp cho thử nghiệm tải thấp ngắt quãng.
- **Loại C (Spot Instance):** Spot Instance là mô hình giá của máy chủ ảo Amazon EC2, không tồn tại trong dịch vụ serverless Amazon Bedrock.
- **Loại D (Reserved Instance):** Reserved Instance cũng là mô hình trả trước dành cho EC2 và RDS, không áp dụng cho Amazon Bedrock API.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Nhớ các hình thức giá của Amazon Bedrock:
  - Tải ngắt quãng, thử nghiệm, trả theo token thực tế $\rightarrow$ **On-Demand**.
  - Xử lý hàng loạt tài liệu lớn qua S3 với giá rẻ hơn 50% $\rightarrow$ **Batch Inference**.
  - Cần đảm bảo thông lượng tối đa, độ trễ ổn định cho production $\rightarrow$ **Provisioned Throughput**.

---

### Question 8
A healthcare company fine-tuned a custom foundation model on Amazon Bedrock using its own proprietary clinical notes dataset. The engineering team is now ready to deploy this custom model to serve production inference requests. Which Amazon Bedrock purchase option is REQUIRED to deploy and run inference on custom models?
- A. On-Demand pricing
- B. Provisioned Throughput
- C. AWS Savings Plans
- D. EC2 On-Demand Instances

**Đáp án đúng:** **B. Provisioned Throughput**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Tình huống: *"deploy and run inference on custom fine-tuned foundation models in Amazon Bedrock"*.
- **QUY TẮC BẮT BUỘC TRÊN AWS BEDROCK**: Để phục vụ suy luận (inference) cho các mô hình tùy chỉnh (**Custom Models** - được tạo ra qua Fine-Tuning hoặc Continued Pre-training), người dùng **bắt buộc phải mua Provisioned Throughput** (cấp phát các Model Units). Bedrock không hỗ trợ On-Demand pricing cho Custom Models.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (On-Demand pricing):** On-Demand chỉ áp dụng cho các mô hình cơ sở tiêu chuẩn (Base Models) có sẵn của AWS và bên thứ ba, không hỗ trợ Custom Fine-tuned Models.
- **Loại C (AWS Savings Plans):** Là chương trình chiết khấu cam kết chi tiêu cho Compute (EC2, Fargate, Lambda), không phải cơ chế cấp phát tài nguyên chạy mô hình tùy chỉnh trong Bedrock.
- **Loại D (EC2 On-Demand Instances):** Bedrock là dịch vụ serverless do AWS quản lý, người dùng không thể tự triển khai Bedrock model lên máy chủ EC2 thông thường.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Câu hỏi bẫy rất kinh điển trong đề thi AIF-C01: *"How do you deploy and consume a custom fine-tuned model in Amazon Bedrock?"* $\rightarrow$ Đáp án duy nhất đúng luôn là **Provisioned Throughput**.

---

### Question 9
An enterprise in a highly regulated banking sector uses Amazon Bedrock foundation models to generate investment analysis reports. To comply with regulatory audits and risk management policies, the enterprise must maintain a comprehensive, tamper-proof audit trail of all input prompts, model inference responses, and metadata. Which native feature should the enterprise configure?
- A. Enable Amazon Bedrock Model Invocation Logging and specify an Amazon S3 bucket or Amazon CloudWatch log group.
- B. Write custom AWS Lambda functions to intercept all API calls and store logs in an Amazon DynamoDB table.
- C. Configure AWS CloudTrail to record data event payloads of Bedrock invocations.
- D. Enable Amazon GuardDuty for Bedrock.

**Đáp án đúng:** **A. Enable Amazon Bedrock Model Invocation Logging and specify an Amazon S3 bucket or Amazon CloudWatch log group.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"maintain an audit trail of all input prompts, model inference responses, and metadata for regulatory compliance"*.
- **Amazon Bedrock Model Invocation Logging** là tính năng tích hợp sẵn của Bedrock cho phép ghi lại toàn bộ nội dung câu lệnh đầu vào (prompts), câu trả lời của mô hình (responses), dữ liệu hình ảnh/tài liệu và siêu dữ liệu (metadata) và tự động đẩy về **Amazon S3** (để lưu trữ lâu dài) hoặc **Amazon CloudWatch Logs** (để giám sát thời gian thực).

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại B (Custom Lambda + DynamoDB):** Đòi hỏi viết mã phức tạp, tăng độ trễ và chi phí bảo trì so với tính năng có sẵn của nền tảng (native feature).
- **Loại C (AWS CloudTrail):** Mặc định CloudTrail chỉ ghi lại thông tin quản lý API (ai gọi, lúc nào, mã lỗi), nhưng CloudTrail không ghi lại toàn bộ nội dung văn bản chi tiết của Prompt và Response của mô hình.
- **Loại D (Amazon GuardDuty):** Dịch vụ phát hiện mối đe dọa an ninh mạng thông minh (quét DNS, VPC flow logs), không dùng để lưu vết kiểm toán nội dung văn bản AI.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"Log full prompts and completions for audit/compliance in Amazon Bedrock"* $\rightarrow$ Luôn chọn **Model Invocation Logging (S3 / CloudWatch Logs)**.

---

### Question 10
A data science team needs to evaluate and compare three different foundation models on Amazon Bedrock (Anthropic Claude, Meta Llama, and Amazon Titan) for an automated text summarization pipeline. The team wants to run standardized benchmarks across multiple criteria such as accuracy, robustness, and toxicity using both built-in automated prompt datasets and human evaluation workforces. Which Amazon Bedrock feature directly provides this capability?
- A. Amazon Bedrock Knowledge Bases
- B. Amazon Bedrock Model Evaluation
- C. Amazon Bedrock Playgrounds
- D. Amazon Bedrock Guardrails

**Đáp án đúng:** **B. Amazon Bedrock Model Evaluation**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"evaluate and compare foundation models across criteria (accuracy, robustness, toxicity) using automated datasets and human workforces"*.
- **Amazon Bedrock Model Evaluation** cung cấp công cụ có cấu trúc cho phép lựa chọn và so sánh nhiều mô hình nền tảng khác nhau bằng cách sử dụng các bộ dữ liệu prompt chuẩn hóa (curated datasets) hoặc dữ liệu tùy chỉnh, hỗ trợ cả đánh giá tự động (Automatic Evaluation) và đánh giá có sự tham gia của con người (Human-in-the-loop Evaluation).

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Knowledge Bases):** Dùng để truy xuất dữ liệu doanh nghiệp phục vụ RAG, không phải công cụ đánh giá so sánh chất lượng mô hình.
- **Loại C (Playgrounds):** Giao diện web thử nghiệm ad-hoc thủ công từng câu prompt một cách trực quan, không phải công cụ đánh giá định lượng theo các bộ benchmark chuẩn hóa.
- **Loại D (Guardrails):** Hàng rào bảo vệ an toàn nội dung trong thời gian chạy (runtime filtering), không phải tính năng so sánh đánh giá hiệu năng mô hình.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"Compare foundation model performance across metrics and datasets"* $\rightarrow$ Luôn chọn **Amazon Bedrock Model Evaluation**.

---

### Question 11
An enterprise wants to improve employee productivity by implementing an intelligent search solution across its internal documentation repository stored in Amazon S3. The solution must provide employees with direct clickable links to the original source documents, support natural language queries, and return precise extracted document text passages rather than synthesizing new generated answers. Which AWS service is the MOST appropriate choice?
- A. Amazon Bedrock Knowledge Bases with Claude 3
- B. Amazon Kendra
- C. Amazon Polly
- D. Amazon Rekognition

**Đáp án đúng:** **B. Amazon Kendra**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Ràng buộc quan trọng: *"intelligent enterprise search solution"*, *"provide direct clickable links to original source documents"*, *"return precise extracted document text passages rather than synthesizing new generated answers"*.
- **Amazon Kendra** là công cụ tìm kiếm thông minh chuyên dụng dành cho doanh nghiệp (Intelligent Enterprise Search Engine). Kendra hiểu ngôn ngữ tự nhiên và trả về kết quả tìm kiếm gồm **các đoạn trích dẫn nguyên văn từ tài liệu nguồn và liên kết trực tiếp (clickable links) tới tệp tin gốc**, không sử dụng LLM để tổng hợp hay sinh văn bản mới.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Bedrock Knowledge Bases with Claude 3):** Knowledge Bases sử dụng LLM để sinh ra câu trả lời mới tự nhiên (synthesized generative answer), trong khi đề bài yêu cầu rõ ràng là trích xuất đoạn văn nguyên bản và cung cấp liên kết tài liệu nguồn chứ không sinh câu trả lời mới (*"rather than synthesizing new generated answers"*).
- **Loại C (Amazon Polly):** Dịch vụ chuyển văn bản thành giọng nói.
- **Loại D (Amazon Rekognition):** Dịch vụ phân tích hình ảnh/video.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Phân biệt điểm chốt trong phòng thi:
  - Cần **Tìm kiếm tài liệu nội bộ, trả về link file gốc và trích đoạn chuẩn** $\rightarrow$ **Amazon Kendra**.
  - Cần **Trợ lý LLM đọc tài liệu và viết câu trả lời tổng hợp** $\rightarrow$ **Bedrock Knowledge Bases / Amazon Q Business**.
