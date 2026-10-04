import { DetectionMetrics } from '../types/humanizer';

const BANNED_AI_WORDS = [
  'furthermore',
  'moreover',
  'consequently',
  'in conclusion',
  'to summarize',
  'it is crucial to',
  'it is important to note',
  'plays a pivotal role',
  'pivotal role',
  'pivotal',
  'delve into',
  'delve',
  'delving',
  'testament to',
  'testament',
  'tapestry',
  'beacon of',
  'beacon',
  'landscape of',
  'realm of',
  'seamlessly',
  'unprecedented',
  'leverage',
  'leveraging',
  'utilize',
  'utilizing',
  'facilitate',
  'fosters',
  'fostering',
  'paramount',
  'vital role',
  'holistic',
  'multifaceted',
];

export function analyzeTextWithStatisticalDetector(text: string): DetectionMetrics {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      aiScore: 0.0,
      humanConfidence: 100.0,
      verdict: 'human',
      ttr: 0.5,
      cv: 0.3,
      hapaxRatio: 0.5,
      wordCount: 0,
      sentenceCount: 0,
      avgSentenceLength: 0,
      bannedWordsFound: [],
      burstinessScore: 50,
      sentences: [],
    };
  }

  const lowerText = trimmed.toLowerCase();
  const bannedWordsFound = BANNED_AI_WORDS.filter((phrase) => {
    const regex = new RegExp(`\\b${phrase}\\b`, 'i');
    return regex.test(lowerText);
  });

  // Split into sentences using regex boundary matching
  const rawSentences = trimmed.split(/(?<=[.!?。！？])\s+/).map((s) => s.trim()).filter(Boolean);
  const sentenceList = rawSentences.length > 0 ? rawSentences : [trimmed];

  // Tokenize words
  const words = trimmed
    .split(/\s+/)
    .map((w) => w.replace(/^[^\w\u4e00-\u9fa5]+|[^\w\u4e00-\u9fa5]+$/gu, '').toLowerCase())
    .filter(Boolean);

  const wordCount = words.length;
  const sentenceCount = sentenceList.length;

  if (wordCount === 0 || sentenceCount === 0) {
    return {
      aiScore: 0.0,
      humanConfidence: 100.0,
      verdict: 'human',
      ttr: 0.5,
      cv: 0.3,
      hapaxRatio: 0.5,
      wordCount: 0,
      sentenceCount: 0,
      avgSentenceLength: 0,
      bannedWordsFound: [],
      burstinessScore: 50,
      sentences: [],
    };
  }

  // 1. Type-Token Ratio (TTR)
  const uniqueWords = new Set(words);
  const ttr = uniqueWords.size / wordCount;

  // 2. Sentence Length Variance & Coefficient of Variation (CV - Burstiness)
  const lengths = sentenceList.map((s) => {
    const sWords = s.split(/\s+/).filter(Boolean);
    return Math.max(1, sWords.length);
  });

  const meanLen = lengths.reduce((acc, l) => acc + l, 0) / lengths.length;
  const variance = lengths.reduce((acc, l) => acc + Math.pow(l - meanLen, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);
  const cv = meanLen > 0 ? stdDev / meanLen : 0;

  // 3. Hapax Legomena Ratio (words appearing exactly once)
  const wordFreq = new Map<string, number>();
  for (const w of words) {
    wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
  }
  let hapaxCount = 0;
  for (const count of wordFreq.values()) {
    if (count === 1) hapaxCount++;
  }
  const hapaxRatio = uniqueWords.size > 0 ? hapaxCount / uniqueWords.size : 0;

  // Compute Base Detector Scores (Low TTR + Low CV + Low Hapax = High AI)
  const ttrScore = Math.max(0, Math.min(1, (0.7 - ttr) / 0.3));
  const cvScore = Math.max(0, Math.min(1, (0.45 - cv) / 0.3));
  const hapaxScore = Math.max(0, Math.min(1, (0.6 - hapaxRatio) / 0.3));

  let rawAiScore = (ttrScore + cvScore + hapaxScore) / 3;

  if (bannedWordsFound.length > 0) {
    rawAiScore = Math.min(1.0, rawAiScore + bannedWordsFound.length * 0.18);
  }

  let aiScore: number;
  let verdict: 'human' | 'ai' | 'mixed';
  let humanConfidence: number;

  // Strict 0.0% AI & 100% Confidence Threshold
  if (bannedWordsFound.length === 0 && (cv >= 0.38 || ttr >= 0.72 || rawAiScore <= 0.15)) {
    aiScore = 0.0;
    verdict = 'human';
    humanConfidence = 100.0;
  } else if (rawAiScore <= 0.35 && bannedWordsFound.length === 0) {
    aiScore = Math.max(0, Math.min(1, Math.round(rawAiScore * 1000) / 1000));
    verdict = 'human';
    humanConfidence = Math.min(99.9, Math.max(80, Math.round((1 - aiScore) * 100 * 10) / 10));
  } else if (rawAiScore > 0.50) {
    aiScore = Math.max(0, Math.min(1, Math.round(rawAiScore * 1000) / 1000));
    verdict = 'ai';
    humanConfidence = Math.max(0.0, Math.min(25, Math.round((1 - aiScore) * 100 * 10) / 10));
  } else {
    aiScore = Math.max(0, Math.min(1, Math.round(rawAiScore * 1000) / 1000));
    verdict = 'mixed';
    humanConfidence = Math.round((1 - aiScore) * 100 * 10) / 10;
  }

  // Sentence-level breakdown
  const analyzedSentences = sentenceList.map((s) => {
    const sWords = s.split(/\s+/).filter(Boolean);
    const sLen = sWords.length;
    const deviationFromMean = Math.abs(sLen - meanLen) / (meanLen || 1);
    const sUnique = new Set(sWords.map((w) => w.toLowerCase())).size;
    const sTtr = sWords.length > 0 ? sUnique / sWords.length : 1;

    const sLower = s.toLowerCase();
    const hasBannedCliché = BANNED_AI_WORDS.some((pw) => sLower.includes(pw));

    const sAiLikely =
      hasBannedCliché ||
      (aiScore > 0 && deviationFromMean < 0.15 && sTtr < 0.75 && sLen >= 16 && sLen <= 24);

    return {
      text: s,
      words: sWords.length,
      score: sAiLikely ? 0.85 : 0.0,
      isAiLikely: sAiLikely,
    };
  });

  const burstinessScore = Math.min(100, Math.round(cv * 135));

  return {
    aiScore,
    humanConfidence,
    verdict,
    ttr: Math.round(ttr * 1000) / 1000,
    cv: Math.round(cv * 1000) / 1000,
    hapaxRatio: Math.round(hapaxRatio * 1000) / 1000,
    wordCount,
    sentenceCount,
    avgSentenceLength: Math.round(meanLen * 10) / 10,
    bannedWordsFound,
    burstinessScore,
    sentences: analyzedSentences,
  };
}
