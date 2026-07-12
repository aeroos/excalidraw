#!/usr/bin/env node
/**
 * beforeShellExecution hook: deny destructive or exfil-shaped commands.
 * Same defensive design as protect-secrets.js: scan full payload,
 * emit deny JSON, exit(2), rely on failClosed:true for crash safety.
 */

const BLOCKED = [
  /rm\s+-rf\s+[^\s]*\/(?!tmp)/i,   // recursive force delete outside tmp
  /rm\s+-rf\s+\.(\s|$)/i,          // rm -rf .
  /npm\s+publish/i,
  /yarn\s+publish/i,
  /git\s+push\s+.*--force/i,
  /curl[^\n]*(\.env|\.pem|id_rsa)/i, // shipping secret files anywhere
  /cat\s+[^\n]*\.env/i,
  /(printenv|env)\s*\|\s*curl/i
];

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  const hit = BLOCKED.find((re) => re.test(raw));
  if (hit) {
    process.stdout.write(
      JSON.stringify({
        permission: "deny",
        userMessage:
          "Blocked by policy: this shell command matches a destructive/exfiltration pattern.",
        agentMessage:
          "Command denied by organization hook. Choose a non-destructive approach, or stop and report why this command seemed necessary."
      })
    );
    process.exit(2);
  }
  process.stdout.write(JSON.stringify({ permission: "allow" }));
  process.exit(0);
});
