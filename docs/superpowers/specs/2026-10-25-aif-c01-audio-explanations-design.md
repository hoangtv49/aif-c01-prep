# Architectural Design: AWS AIF-C01 Audio Explanations Subsystem (57 Questions)

- **Date**: 2026-10-25
- **Status**: Draft / Under Review
- **Author**: OpenCode AI Studio
- **Scope**: 57 Scenario Questions across Domains 1 to 5

---

## 1. Executive Summary & Goals

### 1.1 Problem Statement
The AWS Certified AI Practitioner (AIF-C01) study web app provides extensive written theoretical and scenario materials, including 57 authentic exam scenario questions with 4-step trap analysis. However, learners frequently study on mobile devices while commuting, walking, or resting their eyes, where reading small text or dense paragraphs causes fatigue. Default browser Text-to-Speech (Web Speech API) produces robotic, fragmented speech on many platforms without natural intonation or reliable pronunciation of English cloud terms.

### 1.2 Proposed Solution
An integrated **Audio Explanations Subsystem** utilizing Microsoft Edge Neural AI Voice (`vi-VN-NamMinhNeural` - warm, natural, male voice). The subsystem pre-generates 57 high-fidelity, concise MP3 audio tracks (~40–55 seconds each, ~16 MB total) that break down the scenario, state the correct answer, explain the root cause, and warn against common exam traps. An interactive audio controller embedded into question cards supports both **single-question playback** and a hands-free **Continuous Playlist Mode** with auto-advance and viewport tracking.

### 1.3 Key Success Criteria
1. **Audio Quality**: Friendly, warm, natural intonation without robotic monotony; clear pronunciation of AWS terms (Bedrock, SageMaker, RAG, Fine-tuning, etc.).
2. **Audio Brevity**: Concise 40–55 seconds per question (~120–150 spoken words), following Option 1 (stem summary -> correct answer -> root cause & trap warning).
3. **Storage & Performance**: Total payload for all 57 files is ≤ 20 MB (24kHz Mono MP3 @ 48 kbps), streaming instantly on 4G/5G mobile connections via GitHub Pages.
4. **Playback UX**:
   - Zero audio overlap (Singleton global audio manager).
   - Speed controls: `1.0x`, `1.2x`, `1.5x`.
   - Continuous playlist mode with auto-scroll and subtle glowing card highlight on active playback.
   - Mobile Media Session API integration for lock-screen play/pause controls.
5. **Reliability & Testing**: Automated test suite verifying 57/57 audio assets, valid durations, manifest synchronization, and zero client JS syntax errors.

---

## 2. Speech Script Architecture (Option 1: Focused Recall)

### 2.1 Standard 4-Part Speech Template
Each question's audio script adheres strictly to the following 4-step structure:

1. **Header / Orientation (3-5s)**:
   - *"Câu hỏi số [X] của Domain [Y]: [Tên Domain]."*
2. **Scenario Summary (12-18s)**:
   - Concise spoken summary of the business requirement and constraints in Vietnamese, preserving authentic AWS terms in English.
3. **Correct Answer (5-8s)**:
   - *"Phương án đúng là: [Ký tự A/B/C/D], [Nội dung phương án chính xác]."*
4. **Analysis & Trap Warning (20-25s)**:
   - Core technical rationale from the question's `reason` field.
   - Exam trap warning from `trap` / `distractor` field, giving the listener the exact keyword triggers to look for in the real exam.

