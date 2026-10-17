#!/usr/bin/env bash
# slop-check.sh: grep-able no-ai-slop bans for written deliverables.
# The pattern lists below are the ruleset; intent-level families belong in
# your global CLAUDE.md. Adapted from petergyang/no-ai-slop (MIT).
# Curly apostrophes and HTML entities are normalized before matching, fenced code
# and <script>/<style> bodies are skipped, the locale is pinned, and markdown/HTML
# anchors catch negative-listing openers.
#
# Usage: slop-check.sh <draft-file> [more-files...]
# Exit 0 = clean, 1 = hits to fix or justify, 2 = bad arguments or unreadable file.

set -uo pipefail
export LC_ALL=en_US.UTF-8

if [[ $# -eq 0 ]]; then
  echo "usage: slop-check.sh <draft-file> [more-files...]" >&2
  exit 2
fi

for f in "$@"; do
  if [[ ! -f "$f" || ! -r "$f" ]]; then
    echo "slop-check: cannot read '$f'" >&2
    exit 2
  fi
done

# Sanitized copies, line numbers preserved: curly apostrophes and HTML entities
# become ASCII so one pattern set matches what models actually emit; fenced code
# blocks and <script>/<style> bodies are blanked so code never trips prose checks.
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

ORIG=()
SAN=()
i=0
for f in "$@"; do
  s="$TMP/$i"
  awk -v q="'" -v rq="’" -v em="—" '
    {
      line = $0
      low = tolower(line)
      if (fence) { if (line ~ /^[[:space:]]*(```|~~~)/) fence = 0; print ""; next }
      if (line ~ /^[[:space:]]*(```|~~~)/) { fence = 1; print ""; next }
      if (inblk) { if (low ~ /<\/(script|style)>/) inblk = 0; print ""; next }
      if (low ~ /<(script|style)([ >]|$)/) {
        if (low !~ /<\/(script|style)>/) inblk = 1
        print ""; next
      }
      gsub(rq, q, line)
      gsub(/&rsquo;|&#8217;|&#x2019;|&apos;/, q, line)
      gsub(/&mdash;|&#8212;|&#x2014;/, em, line)
      print line
    }
  ' "$f" > "$s"
  ORIG[$i]="$f"
  SAN[$i]="$s"
  i=$((i+1))
done

hits=0

rename_paths() {
  local text="$1" j
  for j in "${!ORIG[@]}"; do
    text="${text//$TMP\/$j:/${ORIG[$j]}:}"
  done
  printf '%s\n' "$text"
}

check() {
  local label="$1" pattern="$2"
  local out
  out=$(grep -inHE -- "$pattern" "${SAN[@]}")
  if [[ -n "$out" ]]; then
    hits=1
    echo "── $label"
    rename_paths "$out"
    echo
  fi
}

# Case-sensitive variant, for patterns that depend on capitalization.
check_cs() {
  local label="$1" pattern="$2"
  local out
  out=$(grep -nHE -- "$pattern" "${SAN[@]}")
  if [[ -n "$out" ]]; then
    hits=1
    echo "── $label"
    rename_paths "$out"
    echo
  fi
}

# 1. Binary contrasts / negation-antithesis - "X, not Y" and variants. State the positive claim.
check "binary contrast / negation-antithesis" ', not |, never |isn.t [^,.]{1,40}, it|not just [^,.]{1,40},? but|it.s not [^,.]{1,40}, it.s'

# 1b. Negative-listing sentence openers ("Not a dashboard. Not a tool."), incl. markdown list/
#     header/quote markers and HTML tags. Case-sensitive on purpose.
check_cs "negative-listing opener" '(^([[:space:]>#*-]|")*|\. |<[a-zA-Z][^>]*>)Not (a|an|the) '

# 2. Banned words - inflated AI vocabulary. Use plain verbs, plain "is/are".
#    Boundaries are deliberate: utilization, test harness, robustness, empowered-team,
#    elevated privileges, facilitator, and debt leverage are legitimate and stay clean.
check "banned words" '\bdelve|\bfoster\b|\bleverag(e|es|ing) (the|our|its|their|your|existing|every)|\butili[sz]e(s|d)?\b|\butili[sz]ing|\bfacilitate(s|d)?\b|\bfacilitating|\bempower(s|ing|ment)?\b|\bstreamlin|\brobust\b|cutting-edge|paradigm shift|game.chang|this is huge|changes everything|tapestry|\brealm\b|beacon|multifacet|meticulous|intricate|paramount|transformativ|\belevat(e|es|ing) |\bembark|supercharge|\bharness(es|ing)? the|ever-evolving|seamless|pivotal|crucial|\bnuanced|the [a-z]+ landscape|\bunlock(s|ing)? the|world-class|\bvibrant\b|\bunderpin'

# 3. Empty phrases and transitional filler - cut when they delay the point.
check "empty phrases / transitional filler" "it's worth noting|important to note|at the end of the day|when it comes to|at its core|in today's world|in the age of|in the world of|the reality is|the truth is|in terms of|with regard to|in order to|going forward|let's dive in|that said,|notably,|importantly,"

# 4. Throat-clearing and faux-insight setups. Delete and state the point.
check "throat-clearing / faux-insight" "here's the thing|let me be clear|i'll be honest|uncomfortable truth|what most people get wrong|nobody tells you|everyone misses|what if i told you|think about it:|plot twist:"

# 5. Importance puffery and -ing analysis clauses. State the fact; give the consequence.
check "puffery / -ing analysis" 'testament to|pivotal moment|plays a vital role|solidif|underscor(es|ing) (the|its|their|a|how|that|why)|highlighting the|showcasing|reflecting the|marks a significant'

# 6. Summary-recap endings. End on the last concrete point or next action.
check "recap endings" '\bin conclusion|\bultimately,|\boverall,|\bin summary'

# 7. Weasel attribution. Name the source or drop the claim.
check "weasel attribution" 'experts agree|studies show|reports suggest|widely regarded|many believe'

# 8. Fake-strong verbs. Prefer "is" and "has".
check "fake-strong verbs" 'serves as|stands as|acts as a hub|boasts'

# 9. Assistant-isms - chat-bot residue in deliverables.
check "assistant-isms" "certainly!|great question|i hope this helps|let me know if|happy to help|feel free to|i.d be happy to"

# 11. Hedged recommendations - a recommendation is ONE pick, committed.
#     Catches the split ("Now (this release): ... Next (the actual decision): ..."), the staged
#     hedge ("ship X as v0, grow it into Y"), the blend ("A with B's rows inside it"), and
#     fence-sitting ("instead of picking sides"). Rule: one recommendation per decision.
check "hedged recommendation" 'now \((this|the)|next \((the|this)|as (a|the) v0\b|grow (it|this|them|that) into|ship [^,.]{1,40}, (keep|hold|park)|with [^,.]{1,40}.s [a-z]+ inside|instead of picking sides|without betting on|while the [^,.]{1,40} (breathes|settles|matures)'

# 10. Dashes used as connectives - em-dash, horizontal bar, or spaced en-dash.
#     Max 2 per file, 0 in short copy. Unspaced en-dashes in ranges (2019–2026) stay clean.
for j in "${!SAN[@]}"; do
  n=$(grep -oE -- '—|―|‒| – ' "${SAN[$j]}" | wc -l | tr -d ' ')
  if [[ "$n" -gt 2 ]]; then
    hits=1
    echo "── connective dashes: $n in ${ORIG[$j]} (max 2 per file, 0 in short copy)"
    grep -nE -- '—|―|‒| – ' "${SAN[$j]}" | head -10
    echo
  fi
done

if [[ "$hits" -eq 0 ]]; then
  echo "slop-check: clean"
else
  echo "slop-check: hits above - fix each or justify (a hit inside a quote or code sample is fine)."
fi
exit "$hits"
