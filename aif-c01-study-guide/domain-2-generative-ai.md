# Domain 2: Fundamentals of Generative AI (24%)

> Module này hệ thống hóa toàn bộ kiến thức về Trí tuệ nhân tạo tạo sinh (Generative AI), các kiến trúc mô hình nền tảng (Foundation Models - FMs), cơ chế Transformer, các yếu tố cân nhắc khi thiết kế giải pháp và ma trận lựa chọn kỹ thuật tối ưu (Section 5, 6, 8 trong tài liệu của Vladimir Raykov).

---

## Phần 1: Trọng tâm lý thuyết & Decision Trees

### 1. Phân biệt Discriminative AI vs Generative AI
- **Discriminative AI (AI phân biệt)**: 
  - Học ranh giới quyết định (decision boundary) giữa các lớp dữ liệu: $P(Y|X)$.
  - Mục đích: Phân loại hoặc dự đoán nhãn dựa trên dữ liệu đầu vào (Ví dụ: Ảnh này là chó hay mèo? Email này có phải spam không?).
- **Generative AI (AI tạo sinh)**: 
  - Học phân phối xác suất chung của dữ liệu: $P(X, Y)$ hoặc $P(X)$.
  - Mục đích: Tạo ra dữ liệu mới, nguyên bản (text, image, audio, code) có phân phối tương tự như dữ liệu huấn luyện (Ví dụ: Viết một bài luận, vẽ một bức tranh, viết một hàm Python).

### 2. Mô hình nền tảng (Foundation Models - FMs)
- **Định nghĩa**: Các mô hình AI quy mô lớn với hàng tỷ tham số, được huấn luyện trước (**Pre-trained**) trên các tập dữ liệu khổng lồ phi cấu trúc (Unlabeled Big Data) bằng phương pháp tự giám sát (Self-Supervised Learning).
- **Đặc tính cốt lõi**:
  - **Khả năng tổng quát hóa (Generalizability)**: Một mô hình duy nhất có thể thực hiện nhiều tác vụ khác nhau (dịch thuật, tóm tắt, trả lời câu hỏi, phân tích cảm xúc) thay vì phải xây dựng từng mô hình riêng lẻ.
  - **Học chuyển giao (Transfer Learning)**: Mô hình chuyển giao tri thức nền tảng đã học sang các tác vụ chuyên biệt thông qua thích ứng nhẹ (Prompting, RAG) hoặc tinh chỉnh (Fine-Tuning).
  - **Khả năng bộc lộ (Emergent Abilities)**: Khi tăng quy mô mô hình (parameters) và dữ liệu, mô hình tự phát triển các khả năng suy luận logic phức tạp mà không được lập trình rõ ràng từ trước.

### 3. Các kiến trúc mô hình sâu trong GenAI
1. **Kiến trúc Transformer (Cốt lõi của các LLM hiện đại)**:
   - Thay thế kiến trúc tuần tự cũ (RNN/LSTM) bằng khả năng xử lý **song song toàn bộ chuỗi văn bản (Parallel Processing)**, giúp tăng tốc độ huấn luyện trên GPU.
   - **Cơ chế tự chú ý (Self-Attention Mechanism)**: Cho phép mô hình tính toán mối liên hệ trọng số giữa mọi từ trong câu, bất kể khoảng cách (Ví dụ: Từ "nó" trong câu tham chiếu đến "ngân hàng" hay "dòng sông").
   - **Mã hóa vị trí (Positional Encoding)**: Gắn thêm thông tin về thứ tự xuất hiện của từ vào vector nhúng để mô hình hiểu ngữ pháp chuỗi.
   - Ba nhánh kiến trúc Transformer:
     - **Encoder-only (như BERT)**: Phù hợp nhất cho bài toán hiểu ngôn ngữ, phân loại văn bản, trích xuất thực thể.
     - **Decoder-only (như GPT, Llama, Titan Text, Claude)**: Chuyên biệt cho bài toán sinh văn bản tự hồi quy (Autoregressive Text Generation).
     - **Encoder-Decoder (như T5, BART)**: Phù hợp cho dịch máy (Translation) và tóm tắt văn bản (Summarization).
2. **Mô hình khuếch tán (Diffusion Models)**:
   - Quá trình huấn luyện: Thêm nhiễu Gauss ngẫu nhiên vào ảnh từng bước cho đến khi thành nhiễu trắng hoàn toàn (Forward Process), sau đó huấn luyện mạng nơ-ron khử nhiễu từng bước để tái tạo lại ảnh mới từ văn bản mô tả (Reverse Process).
   - Ứng dụng: Stable Diffusion, Amazon Titan Image Generator.
