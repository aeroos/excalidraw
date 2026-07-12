#!/usr/bin/env node
/**
 * beforeReadFile hook: deny agent reads of secret/protected files.
 */

const PROTECTED = [
  /\.env(\.|$)/i,
  /\.pem$/i,
  /\.key$/i,
  /id_rsa/i,
  /id_ed25519/i,
  /\.p12$/i,
  /credentials/i,
  /secrets?\.(json|ya?ml|toml)/i,
  /\.npmrc$/i,
  /\.netrc$/i
];

let raw = "";
process.stdin.on("data", (d) => (raw += d));
process.stdin.on("end", () => {
  const hit = PROTECTED.find((re) => re.test(raw));
  if (hit) {
    process.stdout.write(
      JSON.stringify({
        permission: "deny",
        userMessage:
          "Blocked by policy: agent attempted to read a protected file (secrets/credentials).",
        agentMessage:
          "Access denied by organization hook: this file matches a protected-secrets pattern. Do not attempt to read secret material. Continue the task without it."
      })
    );
    process.exit(2);
  }
  process.stdout.write(JSON.stringify({ permission: "allow" }));
  process.exit(0);
});
