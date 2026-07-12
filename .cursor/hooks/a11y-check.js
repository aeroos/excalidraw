#!/usr/bin/env node
/**
 * afterFileEdit hook: accessibility continuity check.
 *
 * The 101-to-201 line this powers:
 * "In 101 the accessibility floor was a rule the model was asked to
 *  honor. Now it runs after every edit, whether the model remembered
 *  or not."
 *
 * Cursor sends a JSON payload:
 *   { file_path, edits: [{ old_string, new_string }, ...], ... }
 * We scan the NEW content that was just written. We prefer the
 * edits[].new_string from the payload (authoritative, no disk race),
 * and fall back to reading file_path from disk if edits are absent.
 *
 * Check: icon-only <button> (svg/img/Icon child) with no
 *        aria-label / aria-labelledby in its opening tag.
 * Heuristic, and say so if asked: production would call axe-core /
 * eslint-plugin-jsx-a11y. The hook is the delivery mechanism; the
 * check is pluggable.
 */

const fs = require("fs");
const FRONTEND = /\.(tsx|jsx)$/i;

function findIconOnlyButtonsWithoutName(src) {
  let count = 0;
  const re = /<button\b/gi;
  let m;
  while ((m = re.exec(src)) !== null) {
    const start = m.index;
    let i = m.index + m[0].length;
    let depth = 0;
    let closeIdx = -1;
    while (i < src.length) {
      const ch = src[i];
      if (ch === "{") depth++;
      else if (ch === "}") depth = Math.max(0, depth - 1);
      else if (ch === ">" && depth === 0) { closeIdx = i; break; }
      i++;
    }
    if (closeIdx === -1) continue;
    const attrText = src.slice(start, closeIdx + 1);
    const after = src.slice(closeIdx + 1).replace(/^\s+/, "");
    const hasIconChild = /^<\s*(svg|img|Icon)\b/i.test(after);
    if (!hasIconChild) continue;
    const hasName = /aria-label\b/i.test(attrText) || /aria-labelledby\b/i.test(attrText);
    if (!hasName) count++;
  }
  return count;
}

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  let payload = {};
  try { payload = JSON.parse(raw); } catch (e) { process.exit(0); }

  const filePath = payload.file_path || "";
  if (filePath && !FRONTEND.test(filePath)) process.exit(0);

  // Gather the content to scan: prefer new_string(s) from the payload.
  let content = "";
  if (Array.isArray(payload.edits) && payload.edits.length) {
    content = payload.edits.map((e) => (e && e.new_string) || "").join("\n");
  } else if (filePath) {
    try { content = fs.readFileSync(filePath, "utf8"); } catch (e) { process.exit(0); }
  }

  if (!content) process.exit(0);

  const count = findIconOnlyButtonsWithoutName(content);
  if (count > 0) {
    const label = filePath.split("/").pop() || filePath;
    process.stdout.write(
      JSON.stringify({
        agentMessage:
          "Accessibility floor check (org hook) flagged this edit. Fix before proceeding:\n" +
          `${label}: ${count} icon-only <button> without an accessible name. ` +
          "Add an aria-label (or aria-labelledby) so screen readers announce the control.",
        userMessage:
          "A11y hook: " + count + " icon-only button(s) missing an accessible name."
      })
    );
    process.exit(0);
  }
  process.exit(0);
});