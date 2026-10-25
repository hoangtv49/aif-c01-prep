import os
import sys
import re
import json
import time
import argparse
from pathlib import Path
import numpy as np

from vieneu import Vieneu
import lameenc

ROOT_DIR = Path(__file__).resolve().parent.parent
BASE_DIR = ROOT_DIR / "aif-c01-study-guide"
AUDIO_DIR = ROOT_DIR / "audio" / "questions"
SUB_AUDIO_DIR = ROOT_DIR / "aif-c01-study-guide" / "audio" / "questions"
CACHE_DIR = Path("/tmp/opencode/vieneu-cache/questions")
TRANS_FILE = ROOT_DIR / "scripts" / "question-translations.json"

def sanitize_speech_text(text: str) -> str:
    if not text:
        return ""
    t = text
    t = re.sub(r"\$\s*\\rightarrow\s*\$", " suy ra ", t)
    t = re.sub(r"\$\s*\\to\s*\$", " suy ra ", t)
    t = re.sub(r"\\rightarrow", " suy ra ", t)
    t = re.sub(r"\\to\b", " suy ra ", t)
    t = re.sub(r"\$\\le\s*(\d+)\$", r" nhỏ hơn hoặc bằng \1 ", t)
    t = re.sub(r"\$([^\$]+)\$", r"\1", t)
    t = re.sub(r"\*\*", "", t)
    t = re.sub(r"\*", "", t)
    t = re.sub(r"`([^`]+)`", r"\1", t)
    t = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", t)
    t = re.sub(r"---", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t

def format_speech_script(q: dict, domain_title: str, vn_scenarios: dict) -> str:
    domain_clean = re.sub(r"\s*\(\d+%\)", "", domain_title or f"Domain {q['domainId']}").strip()
    vn_scenario = vn_scenarios.get(q["id"])
    stem_clean = vn_scenario if vn_scenario else sanitize_speech_text(q["stem"])
    answer_clean = sanitize_speech_text(q["correctAnswer"])
    
    reason_clean = sanitize_speech_text(q.get("reason", ""))
    reason_clean = re.sub(r"^Từ khóa quan trọng:?", "Từ khóa quan trọng:", reason_clean, flags=re.I)
    reason_clean = re.sub(r"^-\s*", "", reason_clean, flags=re.M)
    
    trap_clean = sanitize_speech_text(q.get("trap") or q.get("distractor") or "")
    
    script = f"Câu hỏi số {q['number']} của {domain_clean}. "
    script += f"Tình huống như sau: {stem_clean} "
    script += f"Phương án đúng là: {answer_clean}. "
    if reason_clean:
        script += f"Phân tích: {reason_clean}. "
    if trap_clean:
        script += f"Lưu ý bẫy thi: {trap_clean}. "
        
    return re.sub(r"\s+", " ", script).strip()

def load_all_questions():
    vn_scenarios = json.loads(TRANS_FILE.read_text(encoding="utf-8")) if TRANS_FILE.exists() else {}
    domain_files = [f for f in sorted(os.listdir(BASE_DIR)) if f.startswith("domain-") and f.endswith(".md")]
    
    all_questions = []
    
    for filename in domain_files:
        d_match = re.search(r"domain-(\d+)", filename)
        if not d_match:
            continue
        domain_id = int(d_match.group(1))
        content = (BASE_DIR / filename).read_text(encoding="utf-8")
        
        t_match = re.search(r"^# (.*)", content, flags=re.M)
        domain_title = t_match.group(1) if t_match else f"Domain {domain_id}"
        
        q_blocks = content.split("### Question ")
        for q_idx in range(1, len(q_blocks)):
            block = q_blocks[q_idx]
            q_num = q_idx
            q_id = f"d{domain_id}-q{q_num}"
            
            parts = block.split("**Đáp án đúng:**")
            stem_raw = parts[0].strip()
            option_lines = []
            stem_lines = []
            for l in stem_raw.split("\n"):
                trimmed = l.strip()
                if re.match(r"^[-*]\s+[A-E]\.", trimmed):
                    option_lines.append(re.sub(r"^[-*]\s+", "", trimmed))
                elif not option_lines and trimmed:
                    stem_lines.append(trimmed)
                    
            answer_part = parts[1] if len(parts) > 1 else ""
            ans_m = re.search(r"^\s*\*?\*?(.*?)\*?\*?\s*\n", answer_part)
            correct_ans = ans_m.group(1).strip() if ans_m else ""
            
            reason_m = re.search(r"\*\*Lý do chọn.*?\*\*([\s\S]*?)(?=\*\*Phân tích|\*\*Cảnh báo|$)", answer_part, flags=re.I)
            reason = reason_m.group(1).strip() if reason_m else ""
            
            trap_m = re.search(r"\*\*Cảnh báo.*?\*\*([\s\S]*?)(?=---|###|$)", answer_part, flags=re.I)
            trap = trap_m.group(1).strip() if trap_m else ""
            
            distractor_m = re.search(r"\*\*Phân tích.*?\*\*([\s\S]*?)(?=\*\*Cảnh báo|$)", answer_part, flags=re.I)
            distractor = distractor_m.group(1).strip() if distractor_m else ""
            
            q_obj = {
                "id": q_id,
                "domainId": domain_id,
                "number": q_num,
                "stem": " ".join(stem_lines),
                "correctAnswer": correct_ans,
                "reason": reason,
                "distractor": distractor,
                "trap": trap,
                "domainTitle": domain_title
            }
            q_obj["speechScript"] = format_speech_script(q_obj, domain_title, vn_scenarios)
            all_questions.append(q_obj)
            
    return all_questions

def encode_pcm_to_mp3(audio_np: np.ndarray, sample_rate: int = 48000, bitrate: int = 48) -> bytes:
    pcm = (np.clip(audio_np, -1.0, 1.0) * 32767).astype(np.int16)
    encoder = lameenc.Encoder()
    encoder.set_bit_rate(bitrate)
    encoder.set_in_sample_rate(sample_rate)
    encoder.set_channels(1)
    encoder.set_quality(2)
    mp3 = encoder.encode(pcm.tobytes())
    mp3 += encoder.flush()
    return mp3

def synthesize_questions(voice_name: str = "Hải Đăng", domain_filter: int = 0, force: bool = False):
    questions = load_all_questions()
    if domain_filter > 0:
        questions = [q for q in questions if q["domainId"] == domain_filter]
        
    print(f">>> Synthesizing {len(questions)} scenario questions with VieNeu-TTS (Voice: {voice_name})...")
    
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    SUB_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    
    vieneu = Vieneu(precision="int8", threads=10)
    
    manifest_path = AUDIO_DIR / "manifest.json"
    manifest = {}
    if manifest_path.exists():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except Exception:
            pass
            
    t0_all = time.time()
    
    for i, q in enumerate(questions):
        q_id = q["id"]
        target_file = AUDIO_DIR / f"{q_id}.mp3"
        sub_target = SUB_AUDIO_DIR / f"{q_id}.mp3"
        cache_file = CACHE_DIR / f"{q_id}.npy"
        
        if not force and target_file.exists() and manifest.get(q_id, {}).get("engine") == "VieNeu-TTS-v3-Turbo":
            print(f"  [{i+1}/{len(questions)}] {q_id} already up to date. Skipping.")
            continue
            
        t_q = time.time()
        print(f"  [{i+1}/{len(questions)}] Synthesizing {q_id} (D{q['domainId']} Q{q['number']})...", end="", flush=True)
        
        if not force and cache_file.exists():
            wav = np.load(cache_file)
            print(" [from cache]", end="")
        else:
            wav = vieneu.infer(q["speechScript"], voice=voice_name)
            np.save(cache_file, wav)
            
        dur = round(len(wav) / 48000)
        mp3_bytes = encode_pcm_to_mp3(wav, sample_rate=48000, bitrate=48)
        
        target_file.write_bytes(mp3_bytes)
        sub_target.write_bytes(mp3_bytes)
        
        manifest[q_id] = {
            "domainId": q["domainId"],
            "number": q["number"],
            "size": len(mp3_bytes),
            "duration": dur,
            "engine": "VieNeu-TTS-v3-Turbo",
            "voice": voice_name
        }
        
        manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        (SUB_AUDIO_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
        
        print(f" done in {time.time()-t_q:.1f}s ({dur}s audio, {len(mp3_bytes)} bytes)")
        
    print(f"\n>>> All {len(questions)} questions completed in {time.time()-t0_all:.1f}s!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", type=int, default=0, help="Filter by Domain ID (1-5), or 0 for all")
    parser.add_argument("--voice", type=str, default="Hải Đăng", help="VieNeu-TTS voice name")
    parser.add_argument("--force", action="store_true", help="Force re-generation")
    args = parser.parse_args()
    
    synthesize_questions(voice_name=args.voice, domain_filter=args.domain, force=args.force)
