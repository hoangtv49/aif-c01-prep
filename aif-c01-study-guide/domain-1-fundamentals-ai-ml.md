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
A financial services company wants to automate its mortgage application processing. The company needs to accurately extract personal customer information and tabular data from scanned PDF contracts and bank statements without developing custom OCR models. Which AWS service should the company use?
- A. Amazon Rekognition
- B. Amazon Textract
- C. Amazon Comprehend
- D. Amazon Transcribe

**Đáp án đúng:** **B. Amazon Textract**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Từ khóa quan trọng: *"extract personal customer information and tabular data from scanned PDF contracts"* (trích xuất dữ liệu bảng biểu từ tài liệu scan PDF). 
- **Amazon Textract** là dịch vụ chuyên biệt sử dụng ML để đọc văn bản và hiểu cấu trúc tài liệu, tự động phân tích và trích xuất dữ liệu dạng bảng (Tables) và cặp khóa-giá trị (Key-Value pairs) từ tài liệu scan hoặc file PDF.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Rekognition):** Dù Rekognition có khả năng đọc một số từ ngữ xuất hiện trong ảnh (Text in Image như biển số xe, bảng hiệu), nó không hiểu ngữ nghĩa tài liệu văn bản và hoàn toàn không trích xuất được bảng biểu (tables) hay form mẫu.
- **Loại C (Amazon Comprehend):** Comprehend nhận đầu vào là văn bản phi cấu trúc đã ở dạng text để phân tích cảm xúc hoặc phát hiện thực thể, không nhận file PDF scan để trích xuất chữ.
- **Loại D (Amazon Transcribe):** Transcribe là dịch vụ chuyển đổi âm thanh giọng nói (Audio) thành văn bản (Speech-to-Text), không liên quan đến tài liệu scan.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Đề bài nhắc đến *"hình ảnh scan"* rất dễ khiến thí sinh vội vàng chọn *Amazon Rekognition*. Hãy nhớ: Nếu mục đích là đọc **tài liệu, hợp đồng, form, hóa đơn, bảng biểu** $\rightarrow$ Luôn chọn **Amazon Textract**.

---

### Question 2
A data science team trains a machine learning model to detect fraudulent transactions. During evaluation, the model achieves 99.5% accuracy on the training set, but only 62.0% accuracy on the independent test set. Which phenomenon is occurring, and what is the best technique to mitigate it?
- A. Underfitting; the team should increase model complexity and add more features.
- B. Data Leakage; the team should completely delete the test dataset.
- C. Overfitting; the team should collect more training data or apply regularization techniques.
- D. Catastrophic Forgetting; the team should retrain the base model from scratch.

**Đáp án đúng:** **C. Overfitting; the team should collect more training data or apply regularization techniques.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Tình trạng: Điểm số cực cao trên tập huấn luyện (99.5%) nhưng sụt giảm nghiêm trọng trên tập kiểm tra thực tế (62.0%). Đây là định nghĩa điển hình của hiện tượng **Overfitting (High Variance)** - mô hình ghi nhớ vẹt các chi tiết và nhiễu của tập huấn luyện thay vì học quy luật tổng quát.
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
An e-commerce company wants to analyze millions of customer reviews on its website to automatically classify feedback as positive or negative, and detect phone numbers and email addresses to protect customer privacy. The development team has no prior machine learning experience and requires the fastest implementation. Which AWS service best meets these requirements?
- A. Amazon Lex
- B. Amazon Comprehend
- C. Amazon Polly
- D. Amazon SageMaker JumpStart

**Đáp án đúng:** **B. Amazon Comprehend**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"classify feedback as positive or negative (Sentiment Analysis)"* + *"detect phone numbers and email addresses (PII detection)"* + *"no prior machine learning experience, fastest implementation"*.
- **Amazon Comprehend** là dịch vụ NLP được quản lý hoàn toàn (fully managed), cung cấp sẵn các API phân tích cảm xúc (Sentiment Analysis) và phát hiện/che giấu dữ liệu định danh cá nhân (PII Detection) mà không cần người dùng phải tự huấn luyện hay quản lý máy chủ.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Lex):** Lex dùng để thiết kế luồng đàm thoại cho chatbot/voicebot theo dạng câu hỏi - trả lời có cấu trúc, không phải dịch vụ chuyên trách phân tích cảm xúc hàng loạt cho dữ liệu văn bản tĩnh.
- **Loại C (Amazon Polly):** Polly là dịch vụ chuyển đổi văn bản thành giọng nói (Text-to-Speech), không có chức năng phân tích văn bản.
- **Loại D (SageMaker JumpStart):** JumpStart yêu cầu kỹ năng cấu hình hạ tầng ML (chọn instance, deploy endpoint), tốn công sức vận hành và chi phí cao hơn nhiều so với việc gọi thẳng API của Comprehend.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Đề bài xuất hiện cụm từ *"no prior machine learning experience"* (không có kinh nghiệm ML) là dấu hiệu rõ ràng để chọn các dịch vụ **AWS AI Managed Services** (như Comprehend, Rekognition, Textract) thay vì các dịch vụ thuộc bộ công cụ **Amazon SageMaker**.

