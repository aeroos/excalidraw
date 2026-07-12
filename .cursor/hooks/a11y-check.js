#!/usr/bin/env node
/**
 * afterFileEdit hook: accessibility continuity check.
 * Checks (on edited frontend files only):
 *  1. <button ...> with no aria-label / aria-labelledby and no
 *     visible text child on the same tag block (icon-only button risk)
 *  2. onClick on a div/span (non-interactive element made clickable)
 */

const fs = require("fs");

const FRONTEND = /\.(tsx|jsx)$/i;

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  // Defensive: pull any frontend-looking file paths out of the payload
  // rather than depending on one exact field name.
  const paths = [...new Set(raw.match(/[\w./-]+\.(?:tsx|jsx)/g) || [])];
  const findings = [];

  for (const p of paths) {
    if (!FRONTEND.test(p) || !fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");

    const iconOnlyButtons = (src.match(/<button(?![^>]*aria-label)(?![^>]*aria-labelledby)[^>]*>\s*<(svg|img|Icon)/gi) || []).length;
    if (iconOnlyButtons > 0) {
      findings.push(
        `${p}: ${iconOnlyButtons} icon-only <button> without an accessible name (aria-label/aria-labelledby).`
      );
    }

    const clickableDivs = (src.match(/<(div|span)[^>]*onClick/gi) || []).length;
    if (clickableDivs > 0) {
      findings.push(
        `${p}: ${clickableDivs} onClick on a non-interactive element (div/span). Use a button or add role + keyboard handling.`
      );
    }
  }

  if (findings.length) {
    process.stdout.write(
      JSON.stringify({
        agentMessage:
          "Accessibility floor check (org hook) flagged issues in this edit. Fix before proceeding:\n" +
          findings.join("\n"),
        userMessage:
          "A11y hook: " + findings.length + " finding(s) on the last edit."
      })
    );
    process.exit(0);
  }
  process.exit(0);
});
