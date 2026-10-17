#!/usr/bin/env python3
"""Example parser stub for the metrics dashboard refresh pattern.

Reads a CSV with the columns in REQUIRED, runs checks, and writes a JavaScript
data file only if every check passes, creating the output folder if it is
missing. Exit 0 = written. Exit 1 = a check failed, nothing written. Exit 2 =
bad arguments or unreadable input.

Replace REQUIRED, the checks and the output shape with your own.
"""
import argparse
import csv
import json
import os
import sys
from datetime import date

REQUIRED = ["date", "category", "amount"]
MIN_ROWS = 1          # raise this to the lowest row count you expect
RANGE = (date(2000, 1, 1), date(2100, 1, 1))


def fail(msg):
    print(f"fail: {msg}", file=sys.stderr)
    sys.exit(1)


def load(path):
    try:
        with open(path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            missing = [c for c in REQUIRED if c not in (reader.fieldnames or [])]
            if missing:
                fail(f"missing columns {missing}; a column was probably renamed")
            return list(reader)
    except OSError as e:
        print(f"error: cannot read {path}: {e}", file=sys.stderr)
        sys.exit(2)


def check(rows):
    if len(rows) < MIN_ROWS:
        fail(f"only {len(rows)} rows, expected at least {MIN_ROWS}")
    clean = []
    for i, r in enumerate(rows, start=2):
        try:
            d = date.fromisoformat(r["date"])
            amount = float(r["amount"])
        except ValueError:
            fail(f"row {i}: bad date or amount")
        if not RANGE[0] <= d <= RANGE[1]:
            fail(f"row {i}: date {d} outside range")
        if amount < 0:
            fail(f"row {i}: negative amount")
        clean.append({"date": d.isoformat(), "category": r["category"].strip(), "amount": amount})
    return clean


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--input", required=True)
    p.add_argument("--out", required=True)
    a = p.parse_args()

    rows = check(load(a.input))
    last = max(r["date"] for r in rows)
    out_dir = os.path.dirname(a.out)
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write("window.DATA = " + json.dumps(rows, indent=2) + ";\n")
    print(f"ok: {len(rows)} rows, last date {last}")


if __name__ == "__main__":
    main()
