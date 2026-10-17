# Voice Transcriber

Transcribe voice notes locally using [Whisper](https://github.com/openai/whisper) via Apple's MLX framework. No internet connection or API key required after the one-time model download.

Supports 99 languages.

---

## Setup

> Requires an Apple Silicon (M-series) Mac and an arm64 `python3`. Check with `python3 -c "import platform; print(platform.machine())"`, which should print `arm64`.

```bash
# Get the repo if you do not have it yet
[ -d how-i-work ] || git clone https://github.com/DanielErCohen/how-i-work.git
cd how-i-work/small-builds/voice-transcriber

# Create a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Required: mlx_whisper uses ffmpeg to read every audio file
brew install ffmpeg
```

The first transcription downloads the model weights to `~/.cache/huggingface/` (one-time).

---

## Usage

```bash
# Activate the venv first (if not already active)
source .venv/bin/activate

# Transcribe and print to terminal
# (replace voice-note.m4a with the path to your own recording)
python3 transcribe.py voice-note.m4a

# Save as a markdown note to 00-inbox/
python3 transcribe.py voice-note.m4a --save

# With a custom title and explicit language
python3 transcribe.py voice-note.m4a --save --title "Meeting ideas" --language en

# German voice note
python3 transcribe.py note-german.m4a --language de --save

# Use a larger, more accurate model
python3 transcribe.py important-meeting.m4a --model large-v3 --save

# Include word-level timestamps
python3 transcribe.py voice-note.m4a --timestamps
```

### All Options

| Flag | Default | Description |
|------|---------|-------------|
| `audio_file` | - | Path to audio file |
| `--model` | `base` | Model size: `tiny`, `base`, `small`, `medium`, `large-v3` |
| `--language` | auto | Language code (`en`, `de`, `es`, etc.) |
| `--save` | off | Save output as markdown note to `00-inbox/` |
| `--title` | filename | Title for the saved note |
| `--output-dir` | `./00-inbox/` (in the directory you run from) | Override save location |
| `--timestamps` | off | Include word-level timestamps |

---

## Models

| Model | Size | Speed | Best for |
|-------|------|-------|----------|
| `tiny` | 39 MB | Fastest | Quick drafts, short notes |
| `base` | 75 MB | Fast | **Default - good for most notes** |
| `small` | 244 MB | Medium | Better accuracy, still fast |
| `medium` | 769 MB | Slow | High accuracy |
| `large-v3` | 1.5 GB | Slowest | Best accuracy, important recordings |

---

## Output

Saved notes land in `00-inbox/` as markdown files:

```
00-inbox/2026-04-15_meeting-ideas.md
```

With frontmatter:
```markdown
---
date: 2026-04-15
source_file: voice-note.m4a
language: en
type: voice-note
---

## Meeting ideas

<transcribed text here>
```

From the inbox, move notes to the appropriate PARA folder as part of your regular review.

---

## Troubleshooting

**`ModuleNotFoundError: No module named 'mlx'`**
You're using an Intel Python. Run `python3 -c "import platform; print(platform.machine())"`, which should print `arm64`. Install an arm64 Python (for example `brew install python` on Apple Silicon), delete `.venv` and recreate it with `python3 -m venv .venv`.

**`FileNotFoundError: ffmpeg`**
Install ffmpeg: `brew install ffmpeg`. It is required for every input format, including `.m4a` and `.wav`.

**Auto-detect picks the wrong language**
Pass `--language de` (or `en`, `es`, etc.) explicitly.
