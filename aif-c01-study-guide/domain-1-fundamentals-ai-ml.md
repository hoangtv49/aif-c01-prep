# Domain 1: Fundamentals of AI and Machine Learning (20%)

> Module này hệ thống hóa toàn bộ kiến thức nền tảng về AI, ML, Deep Learning, quy trình ML Lifecycle và các dịch vụ AI Managed cốt lõi của AWS (Section 1, 2, 3, 4 trong tài liệu của tác giả Vladimir Raykov).

---

## Phần 1: Trọng tâm lý thuyết & Decision Trees

### 1. Phân cấp AI vs Machine Learning vs Deep Learning
- **Trí tuệ nhân tạo (Artificial Intelligence - AI)**: Tập hợp bao quát nhất. Công nghệ mô phỏng trí thông minh của con người (nhận thức, lập luận, giải quyết vấn đề).
- **Học máy (Machine Learning - ML)**: Tập con của AI. Hệ thống tự học hỏi quy luật từ dữ liệu để đưa ra dự đoán hoặc quyết định mà không cần lập trình quy tắc cứng nhắc.
  - Công thức cốt lõi: $\text{Training Data} + \text{ML Algorithm} \rightarrow \text{Model}$.
- **Học sâu (Deep Learning - DL)**: Tập con của ML. Sử dụng **Mạng nơ-ron nhân tạo nhiều tầng (Deep Artificial Neural Networks)** mô phỏng não người để xử lý dữ liệu phi cấu trúc phức tạp (hình ảnh, âm thanh, văn bản).
  - Cấu trúc Neural Network gồm: **Input Layer** (nhận dữ liệu) $\rightarrow$ **Hidden Layers** (các tầng ẩn trích xuất đặc trưng và biến đổi toán học phi tuyến qua Hàm kích hoạt - Activation Functions) $\rightarrow$ **Output Layer** (đưa ra kết quả phân loại hoặc giá trị số).

```
+-------------------------------------------------------+
|  Artificial Intelligence (AI)                         |
|  +-------------------------------------------------+  |
|  |  Machine Learning (ML)                          |  |
|  |  +-------------------------------------------+  |  |
|  |  |  Deep Learning (DL)                       |  |  |
|  |  |  +-------------------------------------+  |  |  |
|  |  |  |  Generative AI (GenAI / FMs)        |  |  |  |
|  |  |  +-------------------------------------+  |  |  |
|  |  +-------------------------------------------+  |  |
|  +-------------------------------------------------+  |
+-------------------------------------------------------+
```

### 2. Các phương pháp học máy (Learning Paradigms)
1. **Học có giám sát (Supervised Learning)**:
   - Dữ liệu huấn luyện có nhãn (**Labeled Data** - gồm Input $X$ và Ground Truth Label $Y$).
   - Hai bài toán chính:
     - **Phân loại (Classification)**: Dự đoán nhãn rời rạc (Ví dụ: Email Spam hay Not Spam, phát hiện gian lận Yes/No, phân loại bệnh án).
     - **Hồi quy (Regression)**: Dự đoán giá trị số liên tục (Ví dụ: Dự đoán giá nhà, dự báo doanh thu, nhiệt độ ngày mai).
2. **Học không giám sát (Unsupervised Learning)**:
   - Dữ liệu không có nhãn (**Unlabeled Data**). Mô hình tự tìm kiếm cấu trúc tiềm ẩn, mẫu hình (patterns) hoặc nhóm tương đồng.
   - Các bài toán chính:
     - **Phân cụm (Clustering)**: Gom nhóm khách hàng có hành vi tương tự (K-Means).
     - **Giảm số chiều (Dimensionality Reduction)**: Nén đặc trưng nhưng giữ nguyên thông tin quan trọng (PCA).
     - **Phát hiện dị thường (Anomaly Detection)**: Tìm các điểm dữ liệu bất thường.
3. **Học tăng cường (Reinforcement Learning - RL)**:
   - Tác tử (**Agent**) tương tác với môi trường (**Environment**), thực hiện hành động (**Action**) để tối đa hóa phần thưởng tích lũy (**Cumulative Reward**) thông qua thử và sai (Trial and Error).
   - Ứng dụng: Robot tự hành, điều phối kho hàng, game, và RLHF trong tinh chỉnh LLM.

