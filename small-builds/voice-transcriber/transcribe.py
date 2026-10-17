#!/usr/bin/env python3
"""Local voice note transcriber using Whisper (MLX on Apple Silicon)."""

from __future__ import annotations

import argparse
import re
import sys
from datetime import date
from pathlib import Path

MODEL_MAP = {
    "tiny":     "mlx-community/whisper-tiny-mlx",
    "base":     "mlx-community/whisper-base-mlx",
    "small":    "mlx-community/whisper-small-mlx",
    "medium":   "mlx-community/whisper-medium-mlx",
    "large-v3": "mlx-community/whisper-large-v3-mlx",
}

DEFAULT_INBOX = Path.cwd() / "00-inbox"


def transcribe(audio_path: str, model: str, language: str | None, word_timestamps: bool) -> dict:
    try:
        import mlx_whisper
    except ImportError:
        print(
            "Error: mlx-whisper is not installed.\n"
            "Run: pip install mlx-whisper\n"
            "(Requires Apple Silicon + arm64 Python from Homebrew)",
            file=sys.stderr,
        )
        sys.exit(1)

    model_id = MODEL_MAP.get(model, MODEL_MAP["base"])
    print(f"Using model: {model_id}")
    print("Downloading model on first run (~75MB for base)...\n" if model == "base" else "")

    result = mlx_whisper.transcribe(
        audio_path,
        path_or_hf_repo=model_id,
        language=language,
        word_timestamps=word_timestamps,
        verbose=False,
    )
    return result


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def to_markdown(result: dict, title: str, audio_filename: str) -> str:
    today = date.today().isoformat()
    detected_lang = result.get("language", "unknown")
    text = result["text"].strip()

    segments = result.get("segments", [])
    if segments and any("words" in s for s in segments):
        lines = []
        for seg in segments:
            words = seg.get("words", [])
            if words:
                for w in words:
                    lines.append(f"[{w['start']:.1f}s] {w['word'].strip()}")
            else:
                lines.append(seg.get("text", "").strip())
        transcript_body = "\n".join(lines)
    else:
        transcript_body = text

    return (
        f"---\n"
        f"date: {today}\n"
        f"source_file: {audio_filename}\n"
        f"language: {detected_lang}\n"
        f"type: voice-note\n"
        f"---\n\n"
        f"## {title}\n\n"
        f"{transcript_body}\n"
    )


def save_note(markdown: str, title: str, output_dir: Path) -> Path:
    today = date.today().isoformat()
    slug = slugify(title)
    filename = f"{today}_{slug}.md"
    output_dir.mkdir(parents=True, exist_ok=True)
    dest = output_dir / filename
    dest.write_text(markdown, encoding="utf-8")
    return dest


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Transcribe voice notes locally using Whisper (MLX).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 transcribe.py note.m4a
  python3 transcribe.py note.m4a --save
  python3 transcribe.py note.m4a --save --title "Meeting ideas"
  python3 transcribe.py note.m4a --language de --model large-v3
        """,
    )
    parser.add_argument("audio_file", help="Path to audio file (.m4a, .mp3, .wav, .flac, .ogg)")
    parser.add_argument(
        "--model",
        default="base",
        choices=list(MODEL_MAP.keys()),
        help="Whisper model size (default: base). Larger = slower but more accurate.",
    )
    parser.add_argument(
        "--language",
        default=None,
        metavar="CODE",
        help="Language code, e.g. en, de, es (default: auto-detect)",
    )
    parser.add_argument(
        "--save",
        action="store_true",
        help="Save transcription as a markdown note to 00-inbox/",
    )
    parser.add_argument(
        "--title",
        default=None,
        help="Note title (default: audio filename without extension)",
    )
    parser.add_argument(
        "--output-dir",
        default=None,
        metavar="PATH",
        help=f"Directory to save note (default: {DEFAULT_INBOX})",
    )
    parser.add_argument(
        "--timestamps",
        action="store_true",
        help="Include word-level timestamps in output",
    )
    args = parser.parse_args()

    audio_path = Path(args.audio_file).resolve()
    if not audio_path.exists():
        print(f"Error: file not found: {audio_path}", file=sys.stderr)
        sys.exit(1)

    print(f"Transcribing: {audio_path.name}")
    result = transcribe(
        str(audio_path),
        model=args.model,
        language=args.language,
        word_timestamps=args.timestamps,
    )

    print(f"\n--- Transcript (language: {result.get('language', 'unknown')}) ---\n")
    print(result["text"].strip())
    print()

    if args.save:
        title = args.title or audio_path.stem
        out_dir = Path(args.output_dir).expanduser().resolve() if args.output_dir else DEFAULT_INBOX
        md = to_markdown(result, title=title, audio_filename=audio_path.name)
        saved = save_note(md, title=title, output_dir=out_dir)
        print(f"Note saved: {saved}")


if __name__ == "__main__":
    main()
