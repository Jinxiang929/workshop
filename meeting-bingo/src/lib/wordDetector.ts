/**
 * Escape special regex characters.
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalize text for comparison.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .trim();
}

/**
 * Match a needle inside the transcript using word boundaries.
 * Works for both single words and multi-word phrases — boundaries on both ends
 * prevent false positives like "scalable" matching "scale" or a phrase matching
 * mid-word (plan §2 / §3: avoid false BINGO wins).
 */
function matchesWithBoundary(transcript: string, needle: string): boolean {
  const escaped = escapeRegex(needle);
  // \b is unreliable next to non-word chars (e.g. "CI/CD"); anchor on
  // start/whitespace and end/whitespace/punctuation instead.
  const regex = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i');
  return regex.test(transcript);
}

/**
 * Check if the transcript contains any card words.
 * Returns the array of detected (newly matched) words.
 */
export function detectWords(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const normalizedTranscript = normalizeText(transcript);
  const detected: string[] = [];

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;

    const normalizedWord = normalizeText(word);
    if (matchesWithBoundary(normalizedTranscript, normalizedWord)) {
      detected.push(word);
    }
  }

  return detected;
}

/**
 * Common spoken variations/synonyms. Speech transcribes without punctuation,
 * so these map spoken forms back to the card word.
 *
 * NOTE: the 'api' → 'interface' alias from the reference design was removed —
 * it caused "user interface" to falsely fill API and trigger false BINGOs
 * (plan §2 / §3).
 */
export const WORD_ALIASES: Record<string, string[]> = {
  'ci/cd': ['ci cd', 'cicd', 'continuous integration'],
  mvp: ['minimum viable product', 'm v p'],
  roi: ['return on investment', 'r o i'],
  api: ['a p i'],
  devops: ['dev ops', 'dev-ops'],
  'a/b test': ['a b test', 'ab test', 'split test'],
};

/**
 * Enhanced detection that also checks aliases.
 */
export function detectWordsWithAliases(
  transcript: string,
  cardWords: string[],
  alreadyFilled: Set<string>,
): string[] {
  const detected = detectWords(transcript, cardWords, alreadyFilled);
  const normalizedTranscript = normalizeText(transcript);

  for (const word of cardWords) {
    if (alreadyFilled.has(word.toLowerCase())) continue;
    if (detected.includes(word)) continue;

    const aliases = WORD_ALIASES[word.toLowerCase()];
    if (!aliases) continue;

    for (const alias of aliases) {
      if (matchesWithBoundary(normalizedTranscript, normalizeText(alias))) {
        detected.push(word);
        break;
      }
    }
  }

  return detected;
}