### 3. Vấn đề Overfitting vs Underfitting
- **Underfitting (High Bias)**: Mô hình quá đơn giản, không học được quy luật ngay trên tập huấn luyện $\rightarrow$ Sai số cao trên cả tập Training và Validation.
  - *Cách khắc phục*: Tăng độ phức tạp của mô hình, thêm đặc trưng (features), huấn luyện lâu hơn.
- **Overfitting (High Variance)**: Mô hình học vẹt (ghi nhớ cả nhiễu của tập huấn luyện) $\rightarrow$ Điểm rất cao trên tập Training nhưng dự đoán kém trên tập dữ liệu mới (Validation/Test).
  - *Cách khắc phục*: Bổ sung thêm dữ liệu huấn luyện, áp dụng Regularization, Dropout, giảm bớt đặc trưng thừa (Feature Selection), Early Stopping.

### 4. Quy trình phát triển ML (ML Lifecycle) và Amazon SageMaker
Vòng đời ML gồm 4 giai đoạn chuẩn hóa, được hỗ trợ trọn gói bởi **Amazon SageMaker**:
1. **Chuẩn bị dữ liệu (Data Preparation)**:
   - **SageMaker Data Wrangler**: Trực quan hóa, làm sạch và biến đổi dữ liệu tabular/image với hơn 300 phép biến đổi tích hợp sẵn, xuất code chỉ với vài click.
   - **SageMaker Feature Store**: Kho lưu trữ tập trung, chia sẻ và quản lý các đặc trưng (features) cho cả real-time inference và offline training.
   - **SageMaker Ground Truth**: Gán nhãn dữ liệu chất lượng cao tự động hoặc qua lực lượng lao động (human annotators).
2. **Xây dựng mô hình (Model Building & Training)**:
   - **SageMaker Studio**: Môi trường phát triển tích hợp (IDE) trên web cho toàn bộ quy trình ML.
   - **SageMaker Autopilot**: Nền tảng AutoML tự động khám phá dữ liệu, lựa chọn thuật toán tốt nhất, huấn luyện và tinh chỉnh siêu tham số (Hyperparameter Tuning).
   - **SageMaker JumpStart**: Thư viện chứa hàng trăm mô hình pre-trained nguồn mở và giải pháp mẫu (built-in algorithms), sẵn sàng triển khai ngay lập tức.
3. **Triển khai & Vận hành (Deployment & MLOps)**:
   - **SageMaker Model Registry**: Quản lý phiên bản mô hình, phê duyệt và theo dõi metadata mô hình trước khi lên Production.
   - **SageMaker Endpoints**: Triển khai dự đoán Real-time, Serverless Inference, Asynchronous Inference hoặc Batch Transform.

---

### 5. Bảng so sánh các dịch vụ AWS Core AI Managed Services