3. **Mạng nơ-ron tích chập (CNNs)**: Dành riêng cho xử lý lưới pixel ảnh và trích xuất đặc trưng không gian.
4. **Mô hình đa phương thức (Multimodal FMs)**: Xử lý và liên kết đồng thời nhiều kiểu dữ liệu khác nhau (Text-to-Image, Image-to-Text, Audio-to-Text).

---

### 4. 10 Yếu tố cân nhắc khi chọn Foundation Model (FM Selection)

Khi chọn mô hình nền tảng cho bài toán doanh nghiệp, đề thi luôn kiểm tra sự cân bằng giữa các yếu tố sau:
1. **Chi phí (Cost)**: Chi phí suy luận (Inference cost per 1,000 tokens), chi phí hạ tầng và chi phí tinh chỉnh.
2. **Phương thức dữ liệu (Modality)**: Text, Code, Image, Speech hay Multimodal.
3. **Độ trễ và hiệu năng (Latency & Throughput)**: Ứng dụng tương tác thời gian thực (Real-time chatbots) cần mô hình nhỏ, độ trễ thấp; trong khi phân tích tài liệu theo mẻ (Batch processing) ưu tiên độ chính xác cao hơn tốc độ.
4. **Kích thước mô hình (Model Size & Parameters)**: Mô hình càng lớn thì năng lực suy luận càng cao nhưng chi phí và độ trễ càng lớn.
5. **Cửa sổ ngữ cảnh (Context Window)**: Số lượng token tối đa mà mô hình có thể nhận và xử lý trong một lần gọi prompt (Ví dụ: 8K, 32K, 128K, 200K tokens). Tài liệu càng dài đòi hỏi context window càng lớn.
6. **Khả năng tùy biến (Customizability)**: Hỗ trợ RAG, Fine-Tuning hay Continual Pre-training.
7. **Bảo mật và quyền riêng tư dữ liệu (Data Privacy)**: Mô hình có chạy hoàn toàn trong VPC hay serverless API có cam kết không lưu trữ dữ liệu người dùng không.
8. **Độ chính xác và tỷ lệ ảo giác (Accuracy & Hallucination Rate)**: Mức độ đáng tin cậy của câu trả lời.
9. **Hỗ trợ đa ngôn ngữ (Multilingual Support)**: Năng lực xử lý ngôn ngữ bản địa.
10. **Bản quyền và cấp phép (Licensing & Governance)**: Giấy phép nguồn mở (Apache 2.0, MIT) hay độc quyền thương mại (Proprietary).

---

### 5. Ma trận lựa chọn kỹ thuật: Prompt vs RAG vs Fine-Tuning vs Pre-training

```
Tăng chi phí, thời gian và độ phức tạp kỹ thuật  ======================>
[ Prompt Engineering ] ---> [ RAG ] ---> [ Fine-Tuning ] ---> [ Pre-training ]
```

| Kỹ thuật | Bản chất kỹ thuật | Khi nào sử dụng? (Exam Trigger) | Ưu điểm cốt lõi | Nhược điểm / Hạn chế |
| :--- | :--- | :--- | :--- | :--- |
| **Prompt Engineering** | Tối ưu hóa câu lệnh đầu vào (Zero-shot, Few-shot, CoT). Không thay đổi trọng số mô hình. | Bắt đầu bài toán mới; tác vụ tổng quát; thử nghiệm nhanh. | Nhanh nhất, chi phí thấp nhất, không cần dữ liệu huấn luyện. | Phụ thuộc vào giới hạn Context Window, không giải quyết được tri thức nội bộ chưa từng công bố. |
| **RAG (Retrieval-Augmented Generation)** | Truy xuất tài liệu liên quan từ kho dữ liệu (Vector DB) rồi đính kèm vào Prompt để LLM trả lời. | Dữ liệu nội bộ doanh nghiệp thay đổi thường xuyên; cần trích dẫn nguồn; giảm ảo giác. | Không cần train lại mô hình; cập nhật dữ liệu tức thì; minh bạch nguồn tin. | Tăng độ trễ truy vấn; cần duy trì hạ tầng tìm kiếm/vector database. |
| **Fine-Tuning (Tinh chỉnh mô hình)** | Cập nhật lại một phần hoặc toàn bộ trọng số mô hình bằng tập dữ liệu có cấu trúc chuyên biệt. | Cần thay đổi phong cách hành văn (tone/style); tuân thủ định dạng xuất phức tạp; bài toán domain hẹp. | Tối ưu hóa định dạng đầu ra; giảm độ dài prompt cần gửi; hiểu sâu thuật ngữ chuyên ngành. | Tốn kém chi phí tính toán GPU; nguy cơ Catastrophic Forgetting; không phù hợp để cập nhật dữ liệu động. |
| **Pre-training (Huấn luyện từ đầu)** | Khởi tạo trọng số ngẫu nhiên và huấn luyện trên hàng nghìn tỷ token từ đầu. | Xây dựng mô hình cho ngôn ngữ hiếm hoàn toàn hoặc lĩnh vực tối mật chưa từng có mô hình nào hỗ trợ. | Toàn quyền kiểm soát kiến trúc và bản quyền dữ liệu. | Cực kỳ đắt đỏ (hàng triệu USD); đòi hỏi hàng nghìn GPU và dữ liệu khổng lồ. |

