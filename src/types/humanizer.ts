export interface PipelineStep {
  step: number;
  engine: string;
  direction: string;
  output: string;
  length: number;
  durationMs?: number;
}

export interface DetectionMetrics {
  aiScore: number;
  humanConfidence: number;
  verdict: 'human' | 'ai' | 'mixed';
  ttr: number;
  cv: number;
  hapaxRatio: number;
  wordCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  bannedWordsFound?: string[];
  burstinessScore?: number;
  sentences: Array<{
    text: string;
    words: number;
    score: number;
    isAiLikely: boolean;
  }>;
}

export interface HumanizeResponse {
  result: string;
  steps: PipelineStep[];
  processing_time_ms: number;
  method: string;
  metricsBefore?: DetectionMetrics;
  metricsAfter?: DetectionMetrics;
}

export interface ShowcaseItem {
  id: string;
  number: string;
  title: string;
  topic: string;
  confidence: number;
  verdict: 'human' | 'ai';
  originalInput: string;
  step1: {
    engine: string;
    direction: string;
    output: string;
  };
  step2: {
    engine: string;
    direction: string;
    output: string;
  };
  step3: {
    engine: string;
    direction: string;
    output: string;
  };
  step4: {
    engine: string;
    direction: string;
    output: string;
  };
  whyWorked: string;
}

export interface HumanizerConfig {
  provider: 'gemini' | 'deepseek' | 'openrouter' | 'atlascloud' | 'custom';
  model?: string;
  temperature: number;
  intermediateLang: 'fi' | 'de' | 'ko' | 'ja';
  targetLang: string;
  mode?: 'ultra' | 'standard' | 'casual' | 'academic';
  deepseekApiKey?: string;
  openrouterApiKey?: string;
  niutransApiKey?: string;
  customBaseUrl?: string;
  customApiKey?: string;
}