| Dịch vụ AWS | Chức năng chính | Đầu vào (Input) | Đầu ra (Output) | Tình huống đề thi đặc trưng |
| :--- | :--- | :--- | :--- | :--- |
| **Amazon Rekognition** | Computer Vision: Nhận diện vật thể, khuôn mặt, text trong ảnh, kiểm duyệt nội dung nhạy cảm. | Hình ảnh, Video (S3 / stream) | Labels, Bounding boxes, Face match, Moderation labels | Kiểm tra hình ảnh đại diện, kiểm duyệt nội dung người dùng tải lên, phát hiện người nổi tiếng. |
| **Amazon Textract** | Trích xuất văn bản có cấu trúc (bảng biểu, form, hóa đơn) bằng OCR thông minh. | File scan, PDF, ảnh chứng từ | Khóa - giá trị (Key-Value), Dữ liệu bảng (Tables), Dòng văn bản | Trích xuất thông tin hóa đơn tài chính, hồ sơ bảo hiểm, form biểu mẫu có kẻ khung. |
| **Amazon Comprehend** | Xử lý ngôn ngữ tự nhiên (NLP): Phân tích cảm xúc, trích xuất thực thể, phát hiện PII. | Văn bản phi cấu trúc (Text) | Sentiment (Positive/Negative), Entities, Key phrases, PII tags | Phân tích đánh giá của khách hàng, gắn nhãn email khiếu nại, phát hiện số thẻ tín dụng trong văn bản. |
| **Amazon Translate** | Dịch thuật máy móc thần kinh (Neural Machine Translation) đa ngôn ngữ. | Văn bản nguồn | Văn bản dịch chuẩn xác | Bản địa hóa website theo thời gian thực, dịch tài liệu sang ngôn ngữ khác. |
| **Amazon Polly** | Chuyển văn bản thành giọng nói tự nhiên (Text-to-Speech - TTS) với giọng đọc sống động. | Văn bản, SSML | File âm thanh (MP3, OGG, PCM) | Đọc báo tự động cho người khiếm thị, tạo giọng thuyết minh cho video đào tạo. |
| **Amazon Transcribe** | Chuyển giọng nói thành văn bản (Speech-to-Text - STT) hỗ trợ nhận diện từng người nói. | File âm thanh cuộc gọi, Audio stream | Văn bản kèm timestamp, nhãn người nói (speaker diarization) | Ghi biên bản cuộc họp, chép lời cuộc gọi tổng đài chăm sóc khách hàng. |
| **Amazon Lex** | Xây dựng giao diện đàm thoại (Conversational AI - Chatbot & Voicebot) theo kịch bản. | Tin nhắn văn bản, Giọng nói | Phản hồi tương tác, Slot values, Intent fulfillment | Xây dựng bot đặt vé xem phim, bot tra cứu số dư tài khoản ngân hàng theo luồng cố định. |
| **Amazon Personalize** | Công cụ gợi ý cá nhân hóa (Recommendation engine) theo thời gian thực dựa trên hành vi người dùng. | Lịch sử tương tác, Dữ liệu người dùng, Danh mục sản phẩm | Danh sách sản phẩm/nội dung gợi ý xếp hạng | Gợi ý sản phẩm nên mua tiếp theo trên sàn thương mại điện tử, gợi ý phim tương tự trên app streaming. |
| **Amazon Forecast** | Dự báo chuỗi thời gian (Time-series forecasting) kết hợp dữ liệu lịch sử và yếu tố ngoại cảnh. | Dữ liệu thời gian chuỗi (CSV/S3), yếu tố thời tiết/ngày lễ | Dự báo giá trị tương lai theo các phân vị (P10, P50, P90) | Dự báo nhu cầu tồn kho hàng hóa, dự báo nhu cầu năng lượng điện của thành phố. |
| **Amazon Fraud Detector** | Nền tảng tự động phát hiện các hành vi gian lận trực tuyến tiềm ẩn bằng học máy. | Dữ liệu giao dịch, IP, Thiết bị, Email | Điểm số rủi ro (Risk score), Kết quả quy tắc (Rule outcomes) | Phát hiện tạo tài khoản giả mạo, thanh toán bằng thẻ tín dụng bị đánh cắp. |

---

## Phần 2: Bảng khái niệm chuẩn ASD-STE100