---

### 6. Rủi ro của Generative AI và Biện pháp giảm thiểu
- **Ảo giác (Hallucination)**: Mô hình tự tin khẳng định thông tin hoàn toàn sai lệch hoặc bịa đặt.
  - *Biện pháp*: Áp dụng RAG để neo câu trả lời vào tài liệu thực tế, hạ thấp tham số Temperature về gần 0, sử dụng Prompt cấm bịa đặt (*"Chỉ trả lời dựa trên tài liệu được cung cấp, nếu không có hãy nói Tôi không biết"*).
- **Tính độc hại và thiên kiến (Toxicity & Bias)**: Tạo ra nội dung kích động thù địch, phân biệt đối xử.
  - *Biện pháp*: Thiết lập Guardrails (Amazon Bedrock Guardrails) để lọc nội dung độc hại.
- **Xâm phạm bản quyền (IP & Copyright Infringement)**: Tái tạo lại đoạn văn hoặc hình ảnh có bản quyền tác giả.
  - *Biện pháp*: Dùng mô hình có cam kết bồi hoàn bản quyền (AWS IP indemnity) hoặc lọc nguồn dữ liệu huấn luyện.
- **Rò rỉ dữ liệu (Data Leakage)**: Người dùng nhập bí mật kinh doanh vào prompt và dữ liệu đó bị dùng để huấn luyện mô hình công cộng.
  - *Biện pháp*: Sử dụng dịch vụ cam kết không lưu trữ hay tái huấn luyện như Amazon Bedrock; mã hóa và che giấu PII.

---

## Phần 2: Bảng khái niệm chuẩn ASD-STE100

