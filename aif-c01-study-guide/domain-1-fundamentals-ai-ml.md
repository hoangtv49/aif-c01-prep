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
   - Các bài toán chính:
     - **Phân loại nhị phân (Binary Classification)**: Nhãn đầu ra chỉ có đúng 2 lựa chọn rời rạc (Ví dụ: Gian lận hay Không gian lận, Khách rời bỏ hay Ở lại, Thư rác hay Không).
     - **Phân loại đa lớp (Multi-class Classification)**: Có 3 lớp trở lên, mỗi mẫu chỉ thuộc về 1 lớp duy nhất (Ví dụ: Phân loại loại hoa Iris thành 3 loài).
     - **Phân loại đa nhãn (Multi-label Classification)**: Một mẫu có thể đồng thời mang nhiều nhãn khác nhau (Ví dụ: Bài báo vừa thuộc "Công nghệ" vừa thuộc "Tài chính").
     - **Hồi quy (Regression)**: Dự đoán giá trị số thực liên tục (Ví dụ: Dự đoán giá nhà, dự báo doanh thu, nhiệt độ ngày mai).
2. **Học không giám sát (Unsupervised Learning)**:
   - Dữ liệu không có nhãn (**Unlabeled Data**). Mô hình tự tìm kiếm cấu trúc tiềm ẩn, mẫu hình (patterns) hoặc nhóm tương đồng.
   - Các bài toán chính:
     - **Phân cụm (Clustering)**: Gom nhóm khách hàng có hành vi tương tự mà không có nhãn trước (K-Means).
     - **Giảm số chiều (Dimensionality Reduction)**: Nén đặc trưng nhưng giữ nguyên thông tin quan trọng (PCA).
     - **Phát hiện dị thường (Anomaly Detection)**: Tìm các điểm dữ liệu bất thường.
3. **Học tăng cường (Reinforcement Learning - RL)**:
   - Tác tử (**Agent**) tương tác với môi trường (**Environment**), thực hiện hành động (**Action**) để tối đa hóa phần thưởng tích lũy (**Cumulative Reward**) thông qua thử và sai (Trial and Error).
   - Ứng dụng: Robot tự hành, điều phối kho hàng, game, và RLHF trong tinh chỉnh LLM.

#### Bảng tra cứu thuật toán học máy kinh điển trong đề thi AIF-C01

| Thuật toán / Kỹ thuật | Trường phái ML | Bản chất toán học & Tình huống đề thi | Keyword nhận diện đề thi |
| :--- | :--- | :--- | :--- |
| **k-Nearest Neighbors (k-NN)** | Supervised (Classification / Regression) | Phân loại nhãn dựa trên đa số $k$ điểm lân cận gần nhất trong không gian đặc trưng. | *Predict flower species from petal measurements, instance-based learning.* |
| **Linear Regression** | Supervised (Regression) | Tìm đường thẳng/mặt phẳng tối ưu biểu diễn quan hệ tuyến tính để dự đoán giá trị số liên tục. | *Predict house price, continuous numeric value, linear relationship.* |
| **Logistic Regression** | Supervised (Classification) | Sử dụng hàm Sigmoid để ánh xạ đầu ra thành xác suất từ 0 đến 1 cho bài toán phân loại nhị phân. White-box, dễ điều chỉnh trọng số. | *Binary classification, interpretable weights, probability output.* |
| **K-Means Clustering** | Unsupervised (Clustering) | Phân chia $N$ mẫu dữ liệu thành $K$ cụm dựa trên khoảng cách tới tâm cụm (centroids). | *Group customers without labels, discover segments, unlabeled data.* |
| **ARIMA** | Time-Series Forecasting | Mô hình chuỗi thời gian thống kê cổ điển kết hợp tự hồi quy và trung bình trượt. | *Univariate time-series, historical sequence forecasting.* |
| **SageMaker DeepAR** | Time-Series (Deep Learning) | Thuật toán học sâu tích hợp sẵn của SageMaker để dự báo chuỗi thời gian đa biến phức tạp. | *Predict product demand for next weeks, multiple related time-series.* |