| Term (Thuật ngữ) | ASD-STE100 Definition (English) | Exam Trigger Keywords | Chú giải thực tế (Tiếng Việt) |
| :--- | :--- | :--- | :--- |
| **Artificial Intelligence** | Artificial intelligence is technology that mimics human thinking. It solves problems and makes decisions. | Mimics human cognitive functions, reasoning, problem solving. | Hệ thống công nghệ mô phỏng nhận thức và khả năng ra quyết định của con người. |
| **Machine Learning** | Machine learning is a part of AI. Computers learn patterns from data to make predictions without direct rules. | Learns from data, statistical models, predictive analytics. | Tập con của AI, hệ thống tự học từ dữ liệu để đưa ra dự đoán mà không cần hard-code luật. |
| **Deep Learning** | Deep learning uses neural networks with many layers. It extracts features from complex and unstructured data. | Multi-layer neural networks, unstructured data, feature extraction. | Tập con của ML dùng mạng nơ-ron nhiều tầng để xử lý dữ liệu phức tạp như ảnh, âm thanh. |
| **Supervised Learning** | Supervised learning trains a model with labeled data. The model learns inputs to produce known outputs. | Labeled training data, ground truth, input-output mapping. | Phương pháp huấn luyện có nhãn đầu vào và đầu ra rõ ràng. |
| **Classification** | Classification predicts discrete category labels for data. For example, it identifies spam emails. | Discrete labels, categories, fraud detection, spam filter. | Bài toán dự đoán nhãn danh mục rời rạc (Ví dụ: Email Spam hay Không Spam). |
| **Regression** | Regression predicts continuous numerical values. For example, it predicts house prices from features. | Continuous numeric output, house price prediction, forecasting. | Bài toán dự đoán một giá trị số thực liên tục (Ví dụ: Giá nhà, nhiệt độ). |
| **Unsupervised Learning** | Unsupervised learning finds hidden patterns in unlabeled data. It groups similar items together. | Unlabeled data, discover patterns, customer segmentation. | Phương pháp tìm cấu trúc tiềm ẩn trong dữ liệu không được gắn nhãn trước. |
| **Clustering** | Clustering groups similar data points together without labels. It separates different groups. | Grouping similar items, K-Means, market segmentation. | Kỹ thuật gom nhóm các điểm dữ liệu có đặc tính tương đồng (phân khúc thị trường). |
| **Overfitting** | Overfitting occurs when a model learns training noise. The model performs poorly on new data. | High variance, memorizing noise, poor generalization. | Hiện tượng mô hình học vẹt cả nhiễu, kiểm tra dữ liệu huấn luyện rất cao nhưng dữ liệu thực tế rất tệ. |
| **Underfitting** | Underfitting occurs when a model is too simple. The model fails to capture data patterns. | High bias, overly simple model, poor training accuracy. | Hiện tượng mô hình quá đơn giản, không học được quy luật cơ bản của dữ liệu. |
| **Amazon SageMaker** | Amazon SageMaker is a managed service to prepare, build, train, and deploy machine learning models. | Fully managed ML service, build train deploy, end-to-end MLOps. | Nền tảng quản lý toàn diện giúp xây dựng, huấn luyện và triển khai mô hình ML. |
| **SageMaker Data Wrangler** | SageMaker Data Wrangler prepares and transforms tabular and image data. It exports data preparation workflows. | Clean tabular data, visual transformation, feature engineering. | Công cụ giao diện trực quan giúp làm sạch và biến đổi dữ liệu nhanh chóng. |
| **SageMaker Autopilot** | SageMaker Autopilot automates algorithm selection, model training, and hyperparameter tuning. | AutoML, automatic model selection, explainable code generation. | Công cụ tự động hóa toàn bộ quy trình lựa chọn thuật toán và huấn luyện mô hình (AutoML). |
| **Amazon Rekognition** | Amazon Rekognition analyzes images and videos. It detects objects, faces, text, and unsafe content. | Computer vision, facial analysis, object detection, content moderation. | Dịch vụ thị giác máy tính nhận diện khuôn mặt, vật thể và kiểm duyệt ảnh/video. |
| **Amazon Textract** | Amazon Textract extracts printed text, forms, and tables from scanned documents automatically. | Optical character recognition, tables, key-value pairs, PDF forms. | Dịch vụ OCR thông minh giữ nguyên cấu trúc bảng biểu và form dữ liệu từ tài liệu scan. |
| **Amazon Comprehend** | Amazon Comprehend uses natural language processing to extract insights, sentiments, and entities from text. | NLP, sentiment analysis, entity detection, PII extraction. | Dịch vụ phân tích ngôn ngữ tự nhiên, đo lường cảm xúc và phát hiện thông tin PII. |
| **Amazon Transcribe** | Amazon Transcribe converts speech audio into accurate text transcripts automatically. | Speech-to-text, audio files, speaker diarization, call analytics. | Dịch vụ chuyển đổi giọng nói thành văn bản, phân biệt người nói trong cuộc gọi. |
| **Amazon Polly** | Amazon Polly converts written text into lifelike speech in multiple languages. | Text-to-speech, lifelike voices, SSML, audio output. | Dịch vụ chuyển văn bản thành giọng đọc tự nhiên đa ngôn ngữ. |
| **Amazon Lex** | Amazon Lex builds conversational interfaces with voice and text for applications. | Conversational AI, chatbots, intents, utterances, slots. | Dịch vụ xây dựng chatbot và trợ lý đàm thoại tương tác hai chiều. |
| **Amazon Personalize** | Amazon Personalize generates real-time product recommendations. It uses customer interaction data to rank items. | Recommendation engine, personalized items, user ranking. | Dịch vụ gợi ý sản phẩm cá nhân hóa theo thời gian thực dựa trên lịch sử người dùng. |
| **Amazon Forecast** | Amazon Forecast delivers accurate time-series forecasts. It predicts future values with machine learning algorithms. | Time-series forecasting, future demand, inventory planning. | Dịch vụ dự báo chuỗi thời gian kết hợp học máy và dữ liệu lịch sử. |
| **Amazon Fraud Detector** | Amazon Fraud Detector identifies potentially fraudulent online activities automatically. It generates risk scores for transactions. | Online fraud detection, stolen credit cards, fake account risk. | Dịch vụ tự động phát hiện các giao dịch gian lận và đánh giá điểm rủi ro. |

