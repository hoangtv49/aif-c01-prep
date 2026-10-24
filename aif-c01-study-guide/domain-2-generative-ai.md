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
Một công ty luật muốn xây dựng một trợ lý AI để trả lời câu hỏi của nhân viên dựa trên kho tài liệu pháp lý nội bộ gồm hơn 50,000 văn bản chính sách thay đổi hàng tuần. Công ty yêu cầu câu trả lời phải trích dẫn chính xác số trang và điều khoản của tài liệu nguồn, đồng thời tuyệt đối không được tự bịa đặt thông tin. Giải pháp kỹ thuật nào tối ưu nhất?
- A. Tinh chỉnh (Fine-Tuning) một mô hình ngôn ngữ lớn nguồn mở hàng ngày với toàn bộ kho tài liệu.
- B. Triển khai kiến trúc RAG (Retrieval-Augmented Generation) kết nối kho tài liệu với mô hình nền tảng.
- C. Tăng kích thước Context Window của mô hình và đưa toàn bộ 50,000 văn bản vào System Prompt mỗi lần gọi.
- D. Huấn luyện một mô hình nền tảng hoàn toàn mới từ đầu (Pre-training from scratch).

**Đáp án đúng:** **B. Triển khai kiến trúc RAG (Retrieval-Augmented Generation) kết nối kho tài liệu với mô hình nền tảng.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu cốt lõi: *"tài liệu thay đổi hàng tuần"* + *"trích dẫn chính xác số trang và điều khoản nguồn"* + *"tuyệt đối không tự bịa đặt thông tin (giảm ảo giác)"*.
- **RAG** là kiến trúc hoàn hảo nhất cho kịch bản này: Hệ thống chỉ cần lập chỉ mục vector tài liệu mới vào cơ sở dữ liệu tri thức mà không cần huấn luyện lại mô hình. Khi có câu hỏi, RAG truy xuất đoạn văn bản gốc và đính kèm vào prompt, cho phép mô hình trích dẫn trực tiếp nguồn tham chiếu và loại bỏ ảo giác.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Fine-Tuning hàng ngày):** Fine-tuning rất tốn kém chi phí tính toán GPU, mất nhiều giờ để hoàn thành và quan trọng nhất: mô hình sau khi fine-tuning không có cơ chế tự nhiên để trích dẫn số trang/nguồn tài liệu cụ thể một cách đáng tin cậy. Ngoài ra, việc fine-tuning liên tục rất dễ gây hiện tượng Catastrophic Forgetting.
- **Loại C (Đưa toàn bộ 50,000 văn bản vào Prompt):** 50,000 tài liệu pháp lý tương đương hàng triệu token, vượt xa giới hạn Context Window của bất kỳ mô hình thương mại nào hiện nay, đồng thời gây độ trễ và chi phí suy luận khổng lồ.
- **Loại D (Pre-training from scratch):** Huấn luyện mô hình từ đầu tốn hàng triệu USD và hàng tháng trời, hoàn toàn lãng phí và không giải quyết được yêu cầu tài liệu cập nhật hàng tuần.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Quy tắc vàng trong đề thi AIF-C01: Khi đề bài nhắc đến **"dữ liệu cập nhật thường xuyên" (frequently updated data)**, **"cần dẫn nguồn tài liệu" (traceable citations)** hoặc **"ngăn chặn ảo giác" (mitigate hallucinations)** $\rightarrow$ Luôn chọn **RAG**, KHÔNG chọn Fine-Tuning.

---

### Question 2
Một tổ chức y tế cần tạo ra hình ảnh minh họa tế bào phục vụ nghiên cứu sinh học bằng cách nhập các câu mô tả bằng văn bản. Nhóm kỹ sư cần lựa chọn họ kiến trúc học sâu phù hợp nhất cho bài toán sinh ảnh từ văn bản (Text-to-Image). Kiến trúc nào sau đây là câu trả lời chính xác?
- A. Recurrent Neural Networks (RNN)
- B. Convolutional Neural Networks (CNN) thuần túy
- C. Diffusion Models
- D. BERT (Bidirectional Encoder Representations from Transformers)

**Đáp án đúng:** **C. Diffusion Models**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"sinh ảnh từ câu mô tả văn bản (Text-to-Image)"*.
- **Diffusion Models** (mô hình khuếch tán) là kiến trúc tiên tiến và tiêu chuẩn công nghiệp hiện nay cho các bài toán sinh ảnh từ văn bản (ví dụ: Stable Diffusion, Amazon Titan Image Generator). Chúng hoạt động bằng cách học quy trình khử nhiễu ngược để tạo ra các điểm ảnh có độ phân giải cao và chân thực.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (RNN):** RNN là mạng nơ-ron hồi quy cổ điển dùng để xử lý dữ liệu chuỗi tuần tự thời gian (như âm thanh hoặc text một chiều), không dùng để tạo ảnh chất lượng cao.
- **Loại B (CNN thuần túy):** CNN chủ yếu dùng để phân tích và trích xuất đặc trưng từ ảnh có sẵn (phân loại ảnh, phát hiện vật thể), không phải là kiến trúc hiện đại hàng đầu cho bài toán Text-to-Image thế hệ mới.
- **Loại D (BERT):** BERT là kiến trúc Transformer dạng Encoder-only, chuyên biệt cho việc hiểu ngôn ngữ tự nhiên và phân tích văn bản, hoàn toàn không có khả năng sinh ảnh.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Nhớ nhanh các cặp kiến trúc & tác vụ:
  - Sinh ảnh từ văn bản $\rightarrow$ **Diffusion Models**.
  - Xử lý chuỗi ngôn ngữ song song $\rightarrow$ **Transformers**.
  - Nhận diện phân loại vật thể trong ảnh $\rightarrow$ **CNNs**.