### 3. Vấn đề Overfitting vs Underfitting
- **Underfitting (High Bias)**: Mô hình quá đơn giản, không học được quy luật ngay trên tập huấn luyện $\rightarrow$ Sai số cao trên cả tập Training và Validation.
  - *Cách khắc phục*: Tăng độ phức tạp của mô hình, thêm đặc trưng (features), huấn luyện lâu hơn.
- **Overfitting (High Variance)**: Mô hình học vẹt (ghi nhớ cả nhiễu của tập huấn luyện) $\rightarrow$ Điểm rất cao trên tập Training nhưng dự đoán kém trên tập dữ liệu mới (Validation/Test).
  - *Cách khắc phục*: Bổ sung thêm dữ liệu huấn luyện, áp dụng Regularization, Dropout, giảm bớt đặc trưng thừa (Feature Selection), Early Stopping.

### 4. Quy trình phát triển ML chuẩn Well-Architected & Nền tảng Amazon SageMaker

Vòng đời học máy gồm 4 bước chuẩn hóa theo quy chuẩn **AWS Well-Architected ML Lens**:

```
[1. Define Goal & Frame Problem] -> [2. Develop Model] -> [3. Deploy Model] -> [4. Monitor Model]
```

1. **Bước 1: Xác định mục tiêu kinh doanh & Đóng khung bài toán ML (Define Business Goal & Frame ML Problem)**:
   - Xác định rõ tiêu chí thành công và KPI kinh doanh cần đạt được.
   - Chuyển đổi yêu cầu nghiệp vụ thành bài toán ML cụ thể (Phân loại nhị phân/đa lớp, Hồi quy, hay Phân cụm).
   - **Xác định các yêu cầu về pháp lý, bảo mật dữ liệu và tuân thủ (Compliance & Regulatory Requirements)** ngay từ bước khởi tạo đầu tiên.
2. **Bước 2: Phát triển mô hình (Develop Model)**:
   - **Thu thập & Phân tích khám phá dữ liệu (EDA - Exploratory Data Analysis)**: Tính toán thống kê mô tả (mean, median, standard deviation), lập ma trận tương quan (*correlation matrix*) và trực quan hóa phân phối dữ liệu để hiểu cấu trúc trước khi làm sạch.
   - **Tiền xử lý & Kỹ thuật đặc trưng (Data Prep & Feature Engineering)**:
     - **SageMaker Data Wrangler**: Trực quan hóa, làm sạch và biến đổi dữ liệu tabular/image với hơn 300 phép biến đổi tích hợp.
     - **Data Augmentation (Tăng cường dữ liệu)**: Tạo ra các mẫu dữ liệu mới tổng hợp từ tập dữ liệu có nhãn hạn chế để mở rộng số lượng mẫu và ngăn chặn Overfitting.
     - **SageMaker Feature Store**: Kho lưu trữ tập trung quản lý và tái sử dụng đặc trưng cho cả online inference và offline training.
     - **SageMaker Ground Truth**: Gán nhãn dữ liệu chất lượng cao có con người tham gia (Human-in-the-loop).
   - **Xây dựng, huấn luyện và tối ưu mô hình (Training & Tuning)**:
     - **SageMaker Canvas**: Giao diện trực quan kéo-thả **No-Code** dành cho **Business Analysts (không có kỹ năng lập trình)** tự xây dựng mô hình ML và dự báo nhu cầu (Demand Forecasting).
     - **SageMaker Autopilot**: Nền tảng **AutoML** tự động thử nghiệm nhiều thuật toán và siêu tham số, đồng thời **tự động sinh mã nguồn Python notebooks minh bạch** cho Data Scientists/Developers.
     - **SageMaker JumpStart**: Thư viện mô hình pre-trained nguồn mở và giải pháp mẫu (built-in algorithms) triển khai 1-click.