| Term (Thuật ngữ) | ASD-STE100 Definition (English) | Exam Trigger Keywords | Chú giải thực tế (Tiếng Việt) |
| :--- | :--- | :--- | :--- |
| **Generative AI** | Generative AI is artificial intelligence that creates new content. It produces text, images, audio, and synthetic data. | Creates new original content, text generation, image synthesis. | Trí tuệ nhân tạo có khả năng tự tạo ra nội dung mới nguyên bản như văn bản, ảnh, âm thanh. |
| **Discriminative AI** | Discriminative AI classifies data into categories. It finds differences between classes to predict labels. | Classifies data, predicts labels, decision boundary, spam detection. | Nhánh AI truyền thống tập trung vào phân loại và phân biệt các nhóm dữ liệu có sẵn. |
| **Foundation Model** | A foundation model is a large deep learning model. It learns from broad unlabeled datasets to solve many tasks. | Broad general data, pre-trained, adaptable, multi-task capability. | Mô hình quy mô lớn được huấn luyện trước trên dữ liệu rộng, có thể áp dụng cho nhiều bài toán. |
| **Transformer** | A transformer is a neural architecture. It processes sequential tokens in parallel with self-attention mechanisms. | Self-attention, parallel processing, non-sequential training, LLM backbone. | Kiến trúc mạng nơ-ron xử lý song song toàn bộ chuỗi ký tự nhờ cơ chế tự chú ý (Attention). |
| **Self-Attention** | Self-attention calculates relationships between all words in a sentence. It captures long-range context accurately. | Word relationships, contextual weights, long-range dependencies. | Cơ chế tính toán mức độ liên quan ngữ nghĩa giữa các từ trong cùng một văn bản. |
| **Diffusion Model** | A diffusion model adds noise to training images. It then learns to remove noise to generate clear images. | Denoising process, text-to-image, Stable Diffusion, Titan Image Generator. | Mô hình tạo ảnh bằng cách học quy trình khử nhiễu ngược từ nhiễu ngẫu nhiên thành ảnh rõ nét. |
| **Multimodal Model** | A multimodal model processes and relates multiple types of data. It connects text, images, and audio together. | Multiple input modalities, image-to-text, vision-language model. | Mô hình có khả năng hiểu và xử lý đồng thời nhiều loại dữ liệu (ảnh, chữ, giọng nói). |
| **Latent Space** | Latent space is an internal mathematical space. The model maps compressed data representations inside this space. | Mathematical space, compressed representation, vector coordinates. | Không gian toán học nhiều chiều chứa các biểu diễn nén của dữ liệu ngữ nghĩa. |
| **Context Window** | The context window is the maximum number of tokens a model can accept in a single prompt. | Maximum token limit, prompt capacity, long document processing. | Số lượng token tối đa mà mô hình có thể tiếp nhận và ghi nhớ trong một phiên tương tác. |
| **Hallucination** | Hallucination occurs when a model generates false facts. The model presents false information with high confidence. | Factually incorrect outputs, fabricated facts, confident falsehoods. | Hiện tượng mô hình tự bịa đặt ra thông tin sai sự thật nhưng diễn đạt rất tự tin. |
| **RAG** | RAG retrieves facts from external data sources. It adds these facts to prompts to ground model responses. | External data retrieval, vector store, reduce hallucinations, up-to-date data. | Kỹ thuật tìm kiếm tài liệu bên ngoài và đưa vào prompt để mô hình trả lời chính xác, tránh bịa đặt. |
| **Fine-Tuning** | Fine-tuning trains an existing foundation model on a labeled dataset. It changes model weights for specific domains. | Updates model weights, specialized tone, domain adaptation, labeled pairs. | Quá trình cập nhật trọng số của mô hình bằng tập dữ liệu nhỏ có nhãn để thích ứng nghiệp vụ riêng. |
| **Transfer Learning** | Transfer learning uses knowledge from an earlier task. It applies this knowledge to solve a new task. | Pre-trained knowledge, adaptation, saves training time, downstream tasks. | Phương pháp tái sử dụng tri thức từ mô hình đã học trước đó để giải quyết bài toán mới. |
| **Embedding** | An embedding is a numerical vector that represents data. It preserves semantic meaning in vector space. | Vector representation, semantic similarity, high-dimensional vector. | Biểu diễn dữ liệu (từ, câu, ảnh) dưới dạng một chuỗi số thực vector giữ nguyên ý nghĩa ngữ nghĩa. |
| **Vector Database** | A vector database indexes and searches high-dimensional vector embeddings quickly. It uses similarity search algorithms. | High-dimensional index, similarity search, nearest neighbors, RAG storage. | Cơ sở dữ liệu chuyên dụng để lưu trữ và tìm kiếm vector tương đồng (ví dụ: OpenSearch, pgvector). |

---

## Phần 3: Bộ câu hỏi tình huống & Phân tích đáp án

### Question 1
A law firm wants to build an AI assistant to answer employee questions based on an internal repository of over 50,000 legal policy documents that are updated weekly. The firm requires the assistant to cite specific page numbers and clauses from the source documents and strictly prevent fabricated information. Which technical approach is MOST effective?
- A. Fine-tune an open-source large language model daily on the entire document repository.
- B. Implement a Retrieval-Augmented Generation (RAG) architecture connecting the document repository with a foundation model.
- C. Expand the model context window and insert all 50,000 documents into the system prompt for each query.
- D. Train a custom foundation model from scratch on the legal documents.

**Đáp án đúng:** **B. Implement a Retrieval-Augmented Generation (RAG) architecture connecting the document repository with a foundation model.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu cốt lõi: *"documents updated weekly"* + *"cite specific page numbers and clauses"* + *"prevent fabricated information (mitigate hallucinations)"*.
- **RAG** là kiến trúc hoàn hảo nhất cho kịch bản này: Hệ thống chỉ cần lập chỉ mục vector tài liệu mới vào cơ sở dữ liệu tri thức mà không cần huấn luyện lại mô hình. Khi có câu hỏi, RAG truy xuất đoạn văn bản gốc và đính kèm vào prompt, cho phép mô hình trích dẫn trực tiếp nguồn tham chiếu và loại bỏ ảo giác.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Fine-Tuning daily):** Fine-tuning rất tốn kém chi phí tính toán GPU, mất nhiều giờ để hoàn thành và quan trọng nhất: mô hình sau khi fine-tuning không có cơ chế tự nhiên để trích dẫn số trang/nguồn tài liệu cụ thể một cách đáng tin cậy. Ngoài ra, việc fine-tuning liên tục rất dễ gây hiện tượng Catastrophic Forgetting.
- **Loại C (Insert 50,000 documents into prompt):** 50,000 tài liệu pháp lý tương đương hàng triệu token, vượt xa giới hạn Context Window của bất kỳ mô hình thương mại nào hiện nay, đồng thời gây độ trễ và chi phí suy luận khổng lồ.
- **Loại D (Pre-training from scratch):** Huấn luyện mô hình từ đầu tốn hàng triệu USD và hàng tháng trời, hoàn toàn lãng phí và không giải quyết được yêu cầu tài liệu cập nhật hàng tuần.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Quy tắc vàng trong đề thi AIF-C01: Khi đề bài nhắc đến **"frequently updated data"**, **"traceable citations"** hoặc **"mitigate hallucinations"** $\rightarrow$ Luôn chọn **RAG**, KHÔNG chọn Fine-Tuning.

