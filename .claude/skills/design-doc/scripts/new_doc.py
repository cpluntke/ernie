#!/usr/bin/env python3
"""Scaffold a new design doc from docs/TEMPLATE.md.

Picks the next sequential number, copies the template with the header filled
in, and appends a row to the index table in docs/README.md.

Usage:
    python3 new_doc.py "Short title" [--owner @name] [--phase Sketch|Prototype] [--status Draft]
"""
import argparse
import datetime
import pathlib
import re
import subprocess
import sys


def repo_root() -> pathlib.Path:
    try:
        out = subprocess.check_output(
            ["git", "rev-parse", "--show-toplevel"], text=True, stderr=subprocess.DEVNULL
        )
        return pathlib.Path(out.strip())
    except (subprocess.CalledProcessError, FileNotFoundError):
        return pathlib.Path(__file__).resolve().parents[4]


def slugify(title: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return slug or "untitled"


def next_number(docs: pathlib.Path) -> int:
    nums = [
        int(m.group(1))
        for p in docs.glob("*.md")
        if (m := re.match(r"^(\d{4})-", p.name))
    ]
    return max(nums, default=0) + 1


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("title", help="Short human-readable title")
    ap.add_argument("--owner", default="@owner", help="Owner handle (default: @owner)")
    ap.add_argument("--status", default="Draft", help="Initial status (default: Draft)")
    ap.add_argument("--phase", default="Sketch", choices=["Sketch", "Prototype"],
                    help="Project phase this doc belongs to (default: Sketch)")
    args = ap.parse_args()

    docs = repo_root() / "docs"
    template = docs / "TEMPLATE.md"
    readme = docs / "README.md"
    if not template.exists():
        print(f"error: {template} not found", file=sys.stderr)
        return 1

    num = next_number(docs)
    nnnn = f"{num:04d}"
    slug = slugify(args.title)
    dest = docs / f"{nnnn}-{slug}.md"
    if dest.exists():
        print(f"error: {dest} already exists", file=sys.stderr)
        return 1

    today = datetime.date.today().isoformat()
    body = template.read_text()
    body = body.replace("# NNNN — <Feature or slice name>", f"# {nnnn} — {args.title}", 1)
    body = body.replace("| **Phase** | Sketch |", f"| **Phase** | {args.phase} |", 1)
    body = body.replace("| **Status** | Draft |", f"| **Status** | {args.status} |", 1)
    body = body.replace("| **Owner** | @name |", f"| **Owner** | {args.owner} |", 1)
    body = body.replace("| **Last updated** | YYYY-MM-DD |", f"| **Last updated** | {today} |", 1)
    body = body.replace("docs/assets/NNNN/", f"docs/assets/{nnnn}/")
    body = body.replace("| YYYY-MM-DD | Created | |", f"| {today} | Created | |", 1)
    dest.write_text(body)

    (docs / "assets" / nnnn).mkdir(parents=True, exist_ok=True)

    # Add index row; replace the placeholder row if it's still there.
    if readme.exists():
        text = readme.read_text()
        row = f"| {nnnn} | [{args.title}]({dest.name}) | {args.phase} | {args.status} |"
        placeholder = "| — | _none yet_ | | |"
        if placeholder in text:
            text = text.replace(placeholder, row, 1)
        else:
            lines = text.rstrip("\n").split("\n")
            last = max(i for i, l in enumerate(lines) if l.startswith("|"))
            lines.insert(last + 1, row)
            text = "\n".join(lines) + "\n"
        readme.write_text(text)

    print(dest.relative_to(repo_root()))
    return 0


if __name__ == "__main__":
    sys.exit(main())