3. **Bước 3: Triển khai mô hình (Deploy Model)**:
   - **SageMaker Model Registry**: Quản lý phiên bản mô hình, phê duyệt và theo dõi metadata phả hệ (lineage) trước khi đưa lên Production.
   - **4 Chế độ triển khai suy luận (SageMaker Inference Modes)**:
     - **Real-Time Inference**: Endpoint trực tuyến 24/7, độ trễ mili-giây, payload $\le$ 6MB. Dành cho chatbot, web/mobile API tương tác trực tiếp.
     - **Serverless Inference**: Tự động scale về 0 khi không có lưu lượng truy cập để tiết kiệm chi phí; chấp nhận độ trễ cold start vài giây. Dành cho traffic ngắt quãng, thất thường.
     - **Asynchronous Inference**: Xếp hàng đợi qua Amazon S3/SNS, xử lý payload lớn tới 1GB và thời gian thực thi lâu (15 - 60 phút). Tự động scale instance về 0 khi hàng đợi trống. Dành cho xử lý video, ảnh phân giải cao.
     - **Batch Transform**: Xử lý ngoại tuyến (offline) trên tập dữ liệu tĩnh khổng lồ (hàng Gigabytes/Terabytes) theo lịch định kỳ (hàng ngày hoặc **cuối tuần - on weekends**). Xử lý xong tự động giải phóng tài nguyên.
4. **Bước 4: Giám sát mô hình trong môi trường Production (Monitor Model)**:
   - **SageMaker Model Monitor**: Tự động theo dõi chất lượng mô hình đang chạy trên endpoints để phát hiện sự suy giảm so với mô hình gốc:
     - *Data Drift / Data Quality Drift*: Phân phối dữ liệu thực tế đầu vào bị lệch so với dữ liệu huấn luyện cơ sở (baseline).
     - *Model Quality Drift (Concept Drift)*: Các chỉ số hiệu năng (Accuracy, F1-score) suy giảm theo thời gian.
     - *Bias Drift & Feature Attribution Drift*: Mức độ thiên vị gia tăng hoặc trọng số đóng góp của đặc trưng (SHAP) thay đổi.

### 5. Đánh giá mô hình học máy: Confusion Matrix, Precision, Recall và F1-Score

Trong các bài toán phân loại (Classification), việc lựa chọn chỉ số đánh giá là kiến thức trọng tâm của kỳ thi AIF-C01.

#### a. Ma trận nhầm lẫn (Confusion Matrix)
Ma trận 2x2 biểu diễn kết quả dự đoán của mô hình so với nhãn thực tế:
- **True Positive (TP)**: Thực tế Dương, Mô hình đoán Dương (Dự đoán đúng).
- **True Negative (TN)**: Thực tế Âm, Mô hình đoán Âm (Dự đoán đúng).
- **False Positive (FP - Lỗi Loại I / Type I Error)**: Thực tế Âm, Mô hình đoán Dương (Báo động giả / Nhầm lẫn).
- **False Negative (FN - Lỗi Loại II / Type II Error)**: Thực tế Dương, Mô hình đoán Âm (Bỏ sót nguy hiểm).

```
                 +-----------------------+-----------------------+
                 | Thực tế DƯƠNG (Pos)   | Thực tế ÂM (Neg)      |
+----------------+-----------------------+-----------------------+
| Đoán DƯƠNG (+) |  True Positive (TP)   |  False Positive (FP)  |
| Đoán ÂM (-)    |  False Negative (FN)  |  True Negative (TN)   |
+----------------+-----------------------+-----------------------+
```

#### b. Các chỉ số đo lường cốt lõi
1. **Accuracy (Độ chính xác tổng quát)**:
   - Công thức: $\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$.
   - *Hạn chế chí mạng*: Vô nghĩa khi dữ liệu **mất cân bằng lớp (Class Imbalance)**. Ví dụ: Trong 1,000 giao dịch chỉ có 5 giao dịch gian lận (0.5%), nếu mô hình luôn đoán "Không gian lận", Accuracy vẫn đạt 99.5% dù bỏ sót 100% các vụ gian lận.