---

### Question 4
A retail bank records thousands of customer service calls daily. The bank wants to convert these recorded audio files into timestamped text transcripts that distinguish between the customer and the customer service representative. Afterwards, the bank wants to convert sample response scripts into synthetic speech for training. Which TWO AWS services should be combined? (Select TWO)
- A. Amazon Polly
- B. Amazon Transcribe
- C. Amazon Translate
- D. Amazon Rekognition
- E. AWS Glue

**Đáp án đúng:** **A. Amazon Polly** và **B. Amazon Transcribe**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu 1: Chuyển đổi âm thanh cuộc gọi thành văn bản kèm timestamp và nhận diện từng người nói (*"distinguish between customer and representative"* - Speaker Diarization) $\rightarrow$ Dịch vụ chính xác là **Amazon Transcribe**.
- Yêu cầu 2: Chuyển đổi kịch bản văn bản thành giọng nói nhân tạo (*"convert scripts into synthetic speech"*) $\rightarrow$ Dịch vụ chính xác là **Amazon Polly**.

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
A retail enterprise wants to group customers into segments based on similar purchasing patterns without using any pre-existing categorical labels. In addition, the enterprise needs to predict future sales revenue for the next 6 months based on historical revenue data. Which machine learning paradigms correspond to these two business objectives?
- A. Supervised Learning (Regression) for objective 1; Unsupervised Learning (Clustering) for objective 2.
- B. Unsupervised Learning (Classification) for objective 1; Reinforcement Learning for objective 2.
- C. Unsupervised Learning (Clustering) for objective 1; Supervised Learning (Regression) for objective 2.
- D. Supervised Learning (Classification) for objective 1; Supervised Learning (Clustering) for objective 2.

**Đáp án đúng:** **C. Unsupervised Learning (Clustering) cho mục tiêu 1; Supervised Learning (Regression) cho mục tiêu 2.**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Mục tiêu 1: *"Group customers into segments without pre-existing labels"* $\rightarrow$ Đây là bài toán **Phân cụm (Clustering)**, thuộc nhánh **Học không giám sát (Unsupervised Learning)**.
- Mục tiêu 2: *"Predict future sales revenue (continuous value) based on historical revenue"* $\rightarrow$ Đây là bài toán **Hồi quy (Regression)**, thuộc nhánh **Học có giám sát (Supervised Learning)**.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A:** Đảo ngược thứ tự hai phương pháp so với mục tiêu đề bài.
- **Loại B:** Classification là bài toán có giám sát (cần nhãn); Dự báo doanh thu không phải bài toán Reinforcement Learning.
- **Loại D:** Clustering là bài toán không giám sát, không bao giờ là bài toán có giám sát.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cần ghi nhớ bản chất bài toán trong đề tiếng Anh:
  - Dự đoán nhãn danh mục rời rạc $\rightarrow$ **Classification (Supervised)**.
  - Dự đoán con số liên tục $\rightarrow$ **Regression (Supervised)**.
  - Gom nhóm dữ liệu không nhãn $\rightarrow$ **Clustering (Unsupervised)**.

---

### Question 6
A healthcare company is training a machine learning classification model to detect early-stage malignant tumors in medical imaging. The cost of failing to identify a patient with a malignant tumor (a false negative) is catastrophic, whereas referring a healthy patient for further screening (a false positive) incurs only minimal inconvenience. Which evaluation metric should the data science team optimize to minimize false negatives?
- A. Precision
- B. Recall
- C. Accuracy
- D. Specificity

