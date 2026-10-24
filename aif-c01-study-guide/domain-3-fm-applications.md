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
Một công ty khởi nghiệp công nghệ muốn tích hợp khả năng tóm tắt văn bản vào ứng dụng web của họ. Công ty không có đội ngũ kỹ sư hạ tầng chuyên trách và muốn triển khai trong vòng 2 ngày với mức chi phí tối ưu nhất, chỉ trả tiền theo lượng sử dụng thực tế (Pay-as-you-go). Họ muốn sử dụng mô hình Claude 3 từ Anthropic thông qua lệnh gọi API tiêu chuẩn. Dịch vụ AWS nào đáp ứng hoàn hảo nhất?
- A. Amazon SageMaker JumpStart
- B. Amazon Bedrock
- C. Amazon EC2 G5 GPU Instance
- D. Amazon Comprehend

**Đáp án đúng:** **B. Amazon Bedrock**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Đề bài yêu cầu: *"không có đội ngũ hạ tầng chuyên trách"* (Serverless) + *"triển khai nhanh nhất"* + *"trả tiền theo lượng sử dụng thực tế (Pay-as-you-go / Pay-per-token)"* + *"truy cập mô hình Claude 3 từ Anthropic qua API"*.
- **Amazon Bedrock** là dịch vụ duy nhất trên AWS cung cấp quyền truy cập mô hình Claude của Anthropic dưới dạng Serverless API hoàn toàn không cần quản lý máy chủ.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (SageMaker JumpStart):** JumpStart yêu cầu người dùng phải chọn loại máy chủ instance EC2, triển khai endpoint và phải trả tiền theo giờ máy chủ hoạt động liên tục ngay cả khi không có lượt truy vấn nào, vi phạm yêu cầu không có kỹ sư hạ tầng và tối ưu chi phí pay-as-you-go.
- **Loại C (Amazon EC2 G5 Instance):** Tự quản lý máy chủ ảo GPU đòi hỏi kiến thức chuyên sâu về cài đặt driver, container, quản trị mạng và bảo trì hạ tầng.
- **Loại D (Amazon Comprehend):** Comprehend không cung cấp quyền truy cập vào các mô hình LLM tiên tiến như Anthropic Claude.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Bất cứ khi nào đề thi nhắc đến **"Anthropic Claude"** hoặc **"Meta Llama"** kết hợp với **"Serverless"** hoặc **"Zero infrastructure management"** $\rightarrow$ Đáp án chắc chắn là **Amazon Bedrock**.

---

### Question 2
Một tập đoàn bán lẻ đa quốc gia muốn cung cấp cho nhân viên một công cụ tìm kiếm nội bộ có khả năng trò chuyện thông minh. Công cụ này phải tự động kết nối với Microsoft SharePoint, Salesforce và Amazon S3. Yêu cầu bảo mật tối quan trọng là: nhân viên phòng ban nào chỉ được phép thấy thông tin và câu trả lời trích xuất từ các tài liệu mà họ đã được cấp quyền truy cập từ trước trên các hệ thống nguồn đó (Access Control Lists - ACLs). Giải pháp nào đòi hỏi ít công sức triển khai nhất?
- A. Tự xây dựng ứng dụng RAG sử dụng Amazon OpenSearch và Amazon Bedrock, tự viết mã kiểm tra quyền truy cập của người dùng.
- B. Sử dụng Amazon Q Business và kết nối với các kho dữ liệu thông qua các connector có sẵn.
- C. Triển khai Amazon Lex kết nối với AWS Lambda để đọc tài liệu từ S3.
- D. Sử dụng Amazon SageMaker JumpStart kết hợp với AWS IAM Roles để phân quyền tài liệu.

**Đáp án đúng:** **B. Sử dụng Amazon Q Business và kết nối với các kho dữ liệu thông qua các connector có sẵn.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"công cụ tìm kiếm nội bộ trò chuyện thông minh"* + *"kết nối SharePoint, Salesforce, S3"* + *"kế thừa và tuân thủ nguyên vẹn quyền truy cập người dùng (ACLs) từ hệ thống nguồn"* + *"ít công sức triển khai nhất"*.
- **Amazon Q Business** được thiết kế chính xác cho tình huống này: Cung cấp sẵn hơn 40 connectors doanh nghiệp và **tự động đồng bộ hóa cũng như thực thi quyền truy cập (ACLs)** của từng người dùng cuối mà lập trình viên không phải tự viết code xác thực phức tạp.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Tự xây dựng RAG với Bedrock và OpenSearch):** Hoàn toàn khả thi về mặt kỹ thuật nhưng đòi hỏi công sức phát triển rất lớn (custom development) để đồng bộ ACLs từ Salesforce và SharePoint vào Vector Store, vi phạm yêu cầu "ít công sức triển khai nhất".
- **Loại C (Amazon Lex):** Lex dùng để xây dựng bot đàm thoại theo kịch bản đơn giản (Intent/Slot), không có tính năng tìm kiếm văn bản doanh nghiệp kế thừa ACLs.
- **Loại D (SageMaker JumpStart + IAM Roles):** IAM Roles dùng để phân quyền tài nguyên hạ tầng trên AWS, không thể phân quyền ở cấp độ từng tài liệu trong Salesforce hay SharePoint cho nhân viên cuối.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Từ khóa *"Enterprise search for employees with ACL / identity permissions inheritance"* là dấu hiệu độc quyền của **Amazon Q Business**.