2. **Precision (Độ chuẩn xác)**:
   - Công thức: $\text{Precision} = \frac{TP}{TP + FP}$.
   - *Ý nghĩa*: Trong tất cả các trường hợp mô hình dự đoán là Dương tính, có bao nhiêu trường hợp thực sự đúng?
   - *Mục tiêu*: **Giảm thiểu False Positives (FP)** (Hạn chế tối đa việc báo động giả).
   - *Tình huống đề thi*: Khi việc "báo nhầm" gây phiền hà hoặc tổn thất cho người dùng. Ví dụ: Bộ lọc thư rác (Spam Filter - không được đánh dấu nhầm email quan trọng thành spam); Khóa tài khoản ngân hàng nhầm của khách hàng VIP.

3. **Recall / Sensitivity (Độ nhạy / Tỷ lệ phát hiện)**:
   - Công thức: $\text{Recall} = \frac{TP}{TP + FN}$.
   - *Ý nghĩa*: Trong tất cả các trường hợp thực tế là Dương tính, mô hình tìm ra được bao nhiêu trường hợp?
   - *Mục tiêu*: **Giảm thiểu False Negatives (FN)** (Hạn chế tối đa việc bỏ sót).
   - *Tình huống đề thi*: Khi việc "bỏ sót" gây ra hậu quả thảm họa, nguy hiểm tính mạng hoặc thiệt hại lớn. Ví dụ: Phát hiện khối u ác tính trong chẩn đoán y tế; Phát hiện gian lận thẻ tín dụng; Phát hiện mã độc an ninh mạng.

4. **F1-Score (Trung bình điều hòa giữa Precision và Recall)**:
   - Công thức: $\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}$.
   - *Bản chất toán học*: Sử dụng **Trung bình điều hòa (Harmonic Mean)** thay vì trung bình cộng thông thường. Nếu một trong hai chỉ số (Precision hoặc Recall) quá thấp, F1-Score sẽ bị kéo tụt xuống rất mạnh.
   - *Tại sao cần F1-Score?*: Precision và Recall thường có sự đánh đổi (Trade-off). Tăng Recall thường làm giảm Precision và ngược lại. F1-Score giúp đo lường một con số duy nhất thể hiện sự cân bằng tốt giữa hai chỉ số này.
   - *Quy tắc vàng khi chọn F1-Score trong đề thi AIF-C01*:
     1. **Dữ liệu mất cân bằng (Imbalanced Datasets)**: Khi lớp mục tiêu chiếm tỷ lệ rất nhỏ (ví dụ: Churn prediction - dự đoán khách hàng rời bỏ; Fraud detection). F1-Score là thước đo chuẩn xác hơn Accuracy rất nhiều.
     2. **Cần cân bằng hài hòa**: Khi bài toán yêu cầu vừa hạn chế báo động giả (FP), vừa hạn chế bỏ sót (FN).
     3. **Extractive Q&A trong Generative AI**: Đánh giá mức độ trùng lặp token/từ (word overlap) giữa câu trả lời do LLM trích xuất và câu trả lời mẫu (Ground Truth).

#### c. Các chỉ số đo lường cho bài toán Hồi quy (Regression Metrics)
- **Mean Squared Error (MSE)**: Trung bình bình phương các sai số. Do có lũy thừa bậc hai, MSE phạt rất nặng các sai số lớn (outliers).
- **Root Mean Squared Error (RMSE)**: Căn bậc hai của MSE. Có cùng đơn vị đo lường với biến mục tiêu ban đầu, trực quan hơn MSE.
- **Mean Absolute Error (MAE)**: Trung bình giá trị tuyệt đối của sai số. Đo lường sai số tuyến tính, không phạt quá mức các điểm ngoại lai.
- **R-squared ($R^2$ - Coefficient of Determination)**: Hệ số xác định (giá trị từ 0 đến 1), đo lường mức độ mà các biến độc lập giải thích được sự biến thiên của biến phụ thuộc.

#### d. Bảng phân loại 4 nhóm chỉ số AI/ML trong vận hành doanh nghiệp