---

### Question 2
A healthcare research organization needs to generate detailed biological illustrations of cells from text descriptions. The engineering team must select the deep learning architecture family best suited for text-to-image synthesis. Which architecture should the team choose?
- A. Recurrent Neural Networks (RNN)
- B. Pure Convolutional Neural Networks (CNN)
- C. Diffusion Models
- D. Bidirectional Encoder Representations from Transformers (BERT)

**Đáp án đúng:** **C. Diffusion Models**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"generate biological illustrations of cells from text descriptions (Text-to-Image)"*.
- **Diffusion Models** (mô hình khuếch tán) là kiến trúc tiên tiến và tiêu chuẩn công nghiệp hiện nay cho các bài toán sinh ảnh từ văn bản (ví dụ: Stable Diffusion, Amazon Titan Image Generator). Chúng hoạt động bằng cách học quy trình khử nhiễu ngược để tạo ra các điểm ảnh có độ phân giải cao và chân thực.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (RNN):** RNN là mạng nơ-ron hồi quy cổ điển dùng để xử lý dữ liệu chuỗi tuần tự thời gian (như âm thanh hoặc text một chiều), không dùng để tạo ảnh chất lượng cao.
- **Loại B (CNN thuần túy):** CNN chủ yếu dùng để phân tích và trích xuất đặc trưng từ ảnh có sẵn (phân loại ảnh, phát hiện vật thể), không phải là kiến trúc hiện đại hàng đầu cho bài toán Text-to-Image thế hệ mới.
- **Loại D (BERT):** BERT là kiến trúc Transformer dạng Encoder-only, chuyên biệt cho việc hiểu ngôn ngữ tự nhiên và phân tích văn bản, hoàn toàn không có khả năng sinh ảnh.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Nhớ nhanh các cặp kiến trúc & tác vụ trong đề thi tiếng Anh:
  - Text-to-Image generation $\rightarrow$ **Diffusion Models**.
  - Parallel sequential text processing $\rightarrow$ **Transformers**.
  - Image classification & object detection $\rightarrow$ **CNNs**.

---

### Question 3
An insurance company is evaluating whether to use a pre-trained foundation model or fine-tune an existing model. In which scenario SHOULD the company choose fine-tuning over prompt engineering with a pre-trained model?
- A. When the company needs to incorporate stock price data that fluctuates every minute.
- B. When the company requires the model to strictly follow a proprietary internal JSON schema and adopt a specialized medical terminology tone.
- C. When the company wants to answer general world knowledge questions sourced from Wikipedia.
- D. When the company wants to minimize infrastructure costs and has no labeled training data.

**Đáp án đúng:** **B. When the company requires the model to strictly follow a proprietary internal JSON schema and adopt a specialized medical terminology tone.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Mục đích chuẩn của **Fine-Tuning**: Điều chỉnh **phong cách (Style/Tone)**, cấu trúc cú pháp đầu ra chuyên biệt (như định dạng JSON nội bộ nghiêm ngặt) và làm quen với bộ từ vựng chuyên ngành sâu (*"specialized medical terminology tone"*). Fine-Tuning dạy cho mô hình "cách hành xử và định dạng" tốt hơn nhiều so với việc cố gắng mô tả dài dòng trong Prompt.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Stock price data fluctuating every minute):** Dữ liệu biến động từng phút là bài toán của RAG hoặc gọi API bên ngoài (Tool/Function Calling), fine-tuning không thể theo kịp tốc độ thay đổi này.
- **Loại C (World knowledge questions from Wikipedia):** Pre-trained FM đã chứa sẵn kiến thức thế giới phong phú, chỉ cần dùng Prompt Engineering là đủ.
- **Loại D (Minimize infrastructure costs and no labeled data):** Fine-tuning đòi hỏi tập dữ liệu gán nhãn chất lượng cao và phát sinh chi phí huấn luyện tính toán, hoàn toàn trái ngược với phương án D.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Gặp câu hỏi: "When to choose Fine-Tuning?" $\rightarrow$ Tìm đáp án chứa các từ khóa: **"Specialized domain vocabulary"**, **"Specific output format/JSON syntax"**, **"Consistent corporate tone/style"**.