---

## Phần 3: Bộ câu hỏi tình huống & Phân tích đáp án

### Question 1
Một công ty tài chính muốn xây dựng ứng dụng tự động kiểm tra chứng từ vay thế chấp. Ứng dụng cần trích xuất chính xác các trường thông tin cá nhân và dữ liệu bảng biểu từ các bản scan hợp đồng và sao kê ngân hàng định dạng PDF mà không cần lập trình thuật ngữ OCR thủ công. Dịch vụ AWS nào phù hợp nhất?
- A. Amazon Rekognition
- B. Amazon Textract
- C. Amazon Comprehend
- D. Amazon Transcribe

**Đáp án đúng:** **B. Amazon Textract**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Từ khóa quan trọng: *"trích xuất chính xác các trường thông tin và dữ liệu bảng biểu từ các bản scan hợp đồng định dạng PDF"*. 
- **Amazon Textract** là dịch vụ chuyên biệt sử dụng ML để đọc văn bản và hiểu cấu trúc tài liệu, tự động phân tích và trích xuất dữ liệu dạng bảng (Tables) và cặp khóa-giá trị (Key-Value pairs) từ tài liệu scan hoặc file PDF.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Rekognition):** Dù Rekognition có khả năng đọc một số từ ngữ xuất hiện trong ảnh (Text in Image như biển số xe, bảng hiệu), nó không hiểu ngữ nghĩa tài liệu văn bản và hoàn toàn không trích xuất được bảng biểu (tables) hay form mẫu.
- **Loại C (Amazon Comprehend):** Comprehend nhận đầu vào là văn bản phi cấu trúc đã ở dạng text để phân tích cảm xúc hoặc phát hiện thực thể, không nhận file PDF scan để trích xuất chữ.
- **Loại D (Amazon Transcribe):** Transcribe là dịch vụ chuyển đổi âm thanh giọng nói (Audio) thành văn bản (Speech-to-Text), không liên quan đến tài liệu scan.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Đề bài nhắc đến *"hình ảnh scan"* rất dễ khiến thí sinh vội vàng chọn *Amazon Rekognition*. Hãy nhớ: Nếu mục đích là đọc **tài liệu, hợp đồng, form, hóa đơn, bảng biểu** $\rightarrow$ Luôn chọn **Amazon Textract**.

---

### Question 2
Một nhóm nhà khoa học dữ liệu đang huấn luyện một mô hình học máy phân loại giao dịch gian lận. Khi đánh giá, mô hình đạt độ chính xác 99.5% trên tập dữ liệu huấn luyện (Training Set), nhưng khi kiểm thử trên tập dữ liệu kiểm tra độc lập (Test Set), độ chính xác chỉ đạt 62%. Hiện tượng này là gì và giải pháp phù hợp nhất để khắc phục là gì?
- A. Underfitting; giải pháp là tăng số lượng đặc trưng và tăng độ sâu của mô hình.
- B. Data Leakage; giải pháp là xóa bỏ hoàn toàn tập kiểm tra.
- C. Overfitting; giải pháp là bổ sung thêm dữ liệu huấn luyện hoặc áp dụng kỹ thuật Regularization.
- D. Catastrophic Forgetting; giải pháp là huấn luyện lại mô hình từ đầu.

