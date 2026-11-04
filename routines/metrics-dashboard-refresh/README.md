# Metrics dashboard refresh

A pattern for refreshing a dashboard from spreadsheets on a schedule so that bad data never reaches the page.

The sample data in this folder is made up. The CSV has no comment lines, because the parser would read them as rows.

## The pattern

1. **Pull.** Download the source sheets to a local cache. Closed periods (last year) come from the cache. Only the open period is downloaded each run.
2. **Parse and validate.** A parser reads the files and checks them: expected tabs and columns exist, no negative amounts, row counts did not collapse, dates fall in range. It writes the output file only when every check passes.
3. **Fail loud.** On a failed check the parser exits non-zero and writes nothing. The run stops and reports the failed check in one line. A renamed tab or column is the usual cause.
4. **Publish the data file only.** The dashboard page never calls the source system. Publishing replaces one data file, and the page and its sharing settings stay as they are.
5. **Report in one line:** the date, the row count, the last closed period, and any notes from the parser.

## Why this shape

- The page has no credentials and no live queries, so it cannot leak or break at view time.
- A parser that exits non-zero turns a silent wrong number into a visible stop.
- Publishing only the data file keeps each run small and reversible.
- Sheets stay read-only for the refresh.

## Files

- [`parse_example.py`](parse_example.py): a stub parser. Replace the schema and checks with yours. It has no data and no identifiers.
- [`data/sample-open-period.csv`](data/sample-open-period.csv): ten made-up rows dated Mar '25 that pass the checks. Replace it with your own export.

## Run it

```bash
[ -d ~/how-i-work ] || git clone https://github.com/DanielErCohen/how-i-work.git ~/how-i-work
cd ~/how-i-work/routines/metrics-dashboard-refresh
python3 parse_example.py --input data/sample-open-period.csv --out dist/data.js
echo $?   # 0 = written, 1 = a check failed and nothing was written
```

The parser creates `dist/` if it is missing. Amounts must be finite numbers: `nan` and `inf` fail the check. A CSV saved by Excel with a byte-order mark works, and a file that is not UTF-8 exits 2. The data file is written to a temporary name and then renamed, so a crash never leaves a half-written file.

## Wire it to a schedule

Write a skill or routine with these steps: download sources, run the parser, publish the data file if the exit code is 0, report. Keep source locations in a private config file. The skill text holds none of them.