---

### Question 3
Một nhóm kỹ sư phát triển một ứng dụng hỗ trợ bác sĩ tóm tắt bệnh án của bệnh nhân. Nhóm muốn đánh giá độ chính xác của các bản tóm tắt do các mô hình ngôn ngữ lớn khác nhau sinh ra so với bản tóm tắt chuẩn do bác sĩ trưởng khoa biên soạn. Nhóm muốn sử dụng một thang đo tự động tập trung vào độ bao phủ thông tin quan trọng (Recall) của bản tóm tắt. Thang đo đánh giá nào là phù hợp nhất?
- A. BLEU
- B. ROUGE
- C. Perplexity
- D. Accuracy

**Đáp án đúng:** **B. ROUGE**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Từ khóa trong câu hỏi: *"đánh giá bài toán tóm tắt (Summarization)"* + *"thang đo tập trung vào độ bao phủ thông tin (Recall)"*.
- **ROUGE (Recall-Oriented Understudy for Gisting Evaluation)** là thang đo tiêu chuẩn công nghiệp được thiết kế đặc thù cho bài toán tóm tắt văn bản, đo lường tỷ lệ các n-grams trong văn bản tham chiếu xuất hiện trong văn bản do mô hình tạo ra.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (BLEU):** BLEU tập trung vào độ chính xác (Precision), là tiêu chuẩn vàng cho bài toán **Dịch máy (Machine Translation)**, không tối ưu cho bài toán tóm tắt.
- **Loại C (Perplexity):** Đo lường mức độ bất ngờ hoặc tính trôi chảy nội tại của mô hình ngôn ngữ, không so sánh trực tiếp độ bao phủ nội dung giữa văn bản sinh ra và văn bản chuẩn.
- **Loại D (Accuracy):** Thang đo cho bài toán phân loại nhãn rời rạc trong học máy truyền thống, không áp dụng được cho sinh văn bản tự do.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Ghi nhớ thần chú thi cử:
  - **Dịch thuật (Translation)** $\rightarrow$ **BLEU** (Precision).
  - **Tóm tắt (Summarization)** $\rightarrow$ **ROUGE** (Recall).

---

### Question 4
Một công ty tài chính muốn mô hình LLM giải quyết bài toán tính toán thuế thu nhập cá nhân phức tạp qua nhiều bước. Khi thử nghiệm với câu lệnh thông thường (Zero-Shot), mô hình thường xuyên tính sai kết quả cuối cùng do bỏ qua các bước khấu trừ phụ thuộc. Kỹ thuật Prompt Engineering nào hiệu quả nhất để giúp mô hình cải thiện khả năng tính toán mà không cần huấn luyện lại?
- A. Tăng tham số Temperature lên 1.0.
- B. Chain-of-Thought (CoT) Prompting.
- C. Bỏ qua System Prompt và gửi câu hỏi ngắn gọn nhất có thể.
- D. Chuyển đổi toàn bộ câu hỏi sang định dạng Base64.

**Đáp án đúng:** **B. Chain-of-Thought (CoT) Prompting.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Vấn đề: Bài toán suy luận logic và tính toán nhiều bước phức tạp.
- **Chain-of-Thought (CoT)** hướng dẫn mô hình phân tích bài toán thành các bước suy luận trung gian (ví dụ thêm câu chỉ dẫn *"Hãy suy nghĩ từng bước một"* hoặc đưa các ví dụ mẫu có lời giải chi tiết). Điều này giúp mô hình phân bổ khả năng tính toán tuần tự cho từng bước trước khi đưa ra kết quả cuối cùng, giảm thiểu tối đa sai sót toán học.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Tăng Temperature lên 1.0):** Tăng Temperature làm tăng tính ngẫu nhiên, khiến kết quả tính toán toán học càng trở nên sai lệch và khó đoán hơn.
- **Loại C (Bỏ qua System Prompt):** Loại bỏ ngữ cảnh chỉ dẫn sẽ làm giảm khả năng định hướng của mô hình.
- **Loại D (Mã hóa Base64):** Base64 làm xáo trộn cấu trúc token ngôn ngữ tự nhiên, làm suy giảm nghiêm trọng khả năng hiểu bài toán của mô hình.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Khi đề bài xuất hiện: *"Complex reasoning"*, *"Multi-step calculations"*, *"Break down logic into intermediate steps"* $\rightarrow$ Luôn chọn **Chain-of-Thought (CoT)**.

