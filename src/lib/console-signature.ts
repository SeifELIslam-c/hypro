/**
 * Developer Signature for Browser Console — Airbnb Style
 * Designed & Developed by Seif El Islam
 */
export function initConsoleSignature() {
  if (typeof window === "undefined") return;

  // HYPRO Arch — outer arch + inner cutout + two pillars + base
  const archLogo = [
    "       ▄████▄       ",
    "     ▄█      █▄     ",
    "    █▌        ▐█    ",
    "    █   ▄██▄   █    ",
    "    █  █▌  ▐█  █    ",
    "    █  █    █  █    ",
    "    █  █    █  █    ",
    "    █  █    █  █    ",
  ].join("\n");

  console.log(
    `%c${archLogo}`,
    "color: #D4AF37; font-weight: 900; font-family: monospace; font-size: 13px; line-height: 1.2;"
  );

  console.log(
    "%cDesigned & Developed by Seif El Islam",
    "color: #E2E8F0; font-size: 12px; font-weight: 500; font-family: 'Work Sans', -apple-system, sans-serif;"
  );
}
