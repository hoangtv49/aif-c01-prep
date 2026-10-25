import os
import sys
import json
import time
import argparse
from pathlib import Path
import numpy as np

from vieneu import Vieneu
import lameenc

ROOT_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = ROOT_DIR / "aif-c01-study-guide"
AUDIO_DIR = ROOT_DIR / "audio" / "theory"
SUB_AUDIO_DIR = ROOT_DIR / "aif-c01-study-guide" / "audio" / "theory"
CACHE_DIR = Path("/tmp/opencode/vieneu-cache/theory")

DOMAIN_FILES = {
  1: "domain-1-fundamentals-ai-ml.md",
  2: "domain-2-generative-ai.md",
  3: "domain-3-fm-applications.md",
  4: "domain-4-responsible-ai.md",
  5: "domain-5-security-compliance-governance.md"
}

DOMAIN_TITLES = {
  1: "Domain 1: Nguyên lý cơ bản về Trí tuệ nhân tạo và Học máy, chiếm 20% bài thi AIF-C01",
  2: "Domain 2: Nguyên lý cơ bản về Trí tuệ nhân tạo tạo sinh Generative AI, chiếm 24% bài thi AIF-C01",
  3: "Domain 3: Ứng dụng các Mô hình nền tảng Foundation Models, chiếm 28% bài thi AIF-C01",
  4: "Domain 4: Hướng dẫn về Trí tuệ nhân tạo có trách nhiệm Responsible AI, chiếm 14% bài thi AIF-C01",
  5: "Domain 5: Bảo mật, Tuân thủ và Quản trị cho các giải pháp AI, chiếm 14% bài thi AIF-C01"
}

DIAGRAM_TRANSCRIPTIONS = {
  1: "Sơ đồ phân cấp: Trí tuệ nhân tạo AI là tập hợp lớn nhất. Bên trong AI là Học máy Machine Learning, nơi hệ thống tự học từ dữ liệu. Và trong cùng của Machine Learning là Học sâu Deep Learning, sử dụng mạng nơ-ron nhiều tầng để xử lý dữ liệu phức tạp.",
  2: "Sơ đồ các phương pháp tiếp cận Generative AI xếp theo chiều tăng dần về chi phí và độ phức tạp kỹ thuật: Tiết kiệm và nhanh nhất là Prompt Engineering kỹ nghệ câu lệnh; tiếp theo là RAG kết nối cơ sở tri thức; tiếp đến là Fine-Tuning tinh chỉnh mô hình; và tốn kém, phức tạp nhất là Pre-Training huấn luyện mô hình nền tảng từ đầu.",
  3: "Sơ đồ ba tầng công nghệ Generative AI của AWS: Tầng dưới cùng là Hạ tầng máy chủ dành cho chuyên gia với chip chuyên dụng AWS Trainium và Inferentia. Tầng giữa là Công cụ dành cho nhà phát triển xây dựng ứng dụng với Amazon Bedrock và SageMaker JumpStart. Tầng trên cùng là Ứng dụng AI dựng sẵn cho người dùng doanh nghiệp như trợ lý thông minh Amazon Q.",
  4: "Sơ đồ luồng hoạt động của Amazon Bedrock Guardrails: Khi người dùng nhập câu lệnh, Guardrails sẽ kiểm duyệt bộ lọc nội dung, chặn chủ đề cấm, che giấu thông tin cá nhân nhạy cảm PII trước khi gửi đến mô hình, và sau đó kiểm tra tính trung thực của câu trả lời trước khi gửi lại cho người dùng.",
  5: "Sơ đồ Mô hình trách nhiệm chia sẻ theo ba nhóm dịch vụ: Với AI Services Serverless như Amazon Rekognition hay Amazon Bedrock, AWS quản lý toàn bộ hạ tầng và mô hình nền tảng, khách hàng quản lý dữ liệu đầu vào và phân quyền IAM. Với ML Services như SageMaker, AWS quản lý nền tảng tính toán, khách hàng quản lý mã nguồn, cấu hình mô hình và dữ liệu."
}