---

### Question 4
During user testing of a customer support chatbot powered by an LLM, the development team notices the model confidently states that the company offers a "200% refund within 60 days", even though the actual policy is a 100% refund within 30 days. What is this phenomenon called, and which approach MOST effectively mitigates it?
- A. Model Drift; restart the application container.
- B. Catastrophic Forgetting; retrain the model from scratch.
- C. Hallucination; implement RAG with authoritative policy documents and lower the temperature parameter.
- D. Data Poisoning; install antivirus software on the client machine.

**Đáp án đúng:** **C. Hallucination; implement RAG with authoritative policy documents and lower the temperature parameter.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Hiện tượng mô hình tự bịa ra thông tin không có thật với giọng điệu quả quyết chính là **Ảo giác (Hallucination)**.
- Biện pháp khắc phục chuẩn: Kết hợp RAG để buộc mô hình chỉ lấy thông tin từ tài liệu chính sách được cấp, đồng thời giảm tham số **Temperature** (ví dụ đưa về 0 hoặc 0.1) để giảm tính ngẫu nhiên, tăng tính xác thực và dự đoán nhất quán của câu trả lời.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Model Drift):** Model drift là hiện tượng hiệu năng mô hình ML truyền thống suy giảm theo thời gian do phân phối dữ liệu thực tế thay đổi (Data drift/Concept drift), không phải việc LLM sinh nội dung bịa đặt.
- **Loại B (Catastrophic Forgetting):** Là việc mô hình quên kỹ năng cũ sau khi fine-tuning kỹ năng mới.
- **Loại D (Data Poisoning):** Là cuộc tấn công có chủ đích của kẻ xấu cố tình đưa dữ liệu bẩn vào tập huấn luyện, không liên quan đến hành vi hallucination tự nhiên của LLM.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Tham số **Temperature**:
  - Muốn câu trả lời **sáng tạo, phong phú** (viết thơ, marketing) $\rightarrow$ Tăng Temperature (gần 1.0).
  - Muốn câu trả lời **chính xác, nhất quán, đúng sự thật** (hỏi đáp chính sách, y tế, tài chính) $\rightarrow$ Hạ Temperature (gần 0).

---

### Question 5
A media company wants to analyze two-hour interview video recordings. The application must transcribe spoken dialogue into text, recognize corporate brand logos appearing on the screen, and detect speaker emotional sentiment from facial expressions. Which type of foundation model is MOST suitable for this workload?
- A. Single-modality text model
- B. Multimodal foundation model
- C. K-Means clustering model
- D. Encoder-only transformer model (such as BERT)

**Đáp án đúng:** **B. Multimodal foundation model**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: Xử lý đồng thời nhiều dạng dữ liệu khác nhau trong một luồng công việc: âm thanh lời thoại (Audio), hình ảnh nhận diện logo/khuôn mặt (Vision) và văn bản ngữ nghĩa (Text).
- **Mô hình đa phương thức (Multimodal FM)** là mô hình được huấn luyện để hiểu, liên kết và chuyển đổi linh hoạt giữa nhiều phương thức dữ liệu khác nhau (Text, Image, Video, Audio) trong cùng một không gian biểu diễn chung.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Single-modality text model):** Mô hình đơn phương thức văn bản chỉ nhận và xuất text, không thể xử lý hình ảnh khung hình video hay âm thanh.
- **Loại C (K-Means):** Thuật toán phân cụm không giám sát truyền thống, không thể xử lý đa phương thức phức tạp.
- **Loại D (BERT):** BERT chỉ là mô hình ngôn ngữ (text-only) cho tác vụ hiểu văn bản, không thể nhận diện khuôn mặt hay hình ảnh video.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"processes text, image, video, audio concurrently"* $\rightarrow$ Luôn trỏ tới **Multimodal Model**.

---

### Question 6
A marketing company is building a generative AI application using a foundation model on Amazon Bedrock to draft creative, engaging email promotional copy. The company requires the generated emails to be highly creative, diverse, and short in length (under 150 words). Which configuration of inference parameters satisfies these requirements?
- A. Set Temperature to 0.1, Top-P to 0.2, and Max Generation Length to 4096 tokens.
- B. Set Temperature to 0.9, Top-P to 0.9, and Max Generation Length to 200 tokens.
- C. Set Temperature to 0.0, Top-K to 1, and Stop Sequence to "STOP".
- D. Set Temperature to 0.9, Top-P to 0.1, and Max Generation Length to 8192 tokens.

