/**
 * Curated gradient palette for certification accent bars.
 * Generates a deterministic gradient from a certificate's unique ID
 * so the same cert always gets the same color, but no admin input is needed.
 */

const GRADIENT_PALETTE = [
  "from-blue-500 to-cyan-400",
  "from-violet-500 to-fuchsia-500",
  "from-orange-500 to-amber-400",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-pink-400",
  "from-sky-400 to-blue-600",
  "from-indigo-500 to-purple-500",
  "from-lime-400 to-emerald-500",
  "from-red-500 to-orange-400",
  "from-cyan-400 to-blue-500",
  "from-fuchsia-500 to-pink-500",
  "from-amber-400 to-yellow-300",
] as const;

/**
 * Derives a deterministic index from a UUID string using a simple hash.
 * Ensures the same ID always maps to the same gradient.
 */
function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

export function getGradient(certId: string): string {
  const index = hashId(certId) % GRADIENT_PALETTE.length;
  return GRADIENT_PALETTE[index];
}
