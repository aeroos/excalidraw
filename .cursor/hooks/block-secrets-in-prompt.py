#!/usr/bin/env python3
"""Block prompt submission when likely secrets are detected in prompt or attachments."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Iterable

MAX_ATTACHMENT_BYTES = 512_000

# (compiled_pattern, human-readable label)
PATTERNS: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"AKIA[0-9A-Z]{16}"), "AWS access key ID"),
    (re.compile(r"(?i)\bASIA[0-9A-Z]{16}\b"), "AWS temporary access key ID"),
    (re.compile(r"\bghp_[A-Za-z0-9]{20,}\b"), "GitHub personal access token"),
    (re.compile(r"\bgithub_pat_[A-Za-z0-9_]{20,}\b"), "GitHub fine-grained PAT"),
    (re.compile(r"\bgho_[A-Za-z0-9]{20,}\b"), "GitHub OAuth token"),
    (re.compile(r"\bsk-ant-api[0-9A-Za-z_-]{10,}\b"), "Anthropic API key"),
    (re.compile(r"\bsk-proj-[A-Za-z0-9_-]{20,}\b"), "OpenAI project API key"),
    (re.compile(r"\bsk-[A-Za-z0-9_-]{20,}\b"), "OpenAI-style API key"),
    (re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b"), "Slack token"),
    (re.compile(r"\bsk_(live|test)_[A-Za-z0-9]{16,}\b"), "Stripe secret key"),
    (re.compile(r"\brk_(live|test)_[A-Za-z0-9]{16,}\b"), "Stripe restricted key"),
    (re.compile(r"-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----"), "private key block"),
    (
        re.compile(
            r"(?i)(?:api[_-]?key|secret[_-]?key|access[_-]?token|auth[_-]?token)"
            r"\s*[:=]\s*['\"]?[^\s'\"#,]{12,}"
        ),
        "credential assignment (api_key/secret/token)",
    ),
    (
        re.compile(r"(?i)\bpassword\s*[:=]\s*['\"]?[^\s'\"#,]{8,}"),
        "password assignment",
    ),
    (
        re.compile(r"(?i)\bbearer\s+[A-Za-z0-9._\-+/=]{20,}\b"),
        "Bearer token",
    ),
    (
        re.compile(
            r"(?i)(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis)://[^\s:@/]+:[^\s@/]{3,}@"
        ),
        "database URL with embedded password",
    ),
    (re.compile(r"(?i)\bnpm_[A-Za-z0-9]{20,}\b"), "npm access token"),
    (re.compile(r"(?i)\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\."), "JWT"),
]


def allow() -> None:
    print(json.dumps({"continue": True}))
    sys.exit(0)


def deny(label: str, source: str) -> None:
    print(
        json.dumps(
            {
                "continue": False,
                "user_message": (
                    f"Prompt blocked: possible {label} detected in {source}. "
                    "Remove secrets, use environment variables or a secrets manager, "
                    "and reference them by name instead of pasting values."
                ),
            }
        )
    )
    sys.exit(0)


def scan_text(text: str, source: str) -> bool:
    for pattern, label in PATTERNS:
        if pattern.search(text):
            deny(label, source)
    return True


def scan_attachments(attachments: Iterable[dict]) -> None:
    for attachment in attachments:
        if attachment.get("type") != "file":
            continue
        file_path = attachment.get("file_path")
        if not isinstance(file_path, str) or not file_path:
            continue

        path = Path(file_path)
        if not path.is_file():
            continue

        try:
            if path.stat().st_size > MAX_ATTACHMENT_BYTES:
                deny("large attachment that may contain secrets", f"attachment `{path.name}`")
        except OSError:
            continue

        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue

        scan_text(content, f"attachment `{path.name}`")


def main() -> None:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        deny("invalid hook input", "prompt submission")

    prompt = payload.get("prompt")
    if isinstance(prompt, str) and prompt.strip():
        scan_text(prompt, "your prompt")

    attachments = payload.get("attachments")
    if isinstance(attachments, list):
        scan_attachments(attachments)

    allow()


if __name__ == "__main__":
    main()