**Đáp án đúng:** **C. Overfitting; giải pháp là bổ sung thêm dữ liệu huấn luyện hoặc áp dụng kỹ thuật Regularization.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Tình trạng: Điểm số cực cao trên tập huấn luyện (99.5%) nhưng sụt giảm nghiêm trọng trên tập kiểm tra thực tế (62%). Đây là định nghĩa điển hình của hiện tượng **Overfitting (High Variance)** - mô hình ghi nhớ vẹt các chi tiết và nhiễu của tập huấn luyện thay vì học quy luật tổng quát.
- Các biện pháp khắc phục Overfitting tiêu chuẩn: Tăng kích thước tập dữ liệu huấn luyện, Regularization (L1/L2), Dropout, giảm bớt đặc trưng không cần thiết, hoặc Early Stopping.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Underfitting):** Underfitting xảy ra khi mô hình quá đơn giản và có kết quả thấp ngay trên chính tập huấn luyện. Đề bài cho thấy kết quả tập huấn luyện đạt tới 99.5%, nên không thể là underfitting.
- **Loại B (Data Leakage):** Xóa tập kiểm tra là phi lý, vì tập kiểm tra là bắt buộc để đánh giá tính tổng quát hóa của mô hình.
- **Loại D (Catastrophic Forgetting):** Đây là hiện tượng mô hình quên tri thức cũ khi fine-tuning tri thức mới trong học liên tục (thường gặp ở Neural Networks/LLM), không phản ánh mối tương quan sai số giữa Training Set và Test Set trong bài toán phân loại chuẩn.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Phân biệt nhanh: 
  - Train Thấp + Test Thấp $\rightarrow$ **Underfitting**.
  - Train Rất Cao + Test Thấp $\rightarrow$ **Overfitting**.

---

### Question 3
Một công ty thương mại điện tử muốn phân tích hàng triệu bình luận của khách hàng trên website để tự động xác định xem phản hồi là tích cực (positive) hay tiêu cực (negative), đồng thời tự động phát hiện số điện thoại và email cá nhân có trong bình luận để tuân thủ chính sách bảo mật. Nhóm phát triển không có kinh nghiệm về ML và muốn triển khai nhanh nhất. Dịch vụ AWS nào đáp ứng tốt nhất?
- A. Amazon Lex
- B. Amazon Comprehend
- C. Amazon Polly
- D. Amazon SageMaker JumpStart

**Đáp án đúng:** **B. Amazon Comprehend**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"xác định phản hồi tích cực/tiêu cực (Sentiment Analysis)"* + *"phát hiện số điện thoại, email cá nhân (PII detection)"* + *"không có kinh nghiệm ML, triển khai nhanh nhất"*.
- **Amazon Comprehend** là dịch vụ NLP được quản lý hoàn toàn (fully managed), cung cấp sẵn các API phân tích cảm xúc (Sentiment Analysis) và phát hiện/che giấu dữ liệu định danh cá nhân (PII Detection) mà không cần người dùng phải tự huấn luyện hay quản lý máy chủ.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Lex):** Lex dùng để thiết kế luồng đàm thoại cho chatbot/voicebot theo dạng câu hỏi - trả lời có cấu trúc, không phải dịch vụ chuyên trách phân tích cảm xúc hàng loạt cho dữ liệu văn bản tĩnh.
- **Loại C (Amazon Polly):** Polly là dịch vụ chuyển đổi văn bản thành giọng nói (Text-to-Speech), không có chức năng phân tích văn bản.
- **Loại D (SageMaker JumpStart):** JumpStart yêu cầu kỹ năng cấu hình hạ tầng ML (chọn instance, deploy endpoint), tốn công sức vận hành và chi phí cao hơn nhiều so với việc gọi thẳng API của Comprehend.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Đề bài xuất hiện cụm từ *"không có kinh nghiệm về ML"* (no ML experience) là dấu hiệu rõ ràng để chọn các dịch vụ **AWS AI Managed Services** (như Comprehend, Rekognition, Textract) thay vì các dịch vụ thuộc bộ công cụ **Amazon SageMaker**.

---

### Question 4
Bộ phận chăm sóc khách hàng của một ngân hàng ghi âm hàng nghìn cuộc gọi mỗi ngày. Ngân hàng muốn chuyển đổi các tệp âm thanh này thành văn bản có gắn thẻ thời gian (timestamp) và nhận diện rõ đâu là lời nói của khách hàng, đâu là lời nói của nhân viên tổng đài. Sau đó, văn bản này sẽ được chuyển thành giọng nói mới để làm mẫu đào tạo nhân viên. Hai dịch vụ AWS nào cần được kết hợp? (Chọn HAI)
- A. Amazon Polly
- B. Amazon Transcribe
- C. Amazon Translate
- D. Amazon Rekognition
- E. AWS Glue