| Nhóm chỉ số | Mục đích đo lường | Chỉ số tiêu biểu | Tình huống đề thi đặc trưng |
| :--- | :--- | :--- | :--- |
| **1. Business KPIs (Kinh doanh)** | Đo lường tác động tài chính và hiệu quả nghiệp vụ thực tế. | **Average Call Duration** (Thời lượng cuộc gọi), **First Contact Resolution (FCR)**, CSAT, NPS, Tỷ lệ chuyển đổi. | Chatbot hỗ trợ tổng đài giúp giảm tải thao tác nhân viên $\rightarrow$ Đo bằng **Average Call Duration** / **AHT**. |
| **2. Runtime / Operational Efficiency (Vận hành)** | Đo lường hiệu năng kỹ thuật khi mô hình đang phục vụ suy luận thực tế. | **Average Response Time (Latency)**, Throughput (TPS/RPS), GPU/CPU Memory Utilization. | Đo lường hiệu năng thời gian chạy khi vận hành mô hình $\rightarrow$ **Average Response Time / Latency**. |
| **3. Training Efficiency (Huấn luyện)** | Đo lường tốc độ học và độ hội tụ trong quá trình huấn luyện. | **Epochs** (số chu kỳ duyệt qua dữ liệu), Training Loss, Convergence Rate. | Nâng cao độ chính xác của mô hình lúc huấn luyện đạt ngưỡng $\rightarrow$ **Increase epochs** (không chọn tham số suy luận như Temperature). |
| **4. Model Predictive Quality (Toán học)** | Đo lường độ chuẩn xác toán học của dự đoán trên tập kiểm thử. | Accuracy, Precision, Recall, F1-Score, AUC-ROC, MSE, RMSE, ROUGE, BLEU. | Đánh giá năng lực của thuật toán trên tập Test. |

---

### 6. Bảng so sánh các dịch vụ AWS Core AI Managed Services