**Đáp án đúng:** **B. Recall**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Tình huống: Chi phí của việc bỏ sót ca bệnh (False Negative - dự đoán Không bệnh trong khi Thực tế Có bệnh) là thảm họa.
- **Recall (Sensitivity / True Positive Rate)** đo lường tỷ lệ các ca thực sự dương tính được mô hình phát hiện chính xác: $\text{Recall} = \frac{TP}{TP + FN}$. Khi tối ưu hóa **Recall**, số lượng ca bỏ sót (FN) sẽ được kéo xuống mức thấp nhất có thể.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Precision):** Precision đo lường trong số những ca mô hình dự đoán là Có bệnh thì có bao nhiêu ca đúng thật: $\text{Precision} = \frac{TP}{TP + FP}$. Tối ưu Precision giúp giảm thiểu báo động giả (False Positives), phù hợp cho bài toán lọc spam hoặc chặn thẻ tín dụng nhầm, nhưng sẽ làm tăng nguy cơ bỏ sót ca bệnh (tăng FN).
- **Loại C (Accuracy):** Accuracy đo tỷ lệ dự đoán đúng trên toàn bộ mẫu, dễ bị đánh lừa khi dữ liệu mất cân bằng (ví dụ 99% người không mắc bệnh thì đoán tất cả không bệnh vẫn đạt 99% accuracy).
- **Loại D (Specificity):** Đo lường tỷ lệ các ca âm tính thật được dự đoán đúng (True Negative Rate), không tập trung vào việc giảm thiểu False Negatives ở nhóm người mắc bệnh.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Quy tắc vàng trong đề thi AIF-C01:
  - Bỏ sót ca bệnh / gian lận gây hậu quả nghiêm trọng (**Minimize False Negatives**) $\rightarrow$ Chọn **Recall**.
  - Báo động nhầm gây phiền toái cho khách hàng (**Minimize False Positives**) $\rightarrow$ Chọn **Precision**.
  - Cần cân bằng hài hòa cả hai $\rightarrow$ Chọn **F1-Score**.

---

### Question 7
A nationwide supermarket chain wants to predict product inventory demand for 500 store locations for the upcoming holiday season. The company needs a fully managed service that uses machine learning to combine historical daily sales data with external variables such as weather forecasts and holiday promotional calendars. Which AWS service should the company choose?
- A. Amazon Personalize
- B. Amazon Forecast
- C. Amazon Polly
- D. Amazon Rekognition

**Đáp án đúng:** **B. Amazon Forecast**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"predict product inventory demand over time"* + *"combines historical time-series data with external variables (weather, holidays)"*.
- **Amazon Forecast** là dịch vụ dự báo chuỗi thời gian (Time-series forecasting) được quản lý hoàn toàn, tự động áp dụng các thuật toán ML tiên tiến để dự báo nhu cầu hàng hóa trong tương lai kết hợp dữ liệu lịch sử và các yếu tố ngoại cảnh.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Personalize):** Personalize dùng để tạo hệ thống gợi ý sản phẩm cho từng cá nhân người dùng (Recommendation engine), không phải dịch vụ dự báo số lượng tồn kho theo chuỗi thời gian.
- **Loại C (Amazon Polly):** Chuyển văn bản thành giọng nói (Text-to-Speech).
- **Loại D (Amazon Rekognition):** Dịch vụ thị giác máy tính nhận diện hình ảnh/video.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"Predict inventory demand / financial time-series forecasting"* $\rightarrow$ Luôn chọn **Amazon Forecast**.

---

### Question 8
An online streaming platform wants to provide personalized movie and television show recommendations to users on its homepage in real time based on user watch history, ratings, and clickstream interactions. The development team wants to deploy a recommendation engine quickly without building custom collaborative filtering algorithms from scratch. Which AWS service provides this functionality?
- A. Amazon Personalize
- B. Amazon Forecast
- C. Amazon Comprehend
- D. AWS Glue DataBrew

**Đáp án đúng:** **A. Amazon Personalize**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"personalized recommendations to users in real time based on clickstream, watch history, and ratings"*.
- **Amazon Personalize** cho phép các nhà phát triển nhanh chóng xây dựng tính năng cá nhân hóa trải nghiệm người dùng theo thời gian thực (User Recommendations, Similar Items, Personalized Ranking) bằng công nghệ học máy được kế thừa từ Amazon.com.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại B (Amazon Forecast):** Dùng cho bài toán dự báo nhu cầu tương lai theo chuỗi thời gian (như tồn kho, doanh thu), không phải gợi ý sở thích cho từng người dùng.
- **Loại C (Amazon Comprehend):** Dịch vụ xử lý ngôn ngữ tự nhiên (NLP) phân tích cảm xúc văn bản, không phải công cụ gợi ý nội dung.
- **Loại D (AWS Glue DataBrew):** Công cụ làm sạch và chuẩn bị dữ liệu bằng giao diện trực quan, không phải mô hình ML gợi ý sản phẩm.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"Personalized product recommendations / Similar items ranking"* $\rightarrow$ Luôn chọn **Amazon Personalize**.

---

### Question 9
A fintech payment processor wants to evaluate online credit card transactions in real time to detect fraudulent activities such as stolen credit card usage and account takeover attempts. The company wants to use machine learning models customized to its own transaction data alongside proven fraud detection techniques developed by AWS and Amazon.com. Which AWS service is designed specifically for this use case?
- A. Amazon Inspector
- B. Amazon Fraud Detector
- C. AWS Shield Advanced
- D. AWS WAF