def clean_theory_markdown(domain_id: int):
    file_path = BASE_DIR / DOMAIN_FILES[domain_id]
    content = file_path.read_text(encoding="utf-8")
    
    # Extract Part 1
    p1 = content.split("## Phần 1: Trọng tâm lý thuyết & Decision Trees")[1].split("## Phần 2")[0]
    
    import re
    p1 = re.sub(r"```[\s\S]*?```", DIAGRAM_TRANSCRIPTIONS.get(domain_id, ""), p1)
    
    raw_sections = p1.split("\n### ")[1:]
    chunks = []
    intro = f"Chào mừng bạn đến với phần tóm tắt lý thuyết trọng tâm của {DOMAIN_TITLES[domain_id]}. Sau đây là các kiến thức cốt lõi và từ khóa ăn điểm bạn cần nắm chắc cho kỳ thi. "
    
    for s_idx, sec in enumerate(raw_sections):
        lines = sec.split("\n")
        title = re.sub(r"^\d+\.\s*", "", lines[0].strip())
        title = re.sub(r"\(.*?\)", "", title).strip()
        body = "\n".join(lines[1:])
        
        # Clean tables
        body_lines = body.split("\n")
        parsed_lines = []
        in_table = False
        headers = []
        
        for line in body_lines:
            trimmed = line.strip()
            if trimmed.startswith("|") and trimmed.endswith("|"):
                cells = [c.strip().replace("**", "") for c in trimmed.split("|")[1:-1]]
                if all(re.match(r"^:?-+:?$", c) for c in cells):
                    continue
                if not in_table:
                    in_table = True
                    headers = cells
                    continue
                row_spoken = []
                for i, cell in enumerate(cells):
                    if not cell or cell in ("-", "N/A"):
                        continue
                    h = headers[i] if i < len(headers) else ""
                    if i == 0:
                        row_spoken.append(f"{cell}.")
                    elif h:
                        row_spoken.append(f"{h}: {cell}.")
                    else:
                        row_spoken.append(f"{cell}.")
                parsed_lines.append(" ".join(row_spoken))
            else:
                in_table = False
                headers = []
                parsed_lines.append(line)
        
        body_clean = "\n".join(parsed_lines)
        body_clean = re.sub(r"\$\s*\\rightarrow\s*\$", " suy ra ", body_clean)
        body_clean = re.sub(r"\$\s*\\to\s*\$", " suy ra ", body_clean)
        body_clean = re.sub(r"\\rightarrow", " suy ra ", body_clean)
        body_clean = re.sub(r"\\to\b", " suy ra ", body_clean)
        body_clean = re.sub(r"\$\\le\s*(\d+)\$", r" nhỏ hơn hoặc bằng \1 ", body_clean)
        body_clean = re.sub(r"\$([^\$]+)\$", r"\1", body_clean)
        body_clean = re.sub(r"\\text\{([^}]+)\}", r"\1", body_clean)
        body_clean = re.sub(r"\bvs\b", "và", body_clean, flags=re.IGNORECASE)
        body_clean = re.sub(r"\*\*(.*?)\*\*", r"\1", body_clean)
        body_clean = re.sub(r"\*(.*?)\*", r"\1", body_clean)
        body_clean = re.sub(r"`([^`]+)`", r"\1", body_clean)
        body_clean = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", body_clean)
        body_clean = re.sub(r"^[-*]\s+", "", body_clean, flags=re.MULTILINE)
        body_clean = re.sub(r"---", " ", body_clean)
        body_clean = re.sub(r"\n+", " ", body_clean)
        body_clean = re.sub(r"\s+", " ", body_clean).strip()
        
        prefix = (intro if s_idx == 0 else "") + f"Mục {s_idx + 1}: {title}. "
        
        # Split into readable paragraphs (~600 - 900 chars)
        if len(body_clean) > 900:
            sentences = re.findall(r"[^.!?]+[.!?]+", body_clean) or [body_clean]
            cur = prefix
            for s in sentences:
                if len(cur + s) > 800:
                    chunks.append(cur.strip())
                    cur = s + " "
                else:
                    cur += s + " "
            if cur.strip():
                chunks.append(cur.strip())
        else:
            chunks.append(f"{prefix}{body_clean}".strip())
            
    return chunks

def encode_pcm_to_mp3(audio_np: np.ndarray, sample_rate: int = 48000, bitrate: int = 64) -> bytes:
    pcm = (np.clip(audio_np, -1.0, 1.0) * 32767).astype(np.int16)
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(bitrate)
    encoder.set_in_sample_rate(sample_rate)
    encoder.set_channels(1)
    encoder.set_quality(2)
    mp3 = encoder.encode(pcm.tobytes())
    mp3 += encoder.flush()
    return mp3