### 2.2 Text Sanitization Pipeline
Before passing text to `node-edge-tts`:
- Strip Markdown tokens (`**`, `*`, `_`, `` ` ``).
- Convert LaTeX / math tokens (`$\rightarrow$` -> *"suy ra"*, `\le` -> *"nhỏ hơn hoặc bằng"*).
- Normalize bullet lists into smooth transitional conjunctions (*"Thứ nhất là"*, *"Thứ hai là"*, *"Ngoài ra"*).
- Insert natural comma and period pauses to ensure optimal breathing rhythm and stress in neural speech synthesis.

---

## 3. System Architecture & Components

```
+-------------------------------------------------------------------------+
|                  Build-Time Batch Audio Generator                       |
|                 (scripts/generate-questions-audio.cjs)                  |
|                                                                         |
|  aif-c01-study-guide/domain-*.md ---> Speech Script Builder             |
|                                                |                        |
|                                                v                        |
|                                     node-edge-tts (NamMinh)             |
|                                                |                        |
|                                                v                        |
|                     audio/questions/d{domain}-q{num}.mp3 (57 files)     |
|                     audio/questions/manifest.json                       |
+-------------------------------------------------------------------------+
                                      |
                                      v (Static Deployment)
+-------------------------------------------------------------------------+
|                 Client Application (index.html SPA)                     |
|                                                                         |
|  [ Playlist Toolbar ] <------------------------+                        |
|  - Auto-play Next switch                       |                        |
|  - Prev / Play / Next                          |                        |
|                                                |                        |
|  [ Question Cards (57 items) ]                 v                        |
|  +-------------------------------------------------------------------+  |
|  | #d1-q1 Header: Domain 1  | 🔊 Nghe (~45s) [Active: ⏸️ Đang phát] |  |
|  | Stem: A financial company...                                      |  |
|  | Options: A, B, C, D                                               |  |
|  |                                                                   |  |
|  | [ Mini Player Box ] (reveals on click)                            |  |
|  | [<< 5s] [Play/Pause] [>> 5s]  [Seekbar 0:18/0:46]  [1x/1.2x/1.5x]  |  |
|  +-------------------------------------------------------------------+  |
|                                                |                        |
|                                                v                        |
|                   [ Global Singleton AudioManager ]                     |
|                   - Only 1 audio instance active                        |
|                   - MediaSession API background support                 |
|                   - Auto-scroll viewport to active card                 |
+-------------------------------------------------------------------------+
```

### 3.1 Audio Generation Script (`scripts/generate-questions-audio.cjs`)
- **Inputs**: Domain markdown files (`aif-c01-study-guide/domain-*.md`).
- **Engine**: `node-edge-tts` with `voice: "vi-VN-NamMinhNeural"`, `outputFormat: "audio-24khz-48kbitrate-mono-mp3"`.
- **Output Directories**:
  - `audio/questions/d{d}-q{n}.mp3`
  - `aif-c01-study-guide/audio/questions/d{d}-q{n}.mp3`
  - `audio/questions/manifest.json` (lists question IDs, durations, file sizes, and titles).
- **Incremental Caching**: Checks existing file size (>50KB) before making TTS requests, avoiding redundant calls on re-builds.

### 3.2 Global Audio Manager (`AudioManager`)
A centralized JavaScript client controller maintaining:
- `currentQuestionId`: ID of the currently playing question (or null).
- `audioElement`: Single persistent HTML5 `<audio>` element.
- `isAutoPlayNext`: Boolean flag (default: false, toggleable by user).
- `playbackRate`: Stored in `localStorage` (`aif_audio_speed`, default 1.0).
- `onEnded`: If `isAutoPlayNext` is true, wait 1.8 seconds, then trigger `playQuestionAudio(nextQuestionId)` and auto-scroll viewport.

### 3.3 UI Integration on Question Cards
1. **Header Action**:
   - An inline button `.q-audio-btn` placed on every question card in both Tab 1 (Chủ đề) and Tab 2 (Luyện đề).
   - Toggles play/pause state dynamically without page reload.
2. **Mini Player Drawer**:
   - Slides down on active card.
   - Shows live progress bar, current time / duration, 5-second scrub buttons, and speed selector.
3. **Continuous Playlist Toolbar**:
   - Placed above question lists with quick controls:
     - `⏮️ Câu trước`
     - `▶️ / ⏸️ Phát / Tạm dừng`
     - `⏭️ Câu tiếp theo`
     - `🔄 Tự động chuyển câu (Auto-play Next)` switch.

---

## 4. Error Handling & Edge Cases

1. **Network Interruptions during Playback**:
   - Display a gentle retry notice on the mini player if audio encounters a network error (`MEDIA_ERR_NETWORK`).
2. **Tab Switching while Audio Plays**:
   - If user switches tabs (e.g. from Quiz to Matrix), audio continues playing smoothly (or can be paused if user prefers). The floating toolbar updates state correctly.
3. **Mobile Low-Power / Autoplay Restrictions**:
   - User gesture (tap on `🔊 Nghe`) starts playback, satisfying mobile browser autoplay policies.
4. **Offline / Failed File Fallback**:
   - If a specific MP3 fails to load, the UI gracefully informs the user without freezing the quiz interface.

---

## 5. File & Directory Layout

- `scripts/generate-questions-audio.cjs`: Automated TTS synthesis pipeline for 57 questions.
- `audio/questions/`: 57 generated `.mp3` files for root SPA.
- `aif-c01-study-guide/audio/questions/`: Mirror copy for subfolder SPA.
- `audio/questions/manifest.json`: Audio catalog and duration index.
- `scripts/build-web.bun.js`: Updated HTML compiler adding audio controls and client AudioManager.
- `tests/questions-audio.test.js`: Test suite verifying asset generation, manifest integrity, and SPA rendering.

---

## 6. Verification & Acceptance Criteria

1. **57 MP3 Files**: Exactly 57 MP3 files present in `audio/questions/` and `aif-c01-study-guide/audio/questions/`, with size between 180 KB and 450 KB each.
2. **Continuous Playback**: Auto-advance transitions smoothly from `d1-q1` to `d1-q2` when auto-play toggle is enabled.
3. **Viewport Auto-Scroll**: Active card is centered smoothly in view when track changes.
4. **Automated Tests**: `bun test` passes 100% of tests including new `questions-audio.test.js`.
5. **Live Deployment**: Live URL `https://hoangtv49.github.io/aif-c01-prep/` serves all audio files with HTTP 200 OK.
