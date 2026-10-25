const { EdgeTTS } = require("node-edge-tts");
const fs = require("fs");
const path = require("path");

const audioDir = path.resolve(__dirname, "../audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// Copy to subfolder as well for standalone guide compatibility
const subAudioDir = path.resolve(__dirname, "../aif-c01-study-guide/audio");
if (!fs.existsSync(subAudioDir)) {
  fs.mkdirSync(subAudioDir, { recursive: true });
}

const sampleScript = `Chào bạn! Chào mừng bạn đến với chuyên mục Ôn thi cấp tốc AWS Certified AI Practitioner. 
Hôm nay chúng ta cùng phân tích một tình huống cốt lõi rất hay gặp trong đề thi nhé!
Tình huống như sau: Một công ty muốn triển khai trợ lý AI để trả lời câu hỏi của nhân viên dựa trên kho tài liệu mật nội bộ. Yêu cầu là câu trả lời phải trích dẫn chính xác, giảm thiểu hiện tượng bịa đặt thông tin, và chi phí vận hành phải tối ưu nhất.
Giải pháp hoàn hảo ở đây chính là Amazon Bedrock Knowledge Bases kết hợp với kỹ thuật RAG, tức là Retrieval-Augmented Generation.
Vì sao lại như vậy? Thứ nhất, RAG cho phép truy xuất kiến thức cập nhật từ tài liệu nội bộ mà không cần tốn hàng tuần lễ để Fine-tuning lại mô hình. Thứ hai, Bedrock là dịch vụ Serverless, giúp bạn bắt đầu ngay lập tức mà không phải lo chi phí quản lý hạ tầng máy chủ.
Mẹo thi đắt giá cần nhớ: Cứ thấy từ khóa "kết nối dữ liệu riêng của công ty" và "hạn chế hallucination với chi phí thấp", bạn hãy tự tin chọn ngay RAG và Bedrock Knowledge Bases nhé!
Chúc bạn ôn tập tràn đầy năng lượng và đạt điểm thật cao trong ngày thi!`;

async function main() {
  console.log("Generating Demo Audio 1: Hoài My (Nữ - Truyền cảm, thân thiện)...");
  const ttsFemale = new EdgeTTS({
    voice: "vi-VN-HoaiMyNeural",
    lang: "vi-VN",
    outputFormat: "audio-24khz-48kbitrate-mono-mp3"
  });
  const hoaimyPath = path.join(audioDir, "demo-hoaimy.mp3");
  await ttsFemale.ttsPromise(sampleScript, hoaimyPath);
  fs.copyFileSync(hoaimyPath, path.join(subAudioDir, "demo-hoaimy.mp3"));
  console.log("Hoài My audio generated:", hoaimyPath, "Size:", fs.statSync(hoaimyPath).size);

  console.log("Generating Demo Audio 2: Nam Minh (Nam - Ấm áp, rõ ràng, chuẩn mực)...");
  const ttsMale = new EdgeTTS({
    voice: "vi-VN-NamMinhNeural",
    lang: "vi-VN",
    outputFormat: "audio-24khz-48kbitrate-mono-mp3"
  });
  const namminhPath = path.join(audioDir, "demo-namminh.mp3");
  await ttsMale.ttsPromise(sampleScript, namminhPath);
  fs.copyFileSync(namminhPath, path.join(subAudioDir, "demo-namminh.mp3"));
  console.log("Nam Minh audio generated:", namminhPath, "Size:", fs.statSync(namminhPath).size);

  console.log("Audio sample generation completed successfully!");
}

main().catch(err => {
  console.error("Audio generation failed:", err);
  process.exit(1);
});