**Đáp án đúng:** **A. Amazon Polly** và **B. Amazon Transcribe**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu 1: Chuyển đổi âm thanh cuộc gọi thành văn bản kèm timestamp và nhận diện từng người nói (Speaker Diarization) $\rightarrow$ Dịch vụ chính xác là **Amazon Transcribe**.
- Yêu cầu 2: Chuyển đổi văn bản thành giọng nói nhân tạo để làm tài liệu đào tạo $\rightarrow$ Dịch vụ chính xác là **Amazon Polly**.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại C (Amazon Translate):** Translate dùng để dịch ngôn ngữ này sang ngôn ngữ khác, bài toán không có yêu cầu dịch thuật.
- **Loại D (Amazon Rekognition):** Rekognition là dịch vụ thị giác máy tính (Computer Vision), không xử lý âm thanh hay giọng nói.
- **Loại E (AWS Glue):** Dịch vụ ETL tích hợp dữ liệu, không có tính năng xử lý giọng nói thành chữ.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Thí sinh rất hay nhầm lẫn giữa **Amazon Polly** và **Amazon Transcribe**:
  - **Audio $\rightarrow$ Text**: Transcribe (Ghi âm thành chữ).
  - **Text $\rightarrow$ Audio**: Polly (Văn bản thành giọng nói).

---

### Question 5
Một doanh nghiệp bán lẻ muốn nhóm các khách hàng của mình thành các tập hợp có hành vi mua sắm tương đồng mà không có bất kỳ nhãn dữ liệu phân loại nào được định nghĩa từ trước. Sau đó, họ muốn dự báo doanh số bán hàng trong 6 tháng tới dựa trên dữ liệu doanh thu quá khứ. Hai bài toán học máy tương ứng với hai mục tiêu này là gì?
- A. Học có giám sát (Hồi quy) cho mục tiêu 1; Học không giám sát (Phân cụm) cho mục tiêu 2.
- B. Học không giám sát (Phân loại) cho mục tiêu 1; Học tăng cường cho mục tiêu 2.
- C. Học không giám sát (Phân cụm) cho mục tiêu 1; Học có giám sát (Hồi quy) cho mục tiêu 2.
- D. Học có giám sát (Phân loại) cho mục tiêu 1; Học có giám sát (Phân cụm) cho mục tiêu 2.

**Đáp án đúng:** **C. Học không giám sát (Phân cụm) cho mục tiêu 1; Học có giám sát (Hồi quy) cho mục tiêu 2.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Mục tiêu 1: *"Nhóm khách hàng thành các tập hợp tương đồng mà không có nhãn trước"* $\rightarrow$ Đây là bài toán **Phân cụm (Clustering)**, thuộc nhánh **Học không giám sát (Unsupervised Learning)**.
- Mục tiêu 2: *"Dự báo giá trị doanh số bán hàng (giá trị số thực liên tục) trong tương lai từ dữ liệu quá khứ"* $\rightarrow$ Đây là bài toán **Hồi quy (Regression)**, thuộc nhánh **Học có giám sát (Supervised Learning)**.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A:** Đảo ngược thứ tự hai phương pháp so với mục tiêu đề bài.
- **Loại B:** Phân loại là bài toán có giám sát (cần nhãn); Dự báo doanh thu không phải bài toán Học tăng cường (Reinforcement Learning).
- **Loại D:** Phân cụm là bài toán không giám sát, không bao giờ là bài toán có giám sát.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cần ghi nhớ bản chất bài toán:
  - Dự đoán nhãn rời rạc (Spam / Non-spam, Fraud / Valid) $\rightarrow$ Classification (Supervised).
  - Dự đoán con số liên tục (Doanh thu, Giá nhà, Nhiệt độ) $\rightarrow$ Regression (Supervised).
  - Tự động gom nhóm dựa trên đặc tính tương đồng không nhãn $\rightarrow$ Clustering (Unsupervised).