def synthesize_domain_theory(domain_id: int, vieneu_engine=None, voice_name: str = "Hải Đăng", force: bool = False):
    print(f"\n=======================================================")
    print(f"=== Synthesizing Domain {domain_id} with VieNeu-TTS (48 kHz, Voice: {voice_name}) ===")
    print(f"=======================================================")
    t0 = time.time()
    
    if vieneu_engine is None:
        vieneu_engine = Vieneu(precision="int8", threads=8)
        
    chunks = clean_theory_markdown(domain_id)
    print(f"Domain {domain_id}: {len(chunks)} chunks, {sum(len(c) for c in chunks)} total characters.")
    
    domain_cache_dir = CACHE_DIR / f"d{domain_id}"
    domain_cache_dir.mkdir(parents=True, exist_ok=True)
    
    all_waveforms = []
    
    for idx, chunk in enumerate(chunks):
        chunk_file = domain_cache_dir / f"chunk_{idx}.npy"
        if not force and chunk_file.exists():
            wav = np.load(chunk_file)
            print(f"  [Cache hit] Chunk {idx + 1}/{len(chunks)} ({len(wav)/48000:.1f}s audio)")
            all_waveforms.append(wav)
            continue
            
        c_t0 = time.time()
        print(f"  Synthesizing chunk {idx + 1}/{len(chunks)} ({len(chunk)} chars)...", end="", flush=True)
        wav = vieneu_engine.infer(chunk, voice=voice_name)
        np.save(chunk_file, wav)
        all_waveforms.append(wav)
        c_dur = len(wav) / 48000
        print(f" done in {time.time() - c_t0:.1f}s ({c_dur:.1f}s audio)")
        
    full_audio = np.concatenate(all_waveforms)
    duration_sec = round(len(full_audio) / 48000)
    print(f"Domain {domain_id} finished! Audio duration: {duration_sec}s (~{duration_sec/60:.1f} mins). Encoding MP3...")
    
    mp3_bytes = encode_pcm_to_mp3(full_audio, sample_rate=48000, bitrate=64)
    
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    SUB_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    
    target_file = AUDIO_DIR / f"domain-{domain_id}.mp3"
    sub_target_file = SUB_AUDIO_DIR / f"domain-{domain_id}.mp3"
    
    target_file.write_bytes(mp3_bytes)
    sub_target_file.write_bytes(mp3_bytes)
    
    # Update manifest
    manifest_file = AUDIO_DIR / "manifest.json"
    manifest = {}
    if manifest_file.exists():
        try:
            manifest = json.loads(manifest_file.read_text(encoding="utf-8"))
        except Exception:
            pass
            
    manifest[f"domain-{domain_id}"] = {
        "domainId": domain_id,
        "size": len(mp3_bytes),
        "duration": duration_sec,
        "engine": "VieNeu-TTS-v3-Turbo",
        "sampleRate": 48000,
        "voice": voice_name
    }
    
    manifest_file.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (SUB_AUDIO_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    
    elapsed = time.time() - t0
    print(f"✅ Domain {domain_id} saved: {len(mp3_bytes)} bytes to {target_file} (Total time: {elapsed:.1f}s)")
    return manifest[f"domain-{domain_id}"]

def synthesize_all_theory(voice_name: str = "Hải Đăng", force: bool = False):
    print(">>> Starting batch VieNeu-TTS synthesis for all 5 Theory Domains...")
    engine = Vieneu(precision="int8", threads=10)
    for d in range(1, 6):
        synthesize_domain_theory(d, vieneu_engine=engine, voice_name=voice_name, force=force)
    print(">>> All 5 Theory Domains completed successfully!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", type=int, default=0, help="Domain ID (1-5), or 0 for all")
    parser.add_argument("--voice", type=str, default="Hải Đăng", help="VieNeu-TTS voice name")
    parser.add_argument("--force", action="store_true", help="Force regenerate without cache")
    args = parser.parse_args()
    
    if args.domain > 0:
        synthesize_domain_theory(args.domain, voice_name=args.voice, force=args.force)
    else:
        synthesize_all_theory(voice_name=args.voice, force=args.force)