---

### Question 5
Một doanh nghiệp muốn tích hợp trợ lý AI để tự động đặt lịch hẹn cho khách hàng vào hệ thống cơ sở dữ liệu nội bộ và gửi email xác nhận. Trợ lý AI cần có khả năng hiểu yêu cầu của khách hàng, tự xác định xem cần gọi hàm API nào, truyền các tham số nào vào và thực thi hành động trong hệ thống. Tính năng nào của Amazon Bedrock cung cấp giải pháp trọn gói cho nhu cầu này?
- A. Bedrock Knowledge Bases
- B. Bedrock Guardrails
- C. Bedrock Agents
- D. Bedrock Model Evaluation

**Đáp án đúng:** **C. Bedrock Agents**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"tự động lập kế hoạch hành động"*, *"xác định API cần gọi và truyền tham số"*, *"thực thi hành động nhiều bước (đặt lịch, gửi email)"*.
- **Amazon Bedrock Agents** là tính năng được xây dựng chuyên biệt để biến Foundation Models thành các tác tử hành động (Autonomous Agents). Bedrock Agents phân tích yêu cầu bằng ReAct framework, đối chiếu với OpenAPI schema và tự động kích hoạt **AWS Lambda functions** tương ứng để hoàn thành tác vụ nghiệp vụ thực tế.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Bedrock Knowledge Bases):** Chỉ dùng để tra cứu và truy xuất tài liệu (RAG - Read-only), không có khả năng thực thi hành động (Actions/API calls) vào cơ sở dữ liệu.
- **Loại B (Bedrock Guardrails):** Dùng để lọc nội dung độc hại và bảo vệ an toàn, không có tính năng gọi API nghiệp vụ.
- **Loại D (Bedrock Model Evaluation):** Dùng để so sánh và chấm điểm chất lượng mô hình, không liên quan đến việc tự động hóa tác vụ.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Phân biệt nhanh bộ đôi Bedrock:
  - Cần **Đọc / Tra cứu dữ liệu** (RAG) $\rightarrow$ **Bedrock Knowledge Bases**.
  - Cần **Thực thi hành động / Gọi API** $\rightarrow$ **Bedrock Agents**.

---

### Question 6
Một công ty công nghệ muốn tinh chỉnh mô hình ngôn ngữ lớn 70 tỷ tham số để chuyên phục vụ trong lĩnh vực dịch vụ khách hàng. Tuy nhiên, ngân sách của công ty có hạn và họ không thể chi trả chi phí tính toán khổng lồ cho việc cập nhật toàn bộ 70 tỷ tham số của mô hình (Full Fine-Tuning). Phương pháp tinh chỉnh nào là giải pháp tối ưu nhất về chi phí và tài nguyên?
- A. Parameter-Efficient Fine-Tuning (PEFT) sử dụng LoRA (Low-Rank Adaptation)
- B. Pre-training from scratch
- C. Full Parameter Fine-Tuning trên cụm máy chủ EC2 P4de
- D. Tăng kích thước Batch Size lên mức tối đa

**Đáp án đúng:** **A. Parameter-Efficient Fine-Tuning (PEFT) sử dụng LoRA (Low-Rank Adaptation)**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Vấn đề: Muốn tinh chỉnh mô hình lớn (70B) nhưng *"ngân sách có hạn"*, *"không thể chi trả chi phí cập nhật toàn bộ tham số"*.
- **PEFT / LoRA** đóng băng (freeze) các trọng số của mô hình cơ sở và chỉ huấn luyện một số lượng nhỏ các ma trận bổ sung hạng thấp. Phương pháp này giảm tới hơn 90% yêu cầu bộ nhớ GPU và tài nguyên tính toán, cho phép tinh chỉnh mô hình lớn với chi phí chỉ bằng một phần nhỏ so với Full Fine-Tuning.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại B (Pre-training from scratch):** Huấn luyện từ đầu là phương pháp đắt đỏ nhất trong toàn bộ lĩnh vực AI, hoàn toàn trái ngược với yêu cầu tiết kiệm chi phí.
- **Loại C (Full Parameter Fine-Tuning):** Đề bài đã nói rõ công ty không thể chi trả cho việc cập nhật toàn bộ tham số trên các cụm GPU đắt đỏ như P4de.
- **Loại D (Tăng Batch Size tối đa):** Tăng Batch Size càng làm tràn bộ nhớ VRAM của GPU (Out Of Memory), không giải quyết được bài toán thiếu tài nguyên.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Từ khóa *"Fine-tune large models with minimal compute/cost/memory"* hoặc *"freeze base model weights and train small parameter subset"* $\rightarrow$ Luôn chọn **PEFT** hoặc **LoRA**.