**Đáp án đúng:** **B. Amazon Fraud Detector**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu bài toán: *"evaluate transactions in real time to detect fraudulent activities (stolen cards, account takeovers)"*.
- **Amazon Fraud Detector** là dịch vụ chuyên biệt giúp doanh nghiệp xây dựng, huấn luyện và triển khai các mô hình phát hiện gian lận giao dịch trực tuyến nhanh chóng dựa trên kinh nghiệm thực tế của Amazon.com.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Inspector):** Dịch vụ quét lỗ hổng bảo mật hệ điều hành và container images, không phát hiện gian lận thanh toán tài chính.
- **Loại C (AWS Shield Advanced):** Dịch vụ bảo vệ chống tấn công từ chối dịch vụ (DDoS) ở tầng mạng.
- **Loại D (AWS WAF):** Tường lửa web lọc traffic HTTP độc hại (SQL Injection, XSS), không phân tích hành vi gian lận thẻ tín dụng của khách hàng.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"Detect online payment fraud, stolen credit cards, fake account registrations"* $\rightarrow$ Luôn chọn **Amazon Fraud Detector**.

---

### Question 10
A data engineering team needs to prepare, clean, and visualize a multi-gigabyte tabular customer dataset stored in Amazon S3 for an upcoming machine learning project. The team wants to inspect data distributions, identify missing values, and apply over 300 pre-built transformations using a point-and-click visual interface before exporting the workflow as executable Python code. Which Amazon SageMaker feature should the team use?
- A. SageMaker Feature Store
- B. SageMaker Data Wrangler
- C. SageMaker Model Registry
- D. SageMaker JumpStart

**Đáp án đúng:** **B. SageMaker Data Wrangler**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Yêu cầu: *"prepare, clean, and visualize tabular dataset"*, *"point-and-click visual interface with 300+ pre-built transformations"*, *"export workflow as code"*.
- **Amazon SageMaker Data Wrangler** là tính năng trong SageMaker Studio giúp giảm thời gian làm sạch và chuẩn bị dữ liệu từ nhiều tuần xuống vài phút nhờ giao diện trực quan và thư viện biến đổi dữ liệu đồ sộ.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (SageMaker Feature Store):** Kho lưu trữ tập trung để quản lý và tái sử dụng các đặc trưng (features) cho training và inference, không phải công cụ làm sạch dữ liệu trực quan.
- **Loại C (SageMaker Model Registry):** Quản lý phiên bản và quy trình phê duyệt mô hình ML trước khi triển khai production.
- **Loại D (SageMaker JumpStart):** Kho chứa các mô hình pre-trained và giải pháp mẫu, không dùng để làm sạch dữ liệu bảng biểu.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Cụm từ trong đề tiếng Anh: *"Visual point-and-click data preparation with 300+ transformations"* $\rightarrow$ Luôn chọn **SageMaker Data Wrangler**.

---

### Question 11
An e-commerce company wants to build a solution to determine customer sentiment based on written customer product reviews. The company wants to evaluate both pre-trained natural language processing services and generative AI foundation models. Which AWS services meet these requirements? (Choose two.)
- A. Amazon Lex
- B. Amazon Comprehend
- C. Amazon Polly
- D. Amazon Bedrock
- E. Amazon Rekognition

**Đáp án đúng:** **B. Amazon Comprehend** và **D. Amazon Bedrock**

**Lý do chọn (Root Cause & Keyword Triggers):**
- Đề bài yêu cầu: *"determine customer sentiment based on written reviews"* bằng cả *"pre-trained NLP services"* và *"generative AI foundation models"*.
- **Amazon Comprehend** là dịch vụ AI được quản lý sẵn (pre-trained NLP service) có API phân tích cảm xúc (Sentiment Analysis) chuyên dụng, trả về trực tiếp nhãn `POSITIVE`, `NEGATIVE`, `NEUTRAL` hoặc `MIXED`.
- **Amazon Bedrock** cung cấp quyền truy cập các mô hình nền tảng (LLMs như Claude, Llama, Titan) có thể thực hiện phân tích cảm xúc chi tiết thông qua câu lệnh prompt.

**Phân tích bẫy và lý do loại các phương án sai (Distractor Analysis):**
- **Loại A (Amazon Lex):** Dịch vụ xây dựng giao diện đàm thoại (chatbot theo kịch bản), không phải dịch vụ phân tích sắc thái hàng loạt cho văn bản tĩnh.
- **Loại C (Amazon Polly):** Chuyển văn bản thành giọng nói (Text-to-Speech).
- **Loại E (Amazon Rekognition):** Dịch vụ thị giác máy tính (Computer Vision), không xử lý văn bản đánh giá sản phẩm.

**Cảnh báo bẫy phòng thi (Trap Alert):**
- Câu hỏi dạng *"Choose two"* kiểm tra sự kết hợp giữa **Traditional AI Managed Services** (Comprehend) và **Generative AI Services** (Bedrock) cho cùng một bài toán NLP.