**Đáp án đúng:** **B. Set Temperature to 0.9, Top-P to 0.9, and Max Generation Length to 200 tokens.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Hai yêu cầu đề bài:
  1. *"highly creative and diverse text"* $\rightarrow$ Cần **Temperature cao** (gần 1.0, ví dụ 0.8–0.9) và **Top-P cao** (0.9) để mở rộng phân phối từ ngữ được lựa chọn.
  2. *"short in length (under 150 words)"* $\rightarrow$ Cần giới hạn **Max Generation Length / Max Tokens** ở mức nhỏ (ví dụ 200 tokens $\approx$ 150 từ).

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A:** Temperature 0.1 và Top-P 0.2 sẽ làm cho kết quả đầu ra rất đơn điệu, lặp lại và thiếu tính sáng tạo; Max Generation Length 4096 tokens không khống chế được độ dài ngắn của email.
- **Loại C:** Temperature 0.0 và Top-K 1 biến mô hình thành greedy decoding (luôn chọn từ có xác suất cao nhất), triệt tiêu hoàn toàn tính sáng tạo.
- **Loại D:** Top-P 0.1 giới hạn không gian lựa chọn quá hẹp và Max Tokens 8192 quá lớn so với yêu cầu email ngắn.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Thuộc lòng bảng suy luận tham số:
  - Cần **Sáng tạo (Creative / Diverse)** $\rightarrow$ **High Temperature & High Top-P**.
  - Cần **Chính xác, thực tế (Deterministic / Factual)** $\rightarrow$ **Low Temperature & Low Top-P**.
  - Cần **Độ dài ngắn (Short length)** $\rightarrow$ **Low Max Generation Length / Max Tokens**.

---

### Question 7
A financial services firm is selecting an Amazon Bedrock foundation model to power an interactive, customer-facing customer support chatbot. The chatbot must provide sub-second response times to user queries with minimal latency. High logical reasoning and complex mathematical calculations are not required for this workload. Which model selection strategy should the firm adopt?
- A. Select the largest available frontier model with the highest parameter count to ensure maximum answer fluency.
- B. Select a smaller, lightweight model designed for high throughput and low latency.
- C. Fine-tune a 70-billion-parameter model using human feedback before deployment.
- D. Implement chain-of-thought prompting with multiple reasoning iterations on a complex model.

**Đáp án đúng:** **B. Select a smaller, lightweight model designed for high throughput and low latency.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Ràng buộc quan trọng: *"interactive customer support chatbot"*, *"sub-second response times with minimal latency"*, *"complex reasoning not required"*.
- Trong kỳ thi AIF-C01, quy tắc chọn mô hình luôn yêu cầu cân đối giữa kích thước mô hình và độ trễ. Các mô hình nhỏ gọn (như Claude 3 Haiku, Amazon Titan Text Lite, Llama 8B) được tối ưu hóa đặc biệt cho **tốc độ phản hồi tức thì (low latency)** và **thông lượng cao (high throughput)** với chi phí rẻ hơn nhiều so với các mô hình khổng lồ.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A:** Các mô hình lớn (Frontier/70B+ models) có thời gian xử lý suy luận (Time-to-First-Token) cao hơn nhiều, không thể đảm bảo độ trễ dưới 1 giây cho chatbot tương tác.
- **Loại C (Fine-tune 70B model):** Không giải quyết được bài toán độ trễ suy luận của mô hình lớn, gây lãng phí chi phí.
- **Loại D (Chain-of-thought iterations):** CoT làm tăng số lượng token sinh ra qua nhiều bước suy luận, làm tăng đáng kể độ trễ phản hồi.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Khi đề bài nhấn mạnh: *"Real-time user interaction"*, *"Sub-second response"*, *"High throughput and lowest cost"* $\rightarrow$ Luôn ưu tiên chọn **Smaller / Lightweight models** (như Claude Haiku hay Titan Lite).

---

### Question 8
An enterprise legal department needs an LLM to analyze corporate merger contracts that exceed 500 pages (approximately 300,000 words). The department discovers that passing the entire document directly into the prompt exceeds the model's maximum context window and results in an API error. Which technique should the team use to process this document effectively without losing critical information?
- A. Increase the Temperature parameter to allow the model to extrapolate missing text.
- B. Truncate the document by deleting all pages after the model's token limit.
- C. Implement document chunking with a vector store and use Retrieval-Augmented Generation (RAG) to retrieve only relevant sections.
- D. Convert the entire PDF contract into a single Base64 encoded string.