| Dịch vụ AWS | Chức năng chính | Đầu vào (Input) | Đầu ra (Output) | Tình huống đề thi đặc trưng |
| :--- | :--- | :--- | :--- | :--- |
| **Amazon Rekognition** | Computer Vision: Nhận diện vật thể, khuôn mặt, text trong ảnh, kiểm duyệt nội dung nhạy cảm. | Hình ảnh, Video (S3 / stream) | Labels, Bounding boxes, Face match, Moderation labels | Kiểm tra hình ảnh đại diện, kiểm duyệt nội dung người dùng tải lên, phát hiện người nổi tiếng. |
| **Amazon Textract** | Trích xuất văn bản có cấu trúc (bảng biểu, form, hóa đơn) bằng OCR thông minh. | File scan, PDF, ảnh chứng từ | Khóa - giá trị (Key-Value), Dữ liệu bảng (Tables), Dòng văn bản | Trích xuất thông tin hóa đơn tài chính, hồ sơ bảo hiểm, form biểu mẫu có kẻ khung. |
| **Amazon Comprehend** | Xử lý ngôn ngữ tự nhiên (NLP): Phân tích cảm xúc, trích xuất thực thể, phát hiện PII, **Toxicity Detection** (phát hiện ngôn ngữ độc hại mà không cần dữ liệu có nhãn). | Văn bản phi cấu trúc (Text) | Sentiment, Entities, PII tags, Toxicity labels | Phân tích đánh giá khách hàng, phát hiện nội dung thù ghét/xúc phạm trên mạng xã hội không cần train. |
| **Amazon Comprehend Medical** | NLP chuyên sâu cho ngành y tế/chăm sóc sức khỏe tuân thủ HIPAA. | Bệnh án, hồ sơ lâm sàng | Medical Entities (thuốc, liều lượng, bệnh lý, giải phẫu) | Trích xuất thông tin y tế chuyên biệt và mối quan hệ lâm sàng từ ghi chú bác sĩ. |
| **AWS HealthScribe** | Dịch vụ Generative AI chuyên biệt y tế kết hợp Speech-to-Text và LLMs để tạo ghi chú lâm sàng. | Âm thanh cuộc đối thoại giữa bác sĩ và bệnh nhân | Tóm tắt ghi chú lâm sàng (Clinical Notes) có cấu trúc | Bác sĩ đọc ghi chú bệnh án hoặc đối thoại khám bệnh $\rightarrow$ Tự động sinh báo cáo lâm sàng. |
| **Amazon Translate** | Dịch thuật máy móc thần kinh (Neural Machine Translation) đa ngôn ngữ. | Văn bản nguồn | Văn bản dịch chuẩn xác | Bản địa hóa website theo thời gian thực, dịch tài liệu sang ngôn ngữ khác. |
| **Amazon Polly** | Chuyển văn bản thành giọng nói tự nhiên (Text-to-Speech - TTS) với giọng đọc sống động. | Văn bản, SSML | File âm thanh (MP3, OGG, PCM) | Đọc báo tự động cho người khiếm thị, tạo giọng thuyết minh cho video đào tạo. |
| **Amazon Transcribe** | Chuyển giọng nói thành văn bản (Speech-to-Text - STT) hỗ trợ nhận diện từng người nói. | File âm thanh cuộc gọi, Audio stream | Văn bản kèm timestamp, nhãn người nói (speaker diarization) | Ghi biên bản cuộc họp, chép lời cuộc gọi tổng đài chăm sóc khách hàng. |
| **Amazon Lex** | Xây dựng giao diện đàm thoại (Conversational AI - Chatbot & Voicebot) theo kịch bản. | Tin nhắn văn bản, Giọng nói | Phản hồi tương tác, Slot values, Intent fulfillment | Xây dựng bot đặt vé xem phim, bot tra cứu số dư tài khoản ngân hàng theo luồng cố định. |
| **Amazon Personalize** | Công cụ gợi ý cá nhân hóa (Recommendation engine) theo thời gian thực dựa trên hành vi người dùng. | Lịch sử tương tác, Dữ liệu người dùng, Danh mục sản phẩm | Danh sách sản phẩm/nội dung gợi ý xếp hạng | Gợi ý sản phẩm nên mua tiếp theo trên sàn thương mại điện tử, gợi ý phim tương tự trên app streaming. |
| **Amazon Forecast** | Dự báo chuỗi thời gian (Time-series forecasting) kết hợp dữ liệu lịch sử và yếu tố ngoại cảnh. | Dữ liệu thời gian chuỗi (CSV/S3), yếu tố thời tiết/ngày lễ | Dự báo giá trị tương lai theo các phân vị (P10, P50, P90) | Dự báo nhu cầu tồn kho hàng hóa, dự báo nhu cầu năng lượng điện của thành phố. |
| **Amazon Fraud Detector** | Nền tảng tự động phát hiện các hành vi gian lận trực tuyến tiềm ẩn bằng học máy. | Dữ liệu giao dịch, IP, Thiết bị, Email | Điểm số rủi ro (Risk score), Kết quả quy tắc (Rule outcomes) | Phát hiện tạo tài khoản giả mạo, thanh toán bằng thẻ tín dụng bị đánh cắp. |

---

### 7. Phần cứng tăng tốc AWS Custom Silicon: Trainium vs Inferentia

Khi triển khai các mô hình AI/ML quy mô lớn, AWS cung cấp các dòng chip xử lý chuyên dụng (ASICs) tối ưu vượt trội về chi phí và tính bền vững (**Sustainability**):
- **AWS Trainium (EC2 Trn series - Trn1, Trn2)**:
  - Tối ưu hóa chuyên sâu cho giai đoạn **Huấn luyện mô hình học sâu và LLMs (Model Training)**.
  - Mang lại hiệu suất tính toán trên mỗi Watt điện cao nhất, tiết kiệm năng lượng và **ít tác động môi trường nhất (LEAST environmental effect / Carbon footprint)** so với GPU truyền thống.
- **AWS Inferentia (EC2 Inf series - Inf1, Inf2)**:
  - Tối ưu hóa chuyên biệt cho giai đoạn **Suy luận mô hình (Model Inference)** với chi phí thấp nhất và độ trễ cực thấp (lowest latency, highest throughput per dollar).