---

### Question 3
Một công ty bảo hiểm đang xem xét lựa chọn giữa việc sử dụng Foundation Model có sẵn (Pre-trained FM) và việc tự xây dựng/tinh chỉnh mô hình (Fine-Tuned Model). Đâu là trường hợp mà công ty **BẮT BUỘC** hoặc **NÊN** lựa chọn Fine-Tuning thay vì chỉ dùng Prompt Engineering với Pre-trained FM?
- A. Khi công ty muốn cập nhật thông tin giá trị cổ phiếu thay đổi từng phút.
- B. Khi công ty muốn mô hình xuất kết quả tuân thủ nghiêm ngặt theo một cấu trúc JSON độc quyền và phong cách thuật ngữ y khoa đặc thù không phổ biến.
- C. Khi công ty muốn trả lời câu hỏi chung về kiến thức thế giới từ Wikipedia.
- D. Khi công ty muốn tối thiểu hóa chi phí hạ tầng và không có dữ liệu gán nhãn nào.

**Đáp án đúng:** **B. Khi công ty muốn mô hình xuất kết quả tuân thủ nghiêm ngặt theo một cấu trúc JSON độc quyền và phong cách thuật ngữ y khoa đặc thù không phổ biến.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Mục đích chuẩn của **Fine-Tuning**: Điều chỉnh **phong cách (Style/Tone)**, cấu trúc cú pháp đầu ra chuyên biệt (như định dạng JSON nội bộ nghiêm ngặt) và làm quen với bộ từ vựng chuyên ngành sâu. Fine-Tuning dạy cho mô hình "cách hành xử và định dạng" tốt hơn nhiều so với việc cố gắng mô tả dài dòng trong Prompt.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Giá cổ phiếu thay đổi từng phút):** Dữ liệu biến động từng phút là bài toán của RAG hoặc gọi API bên ngoài (Tool/Function Calling), fine-tuning không thể theo kịp tốc độ thay đổi này.
- **Loại C (Kiến thức thế giới từ Wikipedia):** Pre-trained FM đã chứa sẵn kiến thức thế giới phong phú, chỉ cần dùng Prompt Engineering là đủ.
- **Loại D (Tối thiểu hóa chi phí và không có nhãn):** Fine-tuning đòi hỏi tập dữ liệu gán nhãn chất lượng cao và phát sinh chi phí huấn luyện tính toán, hoàn toàn trái ngược với phương án D.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Gặp câu hỏi: "Khi nào cần Fine-Tuning?" $\rightarrow$ Tìm đáp án chứa các từ khóa: **"Specialized domain vocabulary"**, **"Specific output format/JSON syntax"**, **"Consistent corporate tone/style"**.

---

### Question 4
Trong quá trình thử nghiệm ứng dụng chatbot chăm sóc khách hàng dựa trên LLM, nhóm phát triển nhận thấy mô hình thường xuyên tự khẳng định công ty có chính sách "hoàn tiền 200% trong 60 ngày", mặc dù chính sách thực tế của công ty chỉ là hoàn tiền 100% trong 30 ngày. Hiện tượng này được gọi là gì và cách tiếp cận nào giúp hạn chế hiệu quả nhất?
- A. Model Drift; khắc phục bằng cách khởi động lại container ứng dụng.
- B. Catastrophic Forgetting; khắc phục bằng cách huấn luyện lại mô hình từ đầu.
- C. Hallucination; khắc phục bằng cách triển khai RAG với tài liệu chính sách chuẩn và cấu hình hạ Temperature.
- D. Data Poisoning; khắc phục bằng cách cài đặt phần mềm diệt virus trên máy chủ client.

**Đáp án đúng:** **C. Hallucination; khắc phục bằng cách triển khai RAG với tài liệu chính sách chuẩn và cấu hình hạ Temperature.**

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
Một công ty truyền thông muốn xử lý các video phỏng vấn dài 2 tiếng. Ứng dụng cần đồng thời trích xuất lời thoại thành văn bản, nhận diện các logo thương hiệu xuất hiện trên khung hình và phân loại tâm trạng của người nói qua nét mặt. Loại mô hình nền tảng nào đáp ứng tối ưu nhất cho yêu cầu này?
- A. Mô hình đơn phương thức (Single-modality Text Model)
- B. Mô hình đa phương thức (Multimodal Foundation Model)
- C. Mô hình phân cụm K-Means
- D. Mạng nơ-ron Encoder-only (như BERT)

**Đáp án đúng:** **B. Mô hình đa phương thức (Multimodal Foundation Model)**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: Xử lý đồng thời nhiều dạng dữ liệu khác nhau trong một luồng công việc: âm thanh lời thoại (Audio), hình ảnh nhận diện logo/khuôn mặt (Vision) và văn bản ngữ nghĩa (Text).
- **Mô hình đa phương thức (Multimodal FM)** là mô hình được huấn luyện để hiểu, liên kết và chuyển đổi linh hoạt giữa nhiều phương thức dữ liệu khác nhau (Text, Image, Video, Audio) trong cùng một không gian biểu diễn chung.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Single-modality Text Model):** Mô hình đơn phương thức văn bản chỉ nhận và xuất text, không thể xử lý hình ảnh khung hình video hay âm thanh.
- **Loại C (K-Means):** Thuật toán phân cụm không giám sát truyền thống, không thể xử lý đa phương thức phức tạp.
- **Loại D (BERT):** BERT chỉ là mô hình ngôn ngữ (text-only) cho tác vụ hiểu văn bản, không thể nhận diện khuôn mặt hay hình ảnh video.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ *"xử lý kết hợp text, image, video, audio"* $\rightarrow$ Luôn trỏ tới thuật ngữ **Multimodal Model**.