**Đáp án đúng:** **C. Implement document chunking with a vector store and use Retrieval-Augmented Generation (RAG) to retrieve only relevant sections.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Tình huống: Tài liệu 500 trang vượt quá giới hạn **Context Window** của mô hình.
- Giải pháp chuẩn công nghiệp: Áp dụng kỹ thuật **Document Chunking** (chia nhỏ tài liệu thành các đoạn văn ngắn có phần chồng lấn overlap), chuyển thành vector embedding và lưu vào Vector Store. Khi người dùng đặt câu hỏi, hệ thống **RAG** chỉ tìm kiếm và đưa các đoạn văn liên quan nhất vào prompt, hoàn toàn vượt qua giới hạn của Context Window mà không làm mất thông tin pháp lý quan trọng.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A:** Tham số Temperature chỉ điều chỉnh tính ngẫu nhiên, không thể giải quyết lỗi tràn Context Window hay tự bịa nội dung văn bản bị thiếu.
- **Loại B (Truncate):** Cắt bỏ tài liệu sẽ làm mất vĩnh viễn các điều khoản pháp lý quan trọng ở các trang phía sau.
- **Loại D (Base64):** Mã hóa Base64 không làm giảm dung lượng token mà còn làm tăng số lượng ký tự lên khoảng 33%, khiến mô hình hoàn toàn không đọc được.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Vấn đề *"Document exceeds context window"* $\rightarrow$ Luôn giải quyết bằng **Document Chunking + RAG (Vector retrieval)**.

---

### Question 9
An online retail marketplace wants to allow users to search its product catalog using either text descriptions or by uploading a photo of an item they want to buy. The system needs to map both product images and text descriptions into the same semantic vector space so that image-to-text and text-to-image similarity searches can be performed directly. Which AWS foundation model provides this capability?
- A. Amazon Titan Text Express
- B. Amazon Titan Image Generator
- C. Amazon Titan Multimodal Embeddings
- D. Amazon Comprehend

**Đáp án đúng:** **C. Amazon Titan Multimodal Embeddings**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"map both product images and text descriptions into the same semantic vector space for cross-modal similarity search (image-to-text, text-to-image)"*.
- **Amazon Titan Multimodal Embeddings** được thiết kế chính xác cho tác vụ này: Chuyển đổi cả văn bản và hình ảnh thành các vector embedding có cùng số chiều trong một không gian ngữ nghĩa thống nhất, cho phép thực hiện tìm kiếm tương đồng vector giữa ảnh và chữ.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Titan Text Express):** Chỉ tạo text generation hoặc text-only embeddings, không xử lý được vector ảnh.
- **Loại B (Amazon Titan Image Generator):** Dùng để sinh ảnh mới từ câu mô tả văn bản (Text-to-Image generation), không tạo vector embeddings để tìm kiếm tương đồng.
- **Loại D (Amazon Comprehend):** Dịch vụ NLP truyền thống chỉ phân tích văn bản, không có chức năng tạo vector embedding đa phương thức.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"Map images and text into the same vector embedding space for search"* $\rightarrow$ Luôn chọn **Amazon Titan Multimodal Embeddings**.

---

### Question 10
A developer wants to limit the randomness of an LLM by instructing the model to consider only the top 50 most likely token candidates at each generation step, and then select among the candidate tokens whose cumulative probability equals 90%. Which two inference parameters should the developer configure?
- A. Temperature and Stop Sequences
- B. Top-K and Top-P (Nucleus Sampling)
- C. Frequency Penalty and Presence Penalty
- D. Max Tokens and System Prompt

**Đáp án đúng:** **B. Top-K and Top-P (Nucleus Sampling)**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu 1: Giới hạn xem xét ở *"top 50 most likely token candidates"* $\rightarrow$ Đây chính là tham số **Top-K** ($K = 50$).
- Yêu cầu 2: Lựa chọn trong nhóm từ có *"cumulative probability equals 90%"* $\rightarrow$ Đây chính là tham số **Top-P (Nucleus Sampling)** ($P = 0.90$).

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A:** Temperature điều chỉnh độ phẳng của phân phối xác suất; Stop Sequences xác định chuỗi ký tự dừng sinh từ.
- **Loại C:** Frequency Penalty và Presence Penalty dùng để phạt các từ lặp lại trong văn bản, không lọc theo số lượng ứng viên hay xác suất tích lũy.
- **Loại D:** Max Tokens giới hạn số lượng token đầu ra; System Prompt là câu lệnh chỉ dẫn hệ thống.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Nhớ định nghĩa cốt lõi:
  - **Top-K**: Giới hạn **số lượng cố định K từ** có xác suất cao nhất.
  - **Top-P**: Giới hạn động các từ có **tổng xác suất tích lũy đạt ngưỡng P**.