- *Quy tắc phòng thi*:
  - Huấn luyện LLM + Ít ảnh hưởng môi trường / Tiết kiệm năng lượng $\rightarrow$ Chọn **Amazon EC2 Trn series (Trainium)**.
  - Suy luận LLM + Chi phí rẻ nhất / Độ trễ thấp $\rightarrow$ Chọn **Amazon EC2 Inf series (Inferentia)**.

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
| **Confusion Matrix** | A confusion matrix is a table that shows classification performance. It compares predicted values with actual values. | TP, FP, TN, FN, Type I error, Type II error. | Bảng ma trận thể hiện 4 khả năng dự đoán: Dương thật (TP), Âm thật (TN), Dương giả (FP) và Âm giả (FN). |
| **Precision** | Precision measures correct positive predictions. It divides true positives by all positive predictions. | Minimize False Positives, spam filter, avoid false alarms. | Tỷ lệ dự đoán đúng trong các ca mô hình báo Dương tính. Tối ưu khi cần tránh báo động nhầm. |
| **Recall** | Recall measures identified positive cases. It divides true positives by all actual positives. | Minimize False Negatives, cancer detection, avoid missing fraud. | Tỷ lệ tìm thấy trong tất cả các ca thực tế Dương tính. Tối ưu khi việc bỏ sót gây hậu quả nghiêm trọng. |
| **F1 Score** | F1 score is the harmonic mean of precision and recall. It evaluates models on imbalanced datasets. | Harmonic mean, balanced metric, imbalanced classes, churn prediction, extractive QA. | Trung bình điều hòa giữa Precision và Recall. Chỉ số tối ưu cho dữ liệu mất cân bằng (như churn, gian lận) hoặc Extractive Q&A. |
| **Root Mean Squared Error** | Root mean squared error measures differences between predicted and actual values. It uses the same scale as the target variable. | Regression metric, continuous numeric error, penalizes outliers. | Căn bậc hai sai số toàn phương trung bình, chỉ số đo lường lỗi cho mô hình hồi quy. |
| **AWS Trainium** | AWS Trainium is a purpose-built ML chip. It optimizes deep learning model training with the lowest environmental impact. | Purpose-built chip, model training, lower cost, sustainability. | Chip ASIC chuyên dụng của AWS tối ưu cho huấn luyện mô hình học sâu và tiết kiệm năng lượng. |
| **AWS Inferentia** | AWS Inferentia is a purpose-built ML chip. It provides low-cost and low-latency inference for deep learning models. | Low-cost inference, high throughput, low latency endpoints. | Chip ASIC chuyên biệt của AWS giúp suy luận mô hình thời gian thực với chi phí rẻ nhất. |
| **AWS HealthScribe** | AWS HealthScribe uses speech recognition and generative AI. It generates structured clinical notes from doctor and patient conversations. | Clinical notes, healthcare conversation, physician consultation. | Dịch vụ GenAI chuyên biệt ngành y tế chuyển cuộc trò chuyện khám bệnh thành tóm tắt lâm sàng. |
| **Amazon Comprehend Medical** | Amazon Comprehend Medical extracts medical information from clinical text. It identifies conditions, dosages, and test results securely. | HIPAA eligible, clinical entities, medical condition extraction. | Dịch vụ NLP chuyên sâu y tế trích xuất tên thuốc, liều dùng, bệnh lý từ bệnh án. |
| **Exploratory Data Analysis** | Exploratory data analysis calculates summary statistics and correlation matrices. It visualizes data distributions before model training. | Summary statistics, correlation matrix, data distribution, EDA. | Phân tích khám phá dữ liệu ban đầu bằng thống kê mô tả và ma trận tương quan trước khi train. |
| **Batch Transform** | Batch transform runs offline predictions on large datasets. It processes non-real-time data and releases compute resources after completion. | Offline predictions, static datasets, weekend batch processing. | Chế độ suy luận ngoại tuyến trên tập dữ liệu tĩnh lớn theo chu kỳ, tự động giải phóng tài nguyên sau khi xong. |

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
